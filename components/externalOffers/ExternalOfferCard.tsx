import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Switch,
  Image,
  useColorModeValue,
  Text,
  Spacer,
} from "@chakra-ui/react";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import {
  FaChevronDown,
  FaExpand,
  FaSave,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import { FiMinimize2 } from "react-icons/fi";
import supabase from "../../libs/supabase-browser";
import { ExternalOffer } from "../../types/ExternalOffer";

interface ExternalOfferProps {
  offerData: ExternalOffer;
  onDelete: (id: string) => void;
}

const MAX_IMAGES = 4;

export default function ExternalOfferCard({
  offerData,
  onDelete,
}: ExternalOfferProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [offer, setOffer] = useState(() => offerData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  function updateOfferStateHandler(e: SyntheticEvent) {
    const input = e.target as HTMLInputElement;
    setOffer((prev) => {
      return { ...prev, [input.name]: input.value };
    });
  }

  const bg = useColorModeValue("gray.50", "gray.700");
  const border = useColorModeValue("gray.200", "gray.600");

  async function imageSelectHandler(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const uploadedFiles = offer.images?.length || 0;
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
      const promise = doAsyncUpload(file);
      imageUploads.push(promise);
    });

    try {
      setIsUploading(true);
      await Promise.all(imageUploads);
      setOffer((prev) => {
        return {
          ...prev,
          images: [...(prev?.images || []), ...newUploadedFiles],
        };
      });
      const { error } = await supabase
        .from("external_offers")
        .update({
          ...offer,
          images: [...(offer?.images || []), ...newUploadedFiles],
        })
        .eq("id", offer.id);
      setIsUploading(false);
    } catch (e) {
      console.log(e);
      setIsUploading(false);
    }

    async function doAsyncUpload(file: File) {
      let ext = file.name.split(".").pop();
      let name = offer.id + "-" + crypto.randomUUID();
      let fullPath = `offers_images/${name}.${ext}`;
      const { data, error } = await supabase.storage
        .from("public")
        .upload(fullPath, file, {
          upsert: true,
        });
      const { data: readData } = await supabase.storage
        .from("public")
        .getPublicUrl(fullPath);
      if (readData) {
        newUploadedFiles.push(readData.publicUrl);
      }
    }
  }

  async function deleteImageHandler(image: string) {
    try {
      const { data, error: deleteError } = await supabase.storage
        .from("public")
        .remove([image]);
      if (deleteError) throw Error(deleteError.message);
      const newOffer = {
        ...offer,
        images: offer.images?.filter((img) => img !== image),
      };
      console.log(111, data, deleteError);
      setOffer(newOffer);
      const { error } = await supabase
        .from("external_offers")
        .update(newOffer)
        .eq("id", offer.id);
    } catch (e) {
      console.log(e);
    }
  }

  async function saveChangesHandler(e: SyntheticEvent) {
    e.preventDefault();
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from("external_offers")
        .update(offer)
        .eq("id", offer.id);

      if (error) throw Error(error.message);
      setIsUpdating(false);
    } catch (e) {
      console.log(e);
      setIsUpdating(false);
    }
  }

  async function deleteOfferHandler() {
    const r = window.confirm("Sure you want to delete this offer?");
    if (!r) return;
    if (!offer.id) return;
    try {
      const { error } = await supabase
        .from("external_offers")
        .delete()
        .eq("id", offer.id);
      onDelete(offer.id);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      {isExpanded ? (
        <Box
          w="full"
          my={2}
          bg={bg}
          p={4}
          pt={14}
          border="1px"
          borderColor={border}
          rounded="md"
          position="relative"
        >
          <Box>
            {offer.images && offer.images.length > 0 && (
              <HStack h="100px" w="full" overflowY="hidden" overflowX="auto">
                <HStack h="full">
                  {offer.images?.map((image) => (
                    <Box
                      key={image}
                      w="177px"
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
                        objectFit="cover"
                        minW="100%"
                        minH="100%"
                      />
                    </Box>
                  ))}
                </HStack>
              </HStack>
            )}
            <HStack justifyContent="flex-end" mt={3}>
              <Button
                as="label"
                htmlFor={`image_upload_input-${offer.id}`}
                rightIcon={<FaUpload />}
                isLoading={isUploading}
                isDisabled={offer.images?.length == MAX_IMAGES}
              >
                Upload images {offer.images?.length || 0} / {MAX_IMAGES}{" "}
              </Button>
            </HStack>
            <input
              onChange={imageSelectHandler}
              type="file"
              style={{ display: "none" }}
              id={`image_upload_input-${offer.id}`}
              multiple
              accept="image/*"
            />
          </Box>

          <FormControl mb={2}>
            <FormLabel>Offer title</FormLabel>
            <Input
              variant="filled"
              placeholder="i.e. Taxi Service"
              value={offer.title}
              required
              name="title"
              onInput={updateOfferStateHandler}
            />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>Website</FormLabel>
            <Input
              variant="filled"
              placeholder="i.e. Taxi Services Website"
              value={offer.url || ""}
              name="url"
              onInput={updateOfferStateHandler}
            />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>Phone</FormLabel>
            <Input
              variant="filled"
              placeholder="i.e. Taxi Services Phone"
              value={offer.phone || ""}
              name="phone"
              onInput={updateOfferStateHandler}
            />
          </FormControl>
          <FormControl mb={2} display="flex" alignItems="center" gap={2}>
            <FormLabel m={0}>Is live</FormLabel>
            <Switch
              isChecked={offer.is_live}
              onChange={(e: SyntheticEvent) => {
                const switchEl = e.target as HTMLInputElement;
                setOffer((prev) => {
                  return {
                    ...prev,
                    is_live: switchEl.checked,
                  };
                });
              }}
            />
          </FormControl>
          <Center>
            <Button
              onClick={saveChangesHandler}
              type="submit"
              rightIcon={<FaSave />}
              isLoading={isUpdating}
            >
              Save Changes
            </Button>
            <Button onClick={deleteOfferHandler} colorScheme="red" ml={2}>
              <FaTrash />
            </Button>
          </Center>
          <Button
            onClick={() => setIsExpanded(false)}
            position="absolute"
            top={4}
            right={4}
          >
            <FiMinimize2 />
          </Button>
        </Box>
      ) : (
        <HStack
          w="full"
          my={2}
          bg={bg}
          p={4}
          border="1px"
          borderColor={border}
          rounded="md"
        >
          <Text fontWeight="bold">{offer.title}</Text>
          <Spacer />
          <HStack>
            <Button onClick={deleteOfferHandler} colorScheme="red" ml={2}>
              <FaTrash />
            </Button>
            <Button onClick={() => setIsExpanded(true)}>
              <FaExpand />
            </Button>
          </HStack>
        </HStack>
      )}
    </>
  );
}
