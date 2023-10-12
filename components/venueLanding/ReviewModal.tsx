import {
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Center,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { SyntheticEvent, useEffect, useState } from "react";
import { useVenueData } from ".";
import { useUserContext } from "../../context";
import { supabase } from "../../libs/supabase";
import { ReviewTemplate } from "../../types/ReviewTemplate";
import { useRouter } from "next/router";
import StarRating from "../StarRating";

type ReviewTemplateWithVal = ReviewTemplate & { val: number };

export function ReviewModal() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();
  const { isReviewModalOpen, setIsReviewModalOpen, venueData } = useVenueData();

  const [questions, setQuestions] = useState<ReviewTemplateWithVal[]>([]);
  const [email, setEmail] = useState("");

  const { user } = useUserContext();

  async function fetchQuestions() {
    setIsFetching(true);
    const { data, error } = await supabase
      .from("review_templates")
      .select()
      .match({ venue_id: venueData?.id });

    if (!data || error) {
      setIsFetching(false);
      return;
    }
    //@ts-ignore
    setQuestions(data.map((d) => ({ ...d, val: 1 })));
    setIsFetching(false);
  }

  async function updateRating(id: string, val: number) {
    if (id === "") return;
    const newQuestions = questions.map((q) => {
      if (q.id === id) {
        return { ...q, val: val };
      } else {
        return q;
      }
    });
    setQuestions(newQuestions);
  }

  async function submitSurvey() {
    setIsLoading(true);
    const nfcId = router.query.id;

    const entries = questions.map((q) => {
      return {
        question: q.question,
        rating: q.val,
        venue_id: venueData?.id,
        nfc_id: nfcId,
        review_template_id: q.id,
      };
    });

    const reqBody = {
      entries,
      email,
    };

    try {
      let res = await fetch("/api/collect-survey", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });
      res = await res.json();
      //@ts-ignore
      if (res.error) {
        //@ts-ignore
        setIsReviewModalOpen(false);
        setIsLoading(true);
        return toast({
          status: "error",
          description: "You have already taken our survey",
          isClosable: true,
          duration: 3000,
        });
      }
      setIsReviewModalOpen(false);
      setIsLoading(true);
      return toast({
        status: "success",
        description: "Thank you for submitting your feedback",
        isClosable: true,
        duration: 3000,
      });
    } catch (e) {
      console.log(e);
      setIsReviewModalOpen(false);
      setIsLoading(true);
      return toast({
        status: "error",
        description: "You have already taken our survey",
        isClosable: true,
        duration: 3000,
      });
    }
  }

  useEffect(() => {
    if (isReviewModalOpen) {
      setEmail("");
      //fetch review template questions
      fetchQuestions();
    } else {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [isReviewModalOpen]);

  return (
    <Modal
      isOpen={isReviewModalOpen}
      onClose={() => setIsReviewModalOpen(false)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Survey</ModalHeader>
        <ModalCloseButton />
        {!isFetching && (
          <ModalBody pb={6} overflow="auto" px={3}>
            {questions
              .sort((a, b) => a.order_index - b.order_index)
              .map((q) => {
                if (q.is_active)
                  return (
                    <Box key={q.id} mb="10px">
                      <Text mb="5px">{q.question}</Text>
                      <StarRating
                        maxValue={q.rating_limit}
                        value={q.val}
                        onChange={(val: number) =>
                          updateRating(q.id || "", val)
                        }
                        showRatingNumber
                      />
                    </Box>
                  );
              })}
            <FormControl>
              <FormLabel>Email (Optional)</FormLabel>
              <Input
                value={email}
                onInput={(e: SyntheticEvent) => {
                  const input = e.target as HTMLInputElement;
                  setEmail(input.value);
                }}
                placeholder="youremail@email.com"
              />
              <FormHelperText>
                By providing your email in the form above you agree to our terms
                and conditions
              </FormHelperText>
            </FormControl>
          </ModalBody>
        )}
        {isFetching && (
          <ModalBody>
            <Center>
              <Spinner size="xl" />
            </Center>
          </ModalBody>
        )}
        <ModalFooter>
          <Center w="full">
            <Button
              isLoading={isLoading}
              onClick={submitSurvey}
              colorScheme="blue"
              mr={3}
            >
              Submit
            </Button>
            <Button onClick={() => setIsReviewModalOpen(false)}>Cancel</Button>
          </Center>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
