import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import supabase from "../../libs/supabase-browser";
import { Owner } from "../../types/Owner";
import Button from "../../components/Button";
import { useRouter } from "next/router";
import AdminLayout from "../../components/AdminLayout";

export default function AdminHome({ user }: { user: Owner }) {
  const router = useRouter();

  return (
    <AdminLayout>
      Admin dashbaord
      {JSON.stringify(user)}
      <Button
        onClick={() => {
          supabase.auth.signOut();
          router.push("/admin/login");
        }}
      >
        LOG OUT
      </Button>
      <Button
        onClick={() => {
          router.push("/admin/venues");
        }}
      >
        Venues
      </Button>
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

  return {
    props: {
      user: ownerData,
    },
  };
};
