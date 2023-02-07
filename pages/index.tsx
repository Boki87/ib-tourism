export default function Home() {
  return <>Landing Page</>;
}

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/admin",
      parmanent: false,
    },
  };
};
