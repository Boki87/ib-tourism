import {
  Input,
  Select,
  Box,
  VStack,
  Text,
  Stack,
  Switch,
  HStack,
  useColorModeValue,
  Spacer,
  Button,
  Center,
} from "@chakra-ui/react";
import {
  useRef,
  ChangeEvent,
  SyntheticEvent,
  useState,
  useEffect,
} from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ReviewTemplate as ReviewTemplateType } from "../types/ReviewTemplate";
import { useReviewTemplates } from "../components/reviews/ReviewsComponent";

interface IReviewTemplate {
  data: ReviewTemplateType;
}

export default function ReviewTemplate({ data }: IReviewTemplate) {
  const ref = useRef<HTMLInputElement>(null);
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [question, setQuestion] = useState(data.question);
  const [isActive, setIsActive] = useState(data.is_active);
  const [ratingLimit, setRatingLimit] = useState(data.rating_limit);

  const { updateReview, deleteReview } = useReviewTemplates();

  function isActiveChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    let val = !!e.target.checked;
    setIsActive(val);
    updateReview({ ...data, is_active: val });
  }

  function rateLimitChangeHandler(e: ChangeEvent<HTMLSelectElement>) {
    let val = +e.target.value;
    setRatingLimit(val);
    updateReview({ ...data, rating_limit: val });
  }

  function deleteHandler() {
    if (!data?.id) return;
    if (window.confirm("Are you sure you want to delete this question?")) {
      deleteReview(data.id);
    }
  }

  function submitHandler(e: SyntheticEvent) {
    e.preventDefault();
    updateReview({ ...data, question });
    setIsInEditMode(false);
  }

  function formCancel() {
    setIsInEditMode(false);
    setQuestion(data.question);
  }

  useEffect(() => {
    if (isInEditMode) {
      ref?.current?.focus();
    }
  }, [isInEditMode]);

  const borderColor = useColorModeValue("gray.200", "gray.700");
  return (
    <VStack
      w="full"
      border="1px"
      borderColor={borderColor}
      rounded="lg"
      my="15px"
    >
      <form style={{ width: "100%" }} onSubmit={submitHandler}>
        <Box w="full" p="3">
          {!isInEditMode && <Text isTruncated>{question}</Text>}
          {isInEditMode && (
            <Input
              ref={ref}
              required
              value={question}
              onInput={(e: SyntheticEvent) => {
                const input = e.target as HTMLInputElement;
                setQuestion(input.value);
              }}
            />
          )}
        </Box>
        <Box borderBottom="1px" borderColor={borderColor} w="full" />

        {!isInEditMode && (
          <HStack w="full" px="3" py={1} alignItems="center" flexWrap="wrap">
            <HStack mr="20px" mt="5px">
              <Text minW="90px">Rating limit</Text>
              <Select
                value={ratingLimit}
                size="sm"
                onChange={rateLimitChangeHandler}
              >
                <option value="5">1/5</option>
                <option value="10">1/10</option>
              </Select>
            </HStack>
            {/* <Spacer /> */}
            <Box
              display="flex"
              alignItems="center"
              style={{ marginLeft: "0px" }}
              mt="5px"
              h="full"
            >
              <Text mr="10px">Is Active</Text>
              <Switch
                size={["md", "lg"]}
                onChange={isActiveChangeHandler}
                isChecked={isActive}
              />
            </Box>
            <Spacer />
            <Button size="sm" onClick={deleteHandler}>
              <FaTrash />
            </Button>
            <Button size="sm" onClick={() => setIsInEditMode(true)}>
              <FaEdit />
            </Button>
          </HStack>
        )}
        {isInEditMode && (
          <Center w="full" px="3" py={1} gap="10px">
            <Button size="sm" type="submit">
              SAVE
            </Button>
            <Button size="sm" onClick={formCancel}>
              CANCEL
            </Button>
          </Center>
        )}
      </form>
    </VStack>
  );
}
