import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Box } from "@chakra-ui/react";
import AdminLayout from "../../components/AdminLayout";
import { Owner } from "../../types/Owner";

export default function Reviews() {
  return (
    <AdminLayout>
      <Box mx="auto" maxW="2xl" w="full" my="30px">
        Reviews
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

  const props: {
    user: Owner | null;
  } = {
    user: null,
  };

  if (!data.session?.user) {
    return redirectObj;
  }

  return { props };
};
