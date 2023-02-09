import { useEffect, useState, ReactNode } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import supabase from "../libs/supabase-browser";
import { Box, HStack, useColorModeValue } from "@chakra-ui/react";
import AdminNavigation from "../components/AdminNavigation";
import AdminTopBar from "./AdminTopBar";
import UserFirstLogin from "./UserFirstLogin";
import { useUserContext } from "../context";
import { useRouter } from "next/router";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useUser();

  const { user: userFromState, setUser } = useUserContext();
  const [showSetupForm, setShowSetupForm] = useState(false);

  const borderColor = useColorModeValue("blackAlpha.100", "whiteAlpha.200");
  const bgColor = useColorModeValue("white", "gray.800");

  async function fetchOwner(userId: string) {
    try {
      const { data, error } = await supabase
        .from("owners")
        .select()
        .match({ id: userId })
        .single();

      if (error) throw Error(error.message);

      setUser(data);
    } catch (e) {
      console.log(e);
      setUser(null);
      supabase.auth.signOut();
      router.push("/admin/login");
    }
  }

  useEffect(() => {
    if (user) {
      fetchOwner(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (userFromState && !userFromState.is_setup) {
      setShowSetupForm(true);
    } else {
      setShowSetupForm(false);
    }
  }, [userFromState]);

  if (showSetupForm) {
    return <UserFirstLogin />;
  }

  return (
    <Box
      w="full"
      h="full"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <AdminTopBar />
      <HStack flex="1" display="flex" maxH="full">
        <Box
          h="full"
          minW={{ sm: "40px", lg: "200px" }}
          borderRight="1px"
          borderColor={borderColor}
          display={{ base: "none", sm: "block" }}
        >
          <AdminNavigation />
        </Box>
        <Box
          flex="1"
          maxW="full"
          maxH="full"
          h="full"
          overflow="auto"
          px="20px"
          position="relative"
        >
          <Box maxW="5xl" mx="auto" display="block" mb="160px">
            {children}
          </Box>
        </Box>
      </HStack>

      <Box
        display={{ base: "block", sm: "none" }}
        w="full"
        h="60px"
        border="1px"
        borderColor={borderColor}
        position="absolute"
        bottom="0px"
        left="0px"
        bg={bgColor}
      >
        <AdminNavigation isHorizontal />
      </Box>
    </Box>
  );
}
