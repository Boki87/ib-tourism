import { Box, FormControl, FormLabel, Input, Switch } from "@chakra-ui/react";
import { SyntheticEvent, useState } from "react";
import { ExternalOffer } from "../../types/ExternalOffer";

interface ExternalOfferProps {
  offerData: ExternalOffer;
}

export default function ExternalOfferCard({ offerData }: ExternalOfferProps) {
  const [offer, setOffer] = useState(() => offerData);

  function updateOfferStateHandler(e: SyntheticEvent) {
    const input = e.target as HTMLInputElement;
    setOffer((prev) => {
      return { ...prev, [input.name]: input.value };
    });
  }

  return (
    <Box
      w="full"
      my={2}
      bg="gray.50"
      p={4}
      border="1px"
      borderColor="gray.200"
      rounded="md"
    >
      <FormControl mb={2}>
        <FormLabel>Offer title</FormLabel>
        <Input
          placeholder="i.e. Taxi Service"
          value={offer.title}
          name="title"
          onInput={updateOfferStateHandler}
        />
      </FormControl>
      <FormControl mb={2}>
        <FormLabel>Website</FormLabel>
        <Input
          placeholder="i.e. Taxi Services Website"
          value={offer.url || ""}
          name="url"
          onInput={updateOfferStateHandler}
        />
      </FormControl>
      <FormControl mb={2}>
        <FormLabel>Phone</FormLabel>
        <Input
          placeholder="i.e. Taxi Services Phone"
          value={offer.phone || ""}
          name="phone"
          onInput={updateOfferStateHandler}
        />
      </FormControl>
      <FormControl mb={2} display="flex" alignItems="center" gap={2}>
        <FormLabel m={0}>Is live</FormLabel>
        <Switch />
      </FormControl>
    </Box>
  );
}
