import {
  useState,
  SyntheticEvent,
  useEffect,
  createContext,
  useContext,
} from "react";
import { GetServerSidePropsContext } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Box, Button, HStack, Select } from "@chakra-ui/react";
import AdminLayout from "../../components/AdminLayout";
import { Owner } from "../../types/Owner";
import { Venue } from "../../types/Venue";
import { ReviewTemplate } from "../../types/ReviewTemplate";
import ReviewTemplatesList from "../../components/ReviewTemplatesList";
import { supabase } from "../../libs/supabase";
import { FaChartLine } from "react-icons/fa";
import { ReviewsStatsModal } from "../../components/ReviewsStatsModal";

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

export default function Reviews({
  user,
  venues,
  reviewTemplates: reviewTemplatesDb,
}: {
  user: Owner;
  venues: Venue[];
  reviewTemplates: ReviewTemplate[];
}) {
  const [isReviewsStatsModalOpen, setIsReviewsStatsModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(venues[0].id || "");
  const [reviewTemplates, setReviewTemplates] = useState(reviewTemplatesDb);
  const [isLoading, setIsLoading] = useState(false);

  function selectChangeHandler(e: SyntheticEvent) {
    const select = e.target as HTMLSelectElement;
    setSelectedVenue(select.value);
    fetchReviewTemplates(select.value);
  }

  async function fetchReviewTemplates(venueId: string) {
    const { data, error } = await supabase
      .from("review_templates")
      .select()
      .match({ owner_id: user.id, venue_id: venueId })
      .order("order_index", { ascending: true });
    if (error) return;
    console.log(error, data);
    //@ts-ignore
    setReviewTemplates(data);
  }

  async function newQuestionTemplateHandler() {
    console.log(user);
    if (!user) return;
    setIsLoading(true);
    const order_index =
      reviewTemplates.length > 0
        ? Math.max(...reviewTemplates.map((r) => r.order_index)) + 1
        : 0;
    const { data, error } = await supabase
      .from("review_templates")
      .insert({
        question: "Change me",
        venue_id: selectedVenue,
        rating_limit: 5,
        order_index,
        is_active: true,
        owner_id: user.id,
      })
      .select()
      .single();

    if (!data || error) {
      //handle error
      window.alert("Something went wrong, please try again.");
      setIsLoading(false);
      return;
    }
    console.log(data);
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
    console.log(data);
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
      .match({ venue_id: selectedVenue, review_template_id: id });
  }

  return (
    <AdminLayout>
      <ReviewsContext.Provider
        value={{
          reviewTemplates,
          updateReview: updateReviewTemplate,
          deleteReview: deleteReviewTemplate,
        }}
      >
        <Box mx="auto" maxW="2xl" w="full" my="30px">
          <Select
            mb="20px"
            value={selectedVenue}
            onChange={selectChangeHandler}
          >
            {venues?.map((venue) => (
              <option value={venue.id} key={venue.id}>
                {venue.title}
              </option>
            ))}
          </Select>
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
        venueId={selectedVenue}
        onClose={() => setIsReviewsStatsModalOpen(false)}
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

  const props: {
    user: Owner | null;
    venues: Venue[];
    reviewTemplates: ReviewTemplate[];
  } = {
    user: null,
    venues: [],
    reviewTemplates: [],
  };

  if (!data.session?.user) {
    return redirectObj;
  }

  const { data: ownerData, error } = await supabase
    .from("owners")
    .select()
    .match({ id: data.session.user.id })
    .single();
  if (!error && ownerData) {
    props.user = ownerData;
  }

  const { data: venues, error: venuesError } = await supabase
    .from("venues")
    .select()
    .match({ owner_id: data.session.user.id })
    .order("created_at", { ascending: true });
  if (!venuesError && venues) {
    props.venues = venues;
  }

  if (venues && venues?.length > 0) {
    const { data: reviewTemplates, error: reviewTemplatesError } =
      await supabase
        .from("review_templates")
        .select()
        .match({ owner_id: data.session.user.id, venue_id: venues[0]?.id })
        .order("order_index", { ascending: true });
    if (!reviewTemplatesError && reviewTemplates) {
      //@ts-ignore
      props.reviewTemplates = reviewTemplates;
    }
  }

  return { props };
};
