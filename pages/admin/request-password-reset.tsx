import { useState, SyntheticEvent } from "react";
import { APP_URL, supabase } from "../../libs/supabase";
import {
  Text,
  Button as CButton,
  Box,
  Center,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import Button from "../../components/Button";
import Logo from "../../public/images/logo.svg";
import Image from "next/image";

export default function RequestPasswordReset() {
  const toast = useToast();
  const [formState, setFormState] = useState({
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  function onChangeHandler(e: SyntheticEvent) {
    const input = e.target as HTMLInputElement;

    setFormState((old) => {
      return { ...old, [input.name]: input.value };
    });
  }

  async function submitHandler(e: SyntheticEvent) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const localPort = process.env.PORT || 3001;
      // TODO: improve this code, right now localUrl is hard coded
      const localUrl = `http://localhost:3001/admin/reset-password`;
      const productionUrl = `https://ib-tourism.vercel.app/admin/reset-password`;
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        formState.email,
        {
          redirectTo:
            process.env.NODE_ENV === "development" ? localUrl : productionUrl,
        },
      );
      if (!error) {
        toast({
          status: "success",
          description:
            "Check your email inbox and follow the url provided to reset your password",
          isClosable: true,
          duration: 5000,
        });
      }
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      toast({
        status: "error",
        description: "Invalid email",
        isClosable: true,
        duration: 3000,
      });
    }
  }

  const bgCard = useColorModeValue("white", "gray.700");
  const bg = useColorModeValue("gray.100", "gray.900");
  const logo = Logo;
  return (
    <Box
      w="full"
      h="full"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={bg}
    >
      <Box w="400px" p={5} shadow="xs" bg={bgCard} borderRadius="md">
        <Box textAlign="center" display="flex" justifyContent="center" mb={3}>
          <Image src={logo} width={150} height={logo.height} alt="brand logo" />
        </Box>

        <Text textAlign="center">
          Provide your email, and we will send you a reset password link.
        </Text>

        <form onSubmit={submitHandler}>
          <FormControl isRequired mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="john.doe@email.com"
              onChange={onChangeHandler}
              value={formState.email}
            />
          </FormControl>
          <Center>
            <Button isLoading={isLoading} type="submit">
              Send password reset email
            </Button>
          </Center>
        </form>
      </Box>
    </Box>
  );
}
