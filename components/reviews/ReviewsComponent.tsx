import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../libs/supabase";
import { ReviewTemplate } from "../../types/ReviewTemplate";
import { Box, Button, HStack } from "@chakra-ui/react";
import ReviewTemplatesList from "../ReviewTemplatesList";
import { FaChartLine } from "react-icons/fa";
import { ReviewsStatsModal } from "../ReviewsStatsModal";

interface ReviewsComponentProps {
  userId: string;
  venueId: string;
}

const ReviewsContext = createContext<{
  reviewTemplates: ReviewTemplate[];
  updateReview: (r: ReviewTemplate) => void;
  deleteReview: (id: string) => void;
}>({
  reviewTemplates: [],
  updateReview: () => {},
  deleteReview: () => {},
});

export const useReviewTemplates = () => useContext(ReviewsContext);

export default function ReviewsComponent({
  userId,
  venueId,
}: ReviewsComponentProps) {
  const [isReviewsStatsModalOpen, setIsReviewsStatsModalOpen] = useState(false);
  const [reviewTemplates, setReviewTemplates] = useState<ReviewTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchReviewTemplates() {
    const { data, error } = await supabase
      .from("review_templates")
      .select()
      .match({ owner_id: userId, venue_id: venueId })
      .order("order_index", { ascending: true });
    if (error) return;
    //@ts-ignore
    setReviewTemplates(data);
  }

  async function newQuestionTemplateHandler() {
    if (!userId) return;
    setIsLoading(true);
    const order_index =
      reviewTemplates.length > 0
        ? Math.max(...reviewTemplates.map((r) => r.order_index)) + 1
        : 0;
    const { data, error } = await supabase
      .from("review_templates")
      .insert({
        question: "Change me",
        venue_id: venueId,
        rating_limit: 5,
        order_index,
        is_active: true,
        owner_id: userId,
      })
      .select()
      .single();

    if (!data || error) {
      //handle error
      window.alert("Something went wrong, please try again.");
      setIsLoading(false);
      return;
    }
    setReviewTemplates((old: any) => {
      return [...old, data].sort((a, b) => {
        return a.order_index - b.order_index;
      });
    });
    setIsLoading(false);
  }

  async function updateReviewTemplate(review: ReviewTemplate) {
    const { id, ...rest } = review;
    const { data, error } = await supabase
      .from("review_templates")
      .update({ ...rest })
      .match({ id })
      .select()
      .single();

    if (!data || error) return;
    setReviewTemplates((old: any) => {
      return old
        .map((r: any) => {
          if (r.id === data.id) {
            return data;
          } else {
            return r;
          }
        })
        .sort((a: any, b: any) => {
          return a.order_index - b.order_index;
        });
    });
  }

  async function deleteReviewTemplate(id: string) {
    const { data, error } = await supabase
      .from("review_templates")
      .delete()
      .match({ id });

    if (error) return;

    setReviewTemplates((old) => {
      return old.filter((r) => r.id !== id);
    });

    const { data: entries, error: entriesError } = await supabase
      .from("review_entries")
      .delete()
      .match({ venue_id: venueId, review_template_id: id });
  }

  useEffect(() => {
    fetchReviewTemplates();
  }, [venueId]);

  return (
    <>
      <ReviewsContext.Provider
        value={{
          reviewTemplates,
          updateReview: updateReviewTemplate,
          deleteReview: deleteReviewTemplate,
        }}
      >
        <Box mx="auto" maxW="2xl" w="full" my="30px">
          <ReviewTemplatesList />
          <HStack>
            <Button
              onClick={newQuestionTemplateHandler}
              colorScheme="blue"
              w="full"
            >
              ADD NEW QUESTION
            </Button>
            <Button
              onClick={() => setIsReviewsStatsModalOpen(true)}
              rightIcon={<FaChartLine />}
            >
              Stats
            </Button>
          </HStack>
        </Box>
      </ReviewsContext.Provider>
      <ReviewsStatsModal
        isOpen={isReviewsStatsModalOpen}
        venueId={venueId}
        onClose={() => setIsReviewsStatsModalOpen(false)}
      />
    </>
  );
}
