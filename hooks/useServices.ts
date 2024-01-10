import { useEffect, useState } from "react";
import { supabase } from "../libs/supabase";
import { Service } from "../types/Service";

export function useServices(activeServiceType: string | null, venueId: string) {
  const [services, setServices] = useState<Service[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);

  async function fetchAllServices() {
    setLoadingAll(true);
    const { data, error: servicesError } = await supabase
      .from("external_offers")
      .select("*")
      .match({ venue_id: venueId })
      .order("created_at");
    if (servicesError) {
      setLoadingAll(false);
      return;
    }
    setAllServices(data as Service[]);
    setLoadingAll(false);
  }

  async function fetchServices() {
    if (activeServiceType === "") return;
    setLoading(true);
    const { data, error: servicesError } = await supabase
      .from("external_offers")
      .select("*")
      .match({ venue_id: venueId, type: activeServiceType })
      .order("created_at");

    console.log(1111, venueId, activeServiceType, data, servicesError);

    if (servicesError) {
      setLoading(false);
      return;
    }

    setServices(data as Service[]);
    setLoading(false);
  }

  async function addService() {
    setLoading(true);
    const { error: servicesError } = await supabase
      .from("external_offers")
      .insert({
        title: "Change me",
        description: "Generic description",
        venue_id: venueId,
        type: activeServiceType,
      });
    if (servicesError) {
      setLoading(false);
      return;
    }
    await fetchServices();
    setLoading(false);
  }

  async function deleteService(serviceId: string) {
    const { error } = await supabase
      .from("external_offers")
      .delete()
      .match({ id: serviceId });
    if (error) {
      return;
    }
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
  }

  useEffect(() => {
    if (!!activeServiceType) {
      fetchServices();
    } else {
      setServices([]);
    }
  }, [activeServiceType, venueId]);

  return {
    addService,
    deleteService,
    fetchServices,
    setServices,
    services,
    loading,
    loadingAll,
    fetchAllServices,
    allServices,
  };
}
