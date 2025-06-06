import {
  useState,
  useEffect,
  useMemo,
  SyntheticEvent,
  ChangeEvent,
} from "react";
import { GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import AdminLayout from "../../../components/AdminLayout";
import { Venue } from "../../../types/Venue";
import Button from "../../../components/Button";
import {
  Button as CButton,
  VStack,
  HStack,
  Text,
  Stack,
  Box,
  Center,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  Textarea,
  Avatar,
  ButtonGroup,
  Switch,
  Spacer,
} from "@chakra-ui/react";
import LinkDrawer from "../../../components/LinkDrawer";
import ChakraColorPicker from "../../../components/ChakraColorPicker";
import supabase from "../../../libs/supabase-browser";
import { BsUpload } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import NewLinkButton from "../../../components/NewLinkButton";
import LinkButton from "../../../components/LinkButton";
import { Link } from "../../../types/Link";
import { BsEye, BsArrowLeft } from "react-icons/bs";
import { TbChecklist } from "react-icons/tb";
import { ExternalOffer } from "../../../types/ExternalOffer";
import { FaViber, FaWhatsapp } from "react-icons/fa";
import ServicesSection from "../../../components/services/ServicesSection";
import { CallToAction } from "../../../types/CallToAction";
import ServicesSectionFront from "../../../components/services/ServicesSectionFront";
import { ReviewTemplate } from "../../../types/ReviewTemplate";

const CallToActions = dynamic(
  () => import("../../../components/CallToActions"),
  {
    ssr: false,
  },
);

const ReviewsComponent = dynamic(
  () => import("../../../components/reviews/ReviewsComponent"),
  {
    ssr: false,
  },
);

export default function VenuePage({
  venue,
  links: serverLinks,
  externalOffers,
  callToActions,
  reviewTemplates: reviewTemplatesDb,
}: {
  venue: Venue;
  links: Link[];
  externalOffers: ExternalOffer[];
  callToActions: CallToAction[];
  reviewTemplates: ReviewTemplate[];
}) {
  const [links, setLinks] = useState(serverLinks);
  const [venueData, setVenueData] = useState(venue);
  const [isSaving, setIsSaving] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<any | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [isUploadingBg, setIsUploadingBg] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState<any | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeLinkId, setActiveLinkId] = useState("");

  const router = useRouter();

  function updateVenueData(
    e: SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    let input = e.target as HTMLInputElement;
    setVenueData({ ...venueData, [input.name]: input.value });
  }

  async function venueDataSubmitHandler(e: SyntheticEvent) {
    e.preventDefault();
    try {
      setIsSaving(true);
      await saveVenueDataToDb();
      setIsSaving(false);
    } catch (e) {
      console.log(e);
      setIsSaving(false);
    }
  }

  async function saveVenueDataToDb(obj?: Venue) {
    const { id, background_image, logo, ...restData } = venueData;
    const { error } = await supabase
      .from("venues")
      .update(obj ? obj : restData)
      .match({ id });
    if (error) throw Error(error.message);
  }

  async function uploadLogo() {
    if (!logoFile || !venueData.id) return;
    try {
      setIsUploading(true);
      let ext = logoFile.name.split(".").pop();
      let fullPath = `logos/${venueData?.id + +new Date()}.${ext}`;
      const { data, error } = await supabase.storage
        .from("ib-turism")
        .upload(fullPath, logoFile, {
          upsert: true,
        });
      const { data: readData } = await supabase.storage
        .from("ib-turism")
        .getPublicUrl(fullPath);
      if (readData) {
        setLogoUrl(readData.publicUrl);
        // setVenueData({ ...venueData, logo: readData.publicUrl });
        const { error } = await supabase
          .from("venues")
          .update({ logo: readData.publicUrl })
          .match({ id: venueData.id });
      }

      setIsUploading(false);
    } catch (e) {
      console.log(e);
      setIsUploading(false);
    }
  }

  async function uploadBackground() {
    if (!backgroundFile || !venueData.id) return;
    try {
      setIsUploadingBg(true);
      let ext = backgroundFile.name.split(".").pop();
      let fullPath = `backgrounds/${venueData.id + +new Date()}.${ext}`;
      const { data, error } = await supabase.storage
        .from("ib-turism")
        .upload(fullPath, backgroundFile, {
          upsert: true,
        });
      const { data: readData } = await supabase.storage
        .from("ib-turism")
        .getPublicUrl(fullPath);
      if (readData) {
        setBackgroundUrl(readData.publicUrl);
        // setVenueData({ ...venueData, logo: readData.publicUrl });
        const { error } = await supabase
          .from("venues")
          .update({ background_image: readData.publicUrl })
          .match({ id: venueData.id });
      }

      setIsUploadingBg(false);
    } catch (e) {
      console.log(e);
      setIsUploadingBg(false);
    }
  }

  async function deleteLogo() {
    if (!venueData.logo) return;
    try {
      const { data, error } = await supabase.storage
        .from("ib-turism")
        .remove([venueData.logo]);
      if (error) throw Error(error.message);
      const { data: updateData, error: updateError } = await supabase
        .from("venues")
        .update({ logo: "" })
        .match({ id: venueData.id });
      if (updateError) throw Error(updateError.message);
      setVenueData({ ...venueData, logo: "" });
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteBackground() {
    if (!venueData.background_image) return;
    try {
      const { data, error } = await supabase.storage
        .from("ib-turism")
        .remove([venueData.background_image]);
      if (error) throw Error(error.message);
      const { data: updateData, error: updateError } = await supabase
        .from("venues")
        .update({ background_image: "" })
        .match({ id: venueData.id });
      if (updateError) throw Error(updateError.message);
      setVenueData({ ...venueData, background_image: "" });
    } catch (e) {
      console.log(e);
    }
  }

  async function addLink(val: string) {
    //get largest order number from existing links array

    const lastOrderLink =
      links.length > 0
        ? links.reduce((acc, iter) => {
            if (!iter.order_index || !acc.order_index) return iter;
            return iter.order_index > acc.order_index ? iter : acc;
          })
        : { order_index: 0 };
    const nextOrderIndex = (lastOrderLink.order_index || 0) + 1;
    try {
      const { data, error } = await supabase
        .from("venue_links")
        .insert({
          type: val,
          venue_id: venueData.id,
          url: "",
          order_index: nextOrderIndex,
        })
        .select()
        .single();
      if (error) throw Error(error.message);
      setLinks([...links, data]);
    } catch (e) {
      console.log(e);
    }
  }

  function openLinkHandler(id: string) {
    setActiveLinkId(id);
    setIsDrawerOpen(true);
  }

  const logoImage = useMemo(() => {
    if (logoUrl) {
      return logoUrl;
    } else if (venueData.logo && venueData.logo !== "") {
      return venueData.logo;
    }
  }, [logoUrl, venueData.logo]);

  const backgroundImage = useMemo(() => {
    if (backgroundUrl) {
      return backgroundUrl;
    } else if (venueData.background_image) {
      return venueData.background_image;
    }
  }, [backgroundUrl, venueData.background_image]);

  async function deleteLinkHandler(id: string) {
    const r = window.confirm(
      "Sure you want to delete this link. By doing so all of your stats for this link will be LOST!",
    );
    if (!r) return;

    try {
      const { error: linksClickError } = await supabase
        .from("venue_links_clicks")
        .delete()
        .match({ venue_link_id: id });
      if (linksClickError) throw Error(linksClickError.message);

      const { error } = await supabase
        .from("venue_links")
        .delete()
        .match({ id });
      if (error) throw Error(error.message);

      const newLinks = links.filter((link) => link.id !== id);
      setLinks(newLinks);
    } catch (e) {
      console.log(e);
    }
  }

  function openPreview() {
    window.open(location.origin + `/venue/${venueData.id}`);
  }

  useEffect(() => {
    if (!logoFile) return;
    uploadLogo();
  }, [logoFile]);

  useEffect(() => {
    if (!backgroundFile) return;
    uploadBackground();
  }, [backgroundFile]);

  const borderColor = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
  const bgColor = useColorModeValue("gray.50", "gray.700");

  return (
    <AdminLayout>
      <Box mt="20px" position="relative">
        <CButton
          onClick={() => router.push("/admin/venues")}
          position="absolute"
          left="0px"
          top="0px"
        >
          <BsArrowLeft />
        </CButton>
        <Text isTruncated fontSize="2xl" fontWeight="bold" textAlign="center">
          {venueData.title}
        </Text>
      </Box>
      <Stack
        w="full"
        borderRadius="md"
        p="20px"
        my="30px"
        border="1px solid"
        borderColor={borderColor}
        flexWrap="wrap"
        direction="row"
        gap="10px"
      >
        <Stack flex="1" minW="200px">
          <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={5}>
            Main Info
          </Text>
          <form onSubmit={venueDataSubmitHandler}>
            <HStack alignItems="center" mb={8} flexWrap="wrap" gap="10px">
              <Stack minW="200px" flex={1} alignItems="center">
                <Avatar src={logoImage} name={venue.title} size="2xl" />
                <HStack>
                  <CButton
                    isLoading={isUploading}
                    as="label"
                    htmlFor="logo"
                    rightIcon={<BsUpload />}
                  >
                    Upload Logo
                  </CButton>
                  <CButton onClick={deleteLogo}>
                    <MdDelete />
                  </CButton>
                </HStack>
                <input
                  type="file"
                  name="logo"
                  id="logo"
                  style={{ display: "none" }}
                  onChange={(e: SyntheticEvent) => {
                    let input = e.target as HTMLInputElement;
                    if (!input.files?.length) return;
                    setLogoFile(input.files[0]);
                  }}
                />
              </Stack>
              <VStack minW="200px" flex={2} alignItems="center">
                <Stack w="full" textAlign="center">
                  <Box
                    h="120px"
                    borderRadius="md"
                    w="full"
                    bg={venueData.background_color}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                  >
                    {venueData.background_image || backgroundUrl ? (
                      <img
                        src={backgroundImage}
                        style={{
                          height: "100%",
                          minWidth: "100%",
                          minHeight: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : null}
                  </Box>
                  <Center>
                    <HStack>
                      <CButton
                        isLoading={isUploadingBg}
                        as="label"
                        htmlFor="background_image"
                        rightIcon={<BsUpload />}
                        maxW="md"
                      >
                        Upload Cover Photo
                      </CButton>
                      <CButton onClick={deleteBackground}>
                        <MdDelete />
                      </CButton>
                    </HStack>
                    <input
                      type="file"
                      name="background_image"
                      id="background_image"
                      style={{ display: "none" }}
                      onChange={(e: SyntheticEvent) => {
                        let input = e.target as HTMLInputElement;
                        if (!input.files?.length) return;
                        setBackgroundFile(input.files[0]);
                      }}
                    />
                  </Center>
                </Stack>

                {/* <HStack> */}
                {/*   <Text>Pick a backround color:</Text> */}
                {/*   <ChakraColorPicker */}
                {/*     value={venueData.background_color || ""} */}
                {/*     onChange={(val) => { */}
                {/*       setVenueData({ ...venueData, background_color: val }); */}
                {/*     }} */}
                {/*   /> */}
                {/* </HStack> */}
                {/* <HStack> */}
                {/*   <Text>Pick a default theme</Text> */}
                {/*   <ButtonGroup isAttached> */}
                {/*     <CButton */}
                {/*       onClick={() => { */}
                {/*         setVenueData({ ...venueData, default_theme: "light" }); */}
                {/*       }} */}
                {/*       colorScheme={ */}
                {/*         venueData.default_theme === "light" ? "twitter" : "gray" */}
                {/*       } */}
                {/*     > */}
                {/*       Light */}
                {/*     </CButton> */}
                {/*     <CButton */}
                {/*       onClick={() => { */}
                {/*         setVenueData({ ...venueData, default_theme: "dark" }); */}
                {/*       }} */}
                {/*       colorScheme={ */}
                {/*         venueData.default_theme === "dark" ? "twitter" : "gray" */}
                {/*       } */}
                {/*     > */}
                {/*       {" "} */}
                {/*       Dark */}
                {/*     </CButton> */}
                {/*   </ButtonGroup> */}
                {/* </HStack> */}
              </VStack>
            </HStack>
            <FormControl mb={4}>
              <FormLabel display="flex" alignItems="center" gap={2}>
                Title
                <Switch
                  isChecked={venueData.show_title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    let val = !!e.target.checked;
                    setVenueData((old) => {
                      return { ...old, show_title: val };
                    });
                  }}
                />
              </FormLabel>
              <Input
                name="title"
                type="text"
                placeholder="My Venue Title"
                onInput={updateVenueData}
                value={venueData.title || ""}
                variant="filled"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                placeholder=""
                value={venueData.description || ""}
                onChange={updateVenueData}
                variant="filled"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Phone</FormLabel>
              <Input
                name="phone"
                type="text"
                placeholder="000 000 000"
                onInput={updateVenueData}
                value={venueData.phone || ""}
                variant="filled"
              />
            </FormControl>
            <Box mb={4}>
              <HStack flexWrap="wrap">
                <HStack>
                  <FormLabel display="flex" alignItems="center" gap={2}>
                    Whatsapp <FaWhatsapp />
                    <Switch
                      isChecked={venueData.has_whatsapp}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        let val = !!e.target.checked;
                        setVenueData((old) => {
                          return { ...old, has_whatsapp: val };
                        });
                      }}
                    />
                  </FormLabel>
                </HStack>
                <HStack>
                  <FormLabel display="flex" alignItems="center" gap={2}>
                    Viber <FaViber />
                    <Switch
                      isChecked={venueData.has_viber}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        let val = !!e.target.checked;
                        setVenueData((old) => {
                          return { ...old, has_viber: val };
                        });
                      }}
                    />
                  </FormLabel>
                </HStack>
              </HStack>
            </Box>
            <FormControl mb={4}>
              <FormLabel>Website</FormLabel>
              <Input
                name="website"
                type="text"
                placeholder="www.venuewebsite.com"
                onInput={updateVenueData}
                value={venueData.website || ""}
                variant="filled"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="text"
                placeholder="venue@email.com"
                onInput={updateVenueData}
                value={venueData.email || ""}
                variant="filled"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Address</FormLabel>
              <Input
                name="address"
                type="text"
                placeholder="Please provide your address here"
                onInput={updateVenueData}
                value={venueData.address || ""}
                variant="filled"
              />
            </FormControl>
            <FormControl
              mb={4}
              border="1px"
              borderColor={borderColor}
              bg={bgColor}
              p={4}
              rounded="lg"
            >
              <FormLabel>CTA (Call to action button)</FormLabel>
              <Input
                placeholder="CTA Title"
                value={venueData.cta_title || ""}
                onInput={updateVenueData}
                variant="filled"
                name="cta_title"
                type="text"
                mb="2"
              />
              <Input
                placeholder="https://some-important-link.com"
                value={venueData.cta_link || ""}
                onInput={updateVenueData}
                variant="filled"
                name="cta_link"
                type="text"
              />
              <br />
              <HStack mt="10px">
                <FormLabel htmlFor="show_cta" m="0px">
                  Show CTA
                </FormLabel>
                <Switch
                  name="show_cta"
                  id="show_cta"
                  isChecked={venueData.show_cta}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    let val = !!e.target.checked;
                    setVenueData((old) => {
                      return { ...old, show_cta: val };
                    });
                  }}
                />
              </HStack>
            </FormControl>
            <CallToActions
              actions={callToActions || []}
              venueId={venueData.id || ""}
            />
            <Box textAlign="center">
              <ButtonGroup isAttached>
                <Button
                  type="submit"
                  isLoading={isSaving}
                  borderRight="1px"
                  borderColor="whiteAlpha.300"
                >
                  SAVE
                </Button>
                <Button type="button" onClick={openPreview}>
                  Preview
                  <BsEye style={{ marginLeft: "10px" }} />
                </Button>
              </ButtonGroup>
            </Box>
          </form>
        </Stack>
      </Stack>

      <ServicesSectionFront venueId={venueData.id || ""} />

      <ServicesSection
        venueId={venueData.id || ""}
        userId={venueData.owner_id || ""}
      />

      <Box
        borderColor={borderColor}
        borderWidth={1}
        padding={4}
        borderRadius="md"
        mb={5}
      >
        <Text as="h2" fontSize="xl" fontWeight="bold">
          Your links for {venueData.title}
        </Text>
        <Text fontSize="sm" mb="20px">
          Click on one below to edit its content
        </Text>
        <Box display="flex" flexWrap="wrap" gap="8px">
          {links.map((link: any) => {
            return (
              <LinkButton
                onClick={openLinkHandler}
                isActive={link.is_active}
                id={link.id}
                type={link.type}
                key={link.id}
              />
            );
          })}
          <NewLinkButton onSelect={addLink} />
        </Box>
      </Box>

      <Box
        borderColor={borderColor}
        borderWidth={1}
        padding={4}
        borderRadius="md"
      >
        <Box justifyContent="space-between" display="flex" w="100%">
          <Text fontSize="xl" fontWeight="bold">
            Survey
          </Text>
          <Spacer />
          <Box>
            <FormControl display="flex" alignItems="center">
              <FormLabel m="0px" mr="10px" display="flex" alignItems="center">
                <TbChecklist size="25px" style={{ marginRight: "8px" }} />
                Show Survey
              </FormLabel>
              <Switch
                isChecked={venueData.show_review}
                onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                  let val = !!e.target.checked;
                  let newData = { ...venueData, show_review: val };
                  setVenueData(newData);
                  try {
                    await saveVenueDataToDb(newData);
                  } catch (e) {
                    console.error(e);
                  }
                }}
              />
            </FormControl>
          </Box>
        </Box>
        <ReviewsComponent
          userId={venueData.owner_id || ""}
          venueId={venueData.id || ""}
        />
      </Box>

      <LinkDrawer
        activeLinkId={activeLinkId}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onDelete={deleteLinkHandler}
        linkUpdated={(link) => {
          const newLinks = links.map((l) => {
            if (l.id === link.id) {
              return link;
            } else {
              return l;
            }
          });
          setLinks(newLinks);
        }}
      />
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

  const id = ctx.params?.id;

  if (!id) {
    return {
      redirect: {
        destination: "/admin/venues",
        permanent: false,
      },
    };
  }

  const { data: venueData, error: venueError } = await supabase
    .from("venues")
    .select()
    .match({ id })
    .single();

  if (venueError) {
    return {
      redirect: {
        destination: "/admin/venues",
        permanent: false,
      },
    };
  }

  const { data: links, error: linksError } = await supabase
    .from("venue_links")
    .select()
    .order("order_index", { ascending: true })
    .match({ venue_id: venueData.id });

  const { data: externalOffers, error: externalOffersError } = await supabase
    .from("external_offers")
    .select()
    .order("order_index", { ascending: true })
    .match({ venue_id: venueData.id });

  const { data: callToActions, error: callToActionsError } = await supabase
    .from("call_to_actions")
    .select()
    .match({ venue_id: venueData.id })
    .order("created_at");

  const { data: reviewTemplates, error: reviewTemplatesError } = await supabase
    .from("review_templates")
    .select()
    .match({ owner_id: data.session.user.id, venue_id: venueData.id })
    .order("order_index", { ascending: true });

  return {
    props: {
      venue: venueData,
      links,
      externalOffers,
      callToActions,
      reviewTemplates,
    },
  };
};
