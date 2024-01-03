import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from "../libs/supabase";
import { Service } from "../types/Service";

export default function useService(serviceId: string | null) {
  const toast = useToast();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  async function fetchService() {
    setLoading(true);
    const { data, error: serviceError } = await supabase
      .from("external_offers")
      .select("*")
      .match({ id: serviceId })
      .single();
    if (serviceError) {
      setLoading(false);
      return;
    }

    setService(data as Service);
    setLoading(false);
  }

  async function updateService() {
    setUpdating(true);
    const { data, error } = await supabase
      .from("external_offers")
      .update(service)
      .match({ id: serviceId });

    toast({
      title: "Success!",
      description: "Service updated successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    if (error) {
      window.alert("Something went wrong");
      setUpdating(false);
      return;
    }
    setUpdating(false);
  }

  useEffect(() => {
    if (!!serviceId) {
      fetchService();
    } else {
      setService(null);
    }
  }, [serviceId]);

  return {
    service,
    loading,
    updating,
    setService,
    updateService,
  };
}
