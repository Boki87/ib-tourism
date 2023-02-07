import { useEffect, useState } from "react";
import {
  Text,
  Box,
  Center,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { SyntheticEvent } from "react";
import { useUserContext } from "../context";
import supabase from "../libs/supabase-browser";
import Button from "../components/Button";

export default function UserFirstLogin() {
  const { user, setUser } = useUserContext();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCompareError, setShowCompareError] = useState(false);
  const [doPasswordsMatch, setDoPasswordsMatch] = useState(false);
  const toast = useToast();

  async function submitHandler(e: SyntheticEvent) {
    if (!user) return;
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast({
        status: "error",
        description: "Passwords dont match",
        isClosable: true,
        duration: 3000,
      });
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw Error(error.message);

      const { data: updateOwner, error: ownerError } = await supabase
        .from("owners")
        .update({ is_setup: true })
        .match({
          id: user.id,
        });
      if (ownerError) throw Error(ownerError.message);

      setUser({ ...user, is_setup: true });

      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }

  function onChangeHandler(e: SyntheticEvent) {
    const input = e.target as HTMLInputElement;

    if (input.name === "password") {
      setPassword(input.value);
    }

    if (input.name === "confirmPassword") {
      setShowCompareError(true);
      setConfirmPassword(input.value);
    }
  }

  useEffect(() => {
    if (showCompareError && confirmPassword !== "") {
      if (confirmPassword !== password) {
        setDoPasswordsMatch(false);
      } else {
        setDoPasswordsMatch(true);
      }
    }
  }, [showCompareError, confirmPassword]);

  return (
    <Box
      w="full"
      h="full"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <Box w="400px" p={5} bg="white" shadow="md">
        <Text mb="5px">Please set your password.</Text>
        <Text mb="20px">You can always change it later.</Text>
        <form onSubmit={submitHandler}>
          <FormControl isRequired mb={4}>
            <FormLabel>New Password</FormLabel>
            <Input
              name="password"
              type="password"
              placeholder=""
              onChange={onChangeHandler}
              value={password}
            />
          </FormControl>
          <FormControl isRequired mb={4}>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              name="confirmPassword"
              type="password"
              placeholder=""
              onChange={onChangeHandler}
              value={confirmPassword}
              isInvalid={showCompareError && !doPasswordsMatch}
            />
          </FormControl>
          <Center>
            <Button isLoading={isLoading} type="submit">
              Setup Password
            </Button>
          </Center>
        </form>
      </Box>
    </Box>
  );
}
