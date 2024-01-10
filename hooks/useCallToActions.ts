import { useState } from "react";
import { supabase } from "../libs/supabase";
import { CallToAction } from "../types/CallToAction";
import { useToast } from "@chakra-ui/react";

export default function useCallToActions(
  venueId: string,
  actions: CallToAction[],
) {
  const toast = useToast();
  const [callToActions, setCallToActons] = useState<CallToAction[]>(actions);
  const [loading, setLoading] = useState(false);
  const [loadingCtas, setLoadingCtas] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  async function fetchCtas() {
    setLoadingCtas(true);
    const { data, error } = await supabase
      .from("call_to_actions")
      .select()
      .match({ venue_id: venueId })
      .order("created_at");
    if (error) {
      setLoadingCtas(false);
      return toast({
        title: "Error!",
        description: "Something went wrong, could not fetch cta's",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setCallToActons(data as CallToAction[]);
  }

  async function addCta(cta: CallToAction) {
    setLoading(true);
    const { error } = await supabase
      .from("call_to_actions")
      .insert({ ...cta, venue_id: venueId });

    if (error) {
      setLoading(false);
      return toast({
        title: "Error!",
        description: "Something went wrong, pleaes refresh and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    fetchCtas();
    setLoading(false);
  }

  async function updateCta(ctaData: { id: string } & Omit<CallToAction, "id">) {
    setUpdating(ctaData.id);
    const { data, error } = await supabase
      .from("call_to_actions")
      .update(ctaData)
      .match({ id: ctaData.id })
      .select();
    if (error) {
      setUpdating(null);
      return toast({
        title: "Error!",
        description: "Something went wrong, pleaes refresh and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setUpdating(null);
  }

  async function deleteCta(id: string) {
    setUpdating(id);
    const { error } = await supabase
      .from("call_to_actions")
      .delete()
      .match({ id });
    if (error) {
      setUpdating(null);
      return toast({
        title: "Error!",
        description: "Something went wrong, pleaes refresh and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setCallToActons((old) => old.filter((cta) => cta.id !== id));

    setUpdating(null);
  }

  return {
    callToActions,
    fetchCtas,
    addCta,
    updateCta,
    deleteCta,
    loading,
    updating,
    loadingCtas,
  };
}
