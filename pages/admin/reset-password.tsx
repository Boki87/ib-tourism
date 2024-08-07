import { useState, SyntheticEvent } from "react";
import { useRouter } from "next/router";
import { APP_URL } from "../../libs/supabase";
import supabase from "../../libs/supabase-browser";
import {
  Button as CButton,
  Box,
  Center,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import Button from "../../components/Button";
import LogoLgDark from "../../public/images/logo-lg-dark.png";
import LogoLgLight from "../../public/images/logo-lg-light.png";
import Logo from "../../public/images/logo.svg";
import Image from "next/image";
import { useUserContext } from "../../context";

export default function AdminLogin() {
  const router = useRouter();
  const toast = useToast();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      const { data, error } = await supabase.auth.updateUser({
        password: formState.password,
      });
      console.log(data, error);
      if (!error) {
        router.push("/admin");
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      toast({
        status: "error",
        description: "Something went wrong. Please try again.",
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
        <Box textAlign="center" display="flex" justifyContent="center">
          <Image src={logo} width={150} height={logo.height} alt="brand logo" />
        </Box>
        <form onSubmit={submitHandler}>
          <FormControl isRequired mb={4}>
            <FormLabel>New Password</FormLabel>
            <InputGroup>
              <Input
                placeholder="New Password"
                variant="filled"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formState.password}
                onChange={onChangeHandler}
              />
              <InputRightElement width="4.5rem">
                <CButton
                  h="1.75rem"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </CButton>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Center>
            <Button isLoading={isLoading} type="submit">
              Reset Password
            </Button>
          </Center>
        </form>
      </Box>
    </Box>
  );
}
