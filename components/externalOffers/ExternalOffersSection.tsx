import { Box, HStack, VStack, Text } from "@chakra-ui/react";
import Button from "../Button";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { ExternalOffer } from "../../types/ExternalOffer";
import { supabase } from "../../libs/supabase";
import ExternalOfferCard from "./ExternalOfferCard";

interface ExternalOffersSectionProps {
  offers?: ExternalOffer[];
  venueId: string;
}

export default function ExternalOffersSection({
  offers: initialOffers,
  venueId,
}: ExternalOffersSectionProps) {
  const [offers, setOffers] = useState<ExternalOffer[]>(initialOffers || []);
  const [isAdding, setIsAdding] = useState(false);

  async function addExternalOffer() {
    if (offers.length === 6) return;
    try {
      setIsAdding(true);
      const { data, error } = await supabase
        .from("external_offers")
        .insert({
          title: "Change Me",
          venue_id: venueId,
        })
        .select()
        .single();
      if (error) throw Error(error.message);
      console.log(data);
      //@ts-ignore
      const newOffers: ExternalOffer[] = [...offers, data];
      setOffers(newOffers);
      setIsAdding(false);
    } catch (e) {
      console.log(e);
      setIsAdding(false);
    }
  }

  async function deleteOfferHandler(id: string) {
    setOffers((prev) => {
      return prev.filter((offer) => offer.id !== id);
    });
  }

  return (
    <Box w="full" my={3}>
      <HStack justifyContent="end">
        <Button
          onClick={addExternalOffer}
          rightIcon={<FaPlus />}
          isLoading={isAdding}
          isDisabled={offers.length >= 6}
        >
          Add External Offer
        </Button>
      </HStack>
      <VStack my={3}>
        {offers.length > 0 && (
          <Text fontWeight="bold" fontSize="lg" color="gray.600">
            Your External Offers
          </Text>
        )}
        {offers.map((offer) => (
          <ExternalOfferCard
            offerData={offer}
            onDelete={deleteOfferHandler}
            key={offer.id}
          />
        ))}
      </VStack>
    </Box>
  );
}
