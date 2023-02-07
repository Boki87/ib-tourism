import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  Avatar,
  Box,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import AdminLayout from "../../../components/AdminLayout";
import { Venue } from "../../../types/Venue";
import { MdStorefront } from "react-icons/md";
import { useRouter } from "next/router";

export default function Venues({ venues }: { venues?: Venue[] }) {
  const router = useRouter();
  const borderColor = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
  return (
    <AdminLayout>
      <Box maxW="2xl" mx="auto">
        <HStack mt="20px" mb="30px">
          <Box fontSize="6xl">
            <MdStorefront />
          </Box>
          <Box>
            <Text fontSize="xl" fontWeight="bolder">
              Venues
            </Text>
            <Text>List of all of your venues.</Text>
            <Text>Select one to view details and edit.</Text>
          </Box>
        </HStack>
        <Stack w="full">
          {venues?.map((venue) => {
            return (
              <HStack
                w="full"
                h="60px"
                border="1px solid"
                borderColor={borderColor}
                borderRadius="lg"
                p="10px"
                cursor="pointer"
                _hover={{ borderColor: "blue.300" }}
                onClick={() => {
                  router.push(`/admin/venues/${venue.id}`);
                }}
                key={venue.id}
              >
                <Avatar src={venue.logo} name={venue.title} mr="15px" />
                <Text isTruncated>{venue.title}</Text>
              </HStack>
            );
          })}
        </Stack>
      </Box>
    </AdminLayout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const { data } = await supabase.auth.getSession();

  const redirectObj = {
    redirect: {
      destination: "/admin/login",
      permanent: false,
    },
  };

  if (!data.session?.user) {
    return redirectObj;
  }

  const { data: ownerData, error } = await supabase
    .from("owners")
    .select()
    .match({ id: data.session.user.id })
    .single();

  if (error) return redirectObj;

  const { data: venues, error: venuesError } = await supabase
    .from("venues")
    .select()
    .match({ owner_id: ownerData.id })
    .order("created_at", { ascending: true });

  if (!venuesError && venues.length == 1) {
    console.log("venues redirect", venues.length);
    return {
      redirect: {
        destination: `/admin/venues/${venues[0].id}`,
      },
    };
  }

  return {
    props: {
      venues,
    },
  };
};
