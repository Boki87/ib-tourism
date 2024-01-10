import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaSave, FaTrash } from "react-icons/fa";
import useCallToActions from "../hooks/useCallToActions";
import { CallToAction } from "../types/CallToAction";

interface CallToActionsProps {
  venueId: string;
  actions: CallToAction[];
}

export default function CallToActions({
  actions,
  venueId,
}: CallToActionsProps) {
  const { addCta, callToActions, loading, updateCta, deleteCta, updating } =
    useCallToActions(venueId, actions);

  const newCtaTemplate = {
    title: "Change me",
    url: "",
  };

  function addNewHandler() {
    addCta(newCtaTemplate);
  }

  function updateHandler(ctaData: { id: string } & CallToAction) {
    updateCta(ctaData);
  }

  function deleteHandler(id: string) {
    deleteCta(id);
  }

  return (
    <Box>
      {callToActions.length > 0 && (
        <Text fontSize="lg" fontWeight="bold" mb={4} mt={7}>
          Additional CTA's
        </Text>
      )}
      {callToActions.map((action) => (
        <CallToAction
          cta={action}
          onUpdate={updateHandler}
          onDelete={deleteHandler}
          isLoading={!!(action.id && action.id === updating)}
          key={action.id}
        />
      ))}
      <Center>
        <Button colorScheme="blue" onClick={addNewHandler} isLoading={loading}>
          Add CTA
        </Button>
      </Center>
    </Box>
  );
}

interface CallToActionProps {
  cta: CallToAction;
  onUpdate: (ctaData: { id: string } & CallToAction) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

function CallToAction({
  cta,
  onUpdate,
  onDelete,
  isLoading,
}: CallToActionProps) {
  const toast = useToast();
  const [ctaData, setCtaData] = useState<CallToAction>(cta);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCtaData((old) => ({ ...old, [name]: value }));
  };

  const submitHandler = () => {
    if (ctaData.title === "" || ctaData.url === "") {
      return toast({
        title: "Error!",
        description: "Please provide a Title and a Url to your CTA",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    console.log(ctaData);
    onUpdate(ctaData as { id: string } & CallToAction);
  };

  return (
    <FormControl
      mb={4}
      border="1px"
      borderColor="gray.200"
      bg="gray.50"
      p={4}
      rounded="lg"
    >
      <FormLabel htmlFor="title">Title</FormLabel>
      <Input
        placeholder="CTA Title"
        value={ctaData.title}
        onInput={changeHandler}
        variant="filled"
        name="title"
        id="title"
        type="text"
        mb="2"
        required
      />
      <FormLabel htmlFor="url">URL</FormLabel>
      <Input
        placeholder="https://some-important-link.com"
        value={ctaData.url}
        onInput={changeHandler}
        variant="filled"
        name="url"
        id="url"
        type="text"
        required
      />
      <br />
      <HStack mt="10px">
        <FormLabel htmlFor="is_live" m="0px">
          Show CTA
        </FormLabel>
        <Switch
          name="is_live"
          id="is_live"
          isChecked={ctaData.is_live}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            let val = !!e.target.checked;
            // @ts-ignore
            setCtaData((old) => {
              return { ...old, is_live: val };
            });
          }}
        />
      </HStack>
      <HStack justifyContent="right">
        <Button
          onClick={() => onDelete(ctaData.id || "")}
          variant="outline"
          isLoading={isLoading}
        >
          <FaTrash />
        </Button>
        <Button
          colorScheme="blue"
          rightIcon={<FaSave />}
          isLoading={isLoading}
          onClick={submitHandler}
        >
          SAVE
        </Button>
      </HStack>
    </FormControl>
  );
}
