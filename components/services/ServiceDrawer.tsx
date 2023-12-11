import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  Switch,
  Text,
  Button,
  HStack,
  Spinner,
  Center,
  Box,
  Image,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaSave, FaTimes, FaTrash, FaUpload } from "react-icons/fa";
import useService from "../../hooks/useService";
import { supabase } from "../../libs/supabase";

interface ServiceModalProps {
  onClose: () => void;
  activeService: string | null;
  onUpdate?: () => void;
}

const MAX_IMAGES = 4;

export default function ServiceDrawer({
  onClose,
  activeService,
  onUpdate,
}: ServiceModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { service, setService, updateService, loading, updating } =
    useService(activeService);

  function changeHandler(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const name = e.target.name;
    const value = e.target.value;

    // @ts-expect-error
    setService((prev) => ({ ...prev, [name]: value }));
  }

  // Image upload functions
  async function imageSelectHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (!service) return;
    const files = e.target.files;
    if (!files) return;
    const uploadedFiles = service.images?.length || 0;
    if (files.length > MAX_IMAGES - uploadedFiles) {
      window.alert(
        "You can only select " + (MAX_IMAGES - uploadedFiles) + " images"
      );
      return;
    }

    const newUploadedFiles: string[] = [];
    const filesArray = Array.from(files);

    const imageUploads: Promise<void>[] = [];

    filesArray.forEach(async (file, index) => {
      const promise = doAsyncUpload(file as File);
      imageUploads.push(promise);
    });

    try {
      setIsUploading(true);
      await Promise.all(imageUploads);
      // @ts-ignore
      setService((prev) => {
        return {
          ...prev,
          images: [...(prev?.images || []), ...newUploadedFiles],
        };
      });
      const { error } = await supabase
        .from("external_offers")
        .update({
          ...service,
          images: [...(service?.images || []), ...newUploadedFiles],
        })
        .eq("id", service.id);
      setIsUploading(false);
    } catch (e) {
      console.log(e);
      setIsUploading(false);
    }

    async function doAsyncUpload(file: File) {
      if (!service) return;
      let ext = file.name.split(".").pop();
      let name = service.id + "-" + crypto.randomUUID();
      let fullPath = `offers_images/${name}.${ext}`;
      const { data, error } = await supabase.storage
        .from("ib-turism")
        .upload(fullPath, file, {
          upsert: true,
        });
      const { data: readData } = await supabase.storage
        .from("ib-turism")
        .getPublicUrl(fullPath);
      if (readData) {
        newUploadedFiles.push(readData.publicUrl);
      }
    }
  }

  async function deleteImageHandler(image: string) {
    if (!service) return;
    try {
      const { data, error: deleteError } = await supabase.storage
        .from("ib-turism")
        .remove([image]);
      if (deleteError) throw Error(deleteError.message);
      const newService = {
        ...service,
        images: service.images?.filter((img) => img !== image),
      };
      setService(newService);
      const { error } = await supabase
        .from("external_offers")
        .update(newService)
        .eq("id", service.id);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Box
      position="absolute"
      px={5}
      bg="white"
      top="0px"
      left="0px"
      w="full"
      h="full"
      borderLeftRadius="lg"
      overflow="hidden"
    >
      <Box w="full" h="full" overflowX="hidden" overflowY="auto" py="60px">
        <HStack
          position="absolute"
          top="0px"
          left="0px"
          w="full"
          h="50px"
          px={5}
          justifyContent="space-between"
          zIndex={10}
          bg="white"
        >
          <Box>Edit Service</Box>
          <Button onClick={onClose} size="sm" variant="ghost">
            <FaTimes />
          </Button>
        </HStack>
        {loading && (
          <Center w="100%" h="200px">
            <Spinner size="lg" color="blue.600" />
          </Center>
        )}
        {!loading && (
          <Box>
            {service?.images && service?.images.length > 0 && (
              <Box h="100px" overflowX="auto">
                <HStack h="full">
                  {service.images?.map((image) => (
                    <Box
                      key={image}
                      minW="177px"
                      maxW="177px"
                      h="full"
                      position="relative"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Button
                        rounded="full"
                        size="sm"
                        w="30px"
                        h="30px"
                        position="absolute"
                        top="2px"
                        right="2px"
                        colorScheme="red"
                        onClick={() => deleteImageHandler(image)}
                      >
                        <FaTrash />
                      </Button>
                      <Image
                        src={image}
                        alt="slider image"
                        objectFit="cover"
                        minW="100%"
                        minH="100%"
                      />
                    </Box>
                  ))}
                </HStack>
              </Box>
            )}
            <input
              onChange={imageSelectHandler}
              type="file"
              style={{ display: "none" }}
              id={`image_upload_input-${service?.id || ""}`}
              multiple
              accept="image/*"
            />
            <HStack justifyContent="flex-end" mt={3}>
              <Button
                as="label"
                htmlFor={`image_upload_input-${service?.id}`}
                rightIcon={<FaUpload />}
                isLoading={isUploading}
                isDisabled={service?.images?.length === MAX_IMAGES}
                pointerEvents={
                  service?.images?.length === MAX_IMAGES ? "none" : "auto"
                }
              >
                Upload images {service?.images?.length || 0} / {MAX_IMAGES}{" "}
              </Button>
            </HStack>
            <FormControl mb={3}>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                name="title"
                placeholder="Service Title"
                value={service?.title || ""}
                onChange={changeHandler}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>URL</FormLabel>
              <Input
                type="text"
                name="url"
                placeholder="https://some-place-on-the-web.com"
                value={service?.url || ""}
                onChange={changeHandler}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Phone number</FormLabel>
              <Input
                type="text"
                name="phone"
                placeholder="000 000 000"
                value={service?.phone || ""}
                onChange={changeHandler}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Address</FormLabel>
              <Input
                type="text"
                name="address"
                placeholder="Enter your address here"
                value={service?.address || ""}
                onChange={changeHandler}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={service?.description || ""}
                onChange={changeHandler}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Is live</FormLabel>
              <Switch
                type="checkbox"
                isChecked={service?.is_live}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const val = e.target.checked;
                  // @ts-expect-error
                  setService((prev) => ({ ...prev, is_live: val }));
                }}
                name="is_live"
              />
            </FormControl>
          </Box>
        )}

        {!loading && (
          <HStack
            justifyContent="flex-end"
            h="50px"
            position="absolute"
            left="0px"
            bottom="0px"
            w="full"
            bg="white"
          >
            <Button
              onClick={() => {
                updateService();
                onUpdate && onUpdate();
              }}
              isLoading={updating}
              colorScheme="blue"
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </HStack>
        )}
      </Box>
    </Box>
  );
}