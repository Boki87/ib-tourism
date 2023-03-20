import { ReactElement } from "react";
import { Box, Button } from "@chakra-ui/react";
import { VStack, Text, Stack } from "@chakra-ui/react";
import { MdDashboard, MdCreditCard, MdStorefront } from "react-icons/md";
import { BsPeopleFill } from "react-icons/bs";
import { useRouter } from "next/router";

export const navList = [
  {
    title: "Dashboard",
    icon: <MdDashboard />,
    href: "/admin",
  },
  {
    title: "Venues",
    icon: <MdStorefront />,
    href: "/admin/venues",
  },
  {
    title: "Devices",
    icon: <MdCreditCard />,
    href: "/admin/devices",
  },
  // {
  //   title: "Employees",
  //   icon: <BsPeopleFill />,
  //   href: "/admin/employees",
  // },
];

export default function AdminNavigation({
  isHorizontal,
}: {
  isHorizontal?: boolean;
}) {
  const router = useRouter();
  return (
    <Stack
      direction={`${isHorizontal ? "row" : "column"}`}
      h="full"
      w="full"
      p="10px"
      justifyContent={isHorizontal ? "space-evenly" : ""}
    >
      {navList.map((item) => (
        <NavItem
          title={item.title}
          icon={item.icon}
          href={item.href}
          path={router.asPath}
          key={item.href}
        />
      ))}
    </Stack>
  );
}

function NavItem({
  title,
  icon,
  href,
  path,
}: {
  title: string;
  icon: ReactElement;
  href: string;
  path: string;
}) {
  const router = useRouter();

  let isActive = false;
  if (href === "/admin" && path === "/admin") {
    isActive = true;
  } else {
    isActive = path.includes(href.split("/admin/")[1]);
  }

  return (
    <Button
      variant={isActive ? "solid" : "ghost"}
      w="full"
      onClick={() => router.push(href)}
      maxW={{ base: "40px", md: "full" }}
    >
      <Box
        w={{ base: "none", md: "full" }}
        h="full"
        display="flex"
        alignItems="center"
      >
        <Box
          h="full"
          display="flex"
          alignItems="center"
          mr={{ base: "0px", md: "10px" }}
        >
          {icon}
        </Box>
        <Text display={{ base: "none", md: "inline-block" }}>{title}</Text>
      </Box>
    </Button>
  );
}
