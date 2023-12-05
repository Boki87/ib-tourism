import { useState, useEffect, SyntheticEvent } from "react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import {
  Box,
  Text,
  Avatar,
  Center,
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Progress,
  useToast,
  InputGroup,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsUpload } from "react-icons/bs";
import { Owner } from "../../types/Owner";
import AdminLayout from "../../components/AdminLayout";
import supabase from "../../libs/supabase-browser";
import { useUserContext } from "../../context";

export default function Profile({ user }: { user: Owner }) {
  const toast = useToast();
  const [userProfileData, setUserProfileData] = useState(user);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [newPassword, setNewPassword] = useState("");

  const [showNewPassword, setNewShowPassword] = useState(true);
  const handleNewPasswordShowClick = () => setNewShowPassword(!showNewPassword);

  const { user: userFromState, setUser } = useUserContext();

  function userProfileDataPropChange(e: SyntheticEvent) {
    const { name, value } = e.target as HTMLInputElement;
    setUserProfileData({ ...userProfileData, [name]: value });
  }

  async function handleAvatarChange(e: SyntheticEvent) {
    const input = e.target as HTMLInputElement;
    let avatar = (input?.files && input?.files[0]) || null;
    if (!avatar) return;

    try {
      setUpdating(true);

      let ext = avatar.name.split(".").pop();
      let fullPath = `logos/${user?.id || "" + +new Date()}.${ext}`;
      const { data, error } = await supabase.storage
        .from("ib-turism")
        .upload(fullPath, avatar, {
          upsert: true,
        });
      const { data: readData } = await supabase.storage
        .from("ib-turism")
        .getPublicUrl(fullPath);

      if (readData) {
        setUserProfileData({
          ...userProfileData,
          profile_picture: readData.publicUrl,
        });
        setUser({ ...userFromState, profile_picture: readData.publicUrl });
        const { error } = await supabase
          .from("owners")
          .update({ profile_picture: readData.publicUrl })
          .match({ id: user.id });
        if (error) throw Error(error.message);
      }

      setUpdating(false);
    } catch (err) {
      console.log(err);
      setUpdating(false);
      toast({
        title: "Warning!",
        description: "Image format not supported",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }

  async function updateProfile() {
    try {
      setUpdating(true);
      if (newPassword !== "") {
        //update password
        const { data, error } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (error) throw Error(error.message);

        const { data: ownerData, error: ownerError } = await supabase
          .from("owners")
          .update({ full_name: userProfileData.full_name })
          .match({ id: userProfileData.id });
        if (ownerError) throw Error(ownerError.message);

        setUser({ ...userFromState, full_name: userProfileData.full_name });

        toast({
          title: "Success!",
          description: "Profile updated successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      } else {
        const { data: ownerData, error: ownerError } = await supabase
          .from("owners")
          .update({ full_name: userProfileData.full_name })
          .match({ id: userProfileData.id })
          .select()
          .single();
        if (ownerError) throw Error(ownerError.message);
        setUser({ ...userFromState, full_name: userProfileData.full_name });
      }
      setUpdating(false);
    } catch (err) {
      setUpdating(false);
      toast({
        title: "Error!",
        description: "Wrong current password",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.log(err);
    }
  }

  const bgColor = useColorModeValue("gray.100", "gray.700");

  return (
    <AdminLayout>
      {updating && <Progress size="xs" isIndeterminate w="full" />}
      <Box maxW="2xl" mx="auto">
        <Center mb="10px" bg={bgColor} py="20px">
          <Stack>
            <Avatar
              size="xl"
              src={userProfileData?.profile_picture}
              border="2px solid white"
              name={userProfileData?.full_name}
              mx="auto"
            />
            <Box>
              <Button
                as="label"
                htmlFor="avatar_file"
                colorScheme="blue"
                size="sm"
                leftIcon={<BsUpload />}
              >
                Upload avatar
              </Button>
              <input
                onChange={handleAvatarChange}
                type="file"
                id="avatar_file"
                name="avatar_file"
                style={{ display: "none" }}
              />
            </Box>
          </Stack>
        </Center>
        <Box p="20px">
          <FormLabel>Email:</FormLabel>
          <Text fontSize="lg" color="gray.600" mb="10px" fontWeight="bold">
            {userProfileData?.email}
          </Text>
          <hr />
          <FormControl mb="20px" mt="20px">
            <FormLabel htmlFor="name">Full Name</FormLabel>
            <Input
              placeholder="Full Name"
              variant="filled"
              name="full_name"
              defaultValue={userProfileData?.full_name}
              autoComplete="off"
              onInput={userProfileDataPropChange}
            />
          </FormControl>
          <FormControl mb="20px">
            <FormLabel htmlFor="name">New Password</FormLabel>
            <InputGroup>
              <Input
                placeholder="New Password"
                variant="filled"
                name="new_password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onInput={(e: SyntheticEvent) => {
                  const input = e.target as HTMLInputElement;
                  setNewPassword(input.value);
                }}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  variant="outline"
                  colorScheme="blue"
                  onClick={handleNewPasswordShowClick}
                >
                  {showNewPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Center>
            <Button
              onClick={updateProfile}
              isLoading={updating}
              colorScheme="blue"
            >
              Update
            </Button>
          </Center>
        </Box>
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

  return {
    props: {
      user: ownerData,
    },
  };
};
