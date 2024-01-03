import {
  HStack,
  Text,
  Box,
  Spacer,
  Menu,
  MenuButton,
  Avatar,
  MenuItem,
  MenuList,
  MenuGroup,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
// import ThemeToggleButton from "./ThemeToggleButton";
import LogoButton from "./LogoButton";
import Link from "next/link";
import { useUserContext } from "../context";
import supabase from "../libs/supabase-browser";
import { MdPerson, MdExitToApp } from "react-icons/md";

export default function AdminTopBar() {
  const router = useRouter();
  const borderColor = useColorModeValue("blackAlpha.100", "whiteAlpha.200");
  const { user } = useUserContext();

  function signOut() {
    supabase.auth.signOut();
    router.push("/admin/login");
  }
  return (
    <HStack
      minH="50px"
      w="full"
      borderBottom="1px"
      borderColor={borderColor}
      px="10px"
    >
      <LogoButton onClick={() => router.push("/")} />
      <Spacer />
      {/* <ThemeToggleButton /> */}
      <Menu>
        <MenuButton
          as={Avatar}
          aria-label="Options"
          variant="outline"
          size="sm"
          cursor="pointer"
          src={user?.profile_picture}
          _hover={{ filter: "brightness(95%)" }}
        />

        <MenuList>
          <MenuGroup title={"Hello " + user?.full_name}>
            <Link href="/admin/profile">
              <MenuItem icon={<MdPerson />}>Profile</MenuItem>
            </Link>
            <MenuItem onClick={signOut} icon={<MdExitToApp />}>
              Sign Out
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    </HStack>
  );
}
