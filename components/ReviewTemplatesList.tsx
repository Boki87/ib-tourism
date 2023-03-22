import { VStack, Box, Text } from "@chakra-ui/react";
import { useReviewTemplates } from "../pages/admin/reviews";
import ReviewTemplate from "./ReviewTemplate";

export default function ReviewTemplatesList() {
  const { reviewTemplates } = useReviewTemplates();
  return (
    <VStack mb="30px">
      {reviewTemplates.length === 0 && (
        <Text mb="20px">
          No questions yet. Go ahead and create one by clicking the button
          below.
        </Text>
      )}
      {reviewTemplates.map((template) => {
        return <ReviewTemplate data={template} key={template.id} />;
      })}
    </VStack>
  );
}
