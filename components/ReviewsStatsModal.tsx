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
  VStack,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import { SyntheticEvent, useEffect, useState } from "react";
import { useUserContext } from "../context";
import { supabase } from "../libs/supabase";
import { ReviewTemplate } from "../types/ReviewTemplate";
import { useRouter } from "next/router";
import StarRating from "./StarRating";
import { ReviewEntry } from "../types/ReviewEntry";
import { FaStar } from "react-icons/fa";

export function ReviewsStatsModal({
  isOpen,
  onClose,
  venueId,
}: {
  isOpen: boolean;
  venueId: string;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [reviews, setReviews] = useState<
    {
      sum: number;
      count: number;
      title: string;
    }[]
  >([]);
  const router = useRouter();

  function prepStats(entries: ReviewEntry[]) {
    const obj: {
      [x: string]: {
        sum: number;
        count: number;
      };
    } = {};
    entries.forEach((ent) => {
      if (!obj.hasOwnProperty(ent.question)) {
        obj[ent.question] = {
          sum: ent.rating,
          count: 1,
        };
      } else {
        obj[ent.question].sum = obj[ent.question].sum + ent.rating;
        obj[ent.question].count = obj[ent.question].count + 1;
      }
    });
    setReviews(
      Object.entries(obj).map((o) => {
        return {
          ...o[1],
          title: o[0],
        };
      })
    );
  }

  async function fetchReviews() {
    setIsFetching(true);
    const { data, error } = await supabase
      .from("review_entries")
      .select()
      .match({ venue_id: venueId });

    if (!error) {
      //@ts-ignore
      prepStats(data);
    }
    setIsFetching(false);
  }

  function roundHalf(num: number) {
    return Math.round(num * 2) / 2;
  }

  useEffect(() => {
    if (!isOpen) return;
    fetchReviews();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} size="2xl" onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reviews Average Ratings</ModalHeader>
        <ModalCloseButton />
        {!isFetching && (
          <ModalBody overflow="auto" p={6}>
            {reviews.map((review) => {
              return (
                <HStack key={review.title} mb={8}>
                  <Text fontSize="xl">{review.title}</Text>
                  <Spacer />
                  <Text fontSize="xl" fontWeight="bold">
                    {roundHalf(review.sum / review.count)}
                  </Text>
                  <FaStar color="orange" size="2rem" />
                </HStack>
              );
            })}
          </ModalBody>
        )}
        {isFetching && (
          <ModalBody>
            <Center>
              <Spinner size="xl" />
            </Center>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
