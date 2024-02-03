import { useEffect, useState } from "react";
import { supabase } from "../libs/supabase";
import { Service } from "../types/Service";

export function useServices(
  activeServiceCategory: string | null,
  venueId: string,
) {
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
    if (activeServiceCategory === "") return;

    let fetchQuery: { venue_id: string; category_id?: string; type?: string };

    if (activeServiceCategory === "_") {
      fetchQuery = {
        venue_id: venueId,
        type: "_",
      };
    } else {
      fetchQuery = {
        venue_id: venueId,
        category_id: activeServiceCategory || "",
      };
    }

    setLoading(true);
    const { data, error: servicesError } = await supabase
      .from("external_offers")
      .select("*")
      .match(fetchQuery)
      .order("order_index");

    if (servicesError) {
      setLoading(false);
      return;
    }

    setServices(data as Service[]);
    setLoading(false);
  }

  async function addService(isForFront?: boolean) {
    setLoading(true);

    let insertObj: {
      title: string;
      description: string;
      venue_id: string;
      category_id?: string;
      type?: string;
    };

    if (isForFront) {
      insertObj = {
        title: "Change me",
        description: "Generic description",
        venue_id: venueId,
        type: "_",
      };
    } else {
      insertObj = {
        title: "Change me",
        description: "Generic description",
        venue_id: venueId,
        category_id: activeServiceCategory || "",
      };
    }

    const { error: servicesError } = await supabase
      .from("external_offers")
      .insert(insertObj);
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

  async function handleDragEnd({
    active,
    over,
  }: {
    active: { id: string };
    over: { id: string } | null;
  }) {
    const activeService = services.filter((s) => s.id === active.id)[0];
    const overService = over
      ? services.filter((s) => s.id === over.id)[0]
      : null;
    if (!overService) return;
    if (activeService.id === overService.id) return;

    const targetIndex = services.findIndex((s) => s.id === overService.id);
    const oldIndex = services.findIndex((s) => s.id === activeService.id);

    let servicesClone = [...services];
    servicesClone.splice(oldIndex, 1);
    servicesClone.splice(targetIndex, 0, activeService);

    servicesClone = servicesClone.map((service, index) => {
      return { ...service, order_index: index };
    });

    setServices(servicesClone);

    const updatePromises = servicesClone.map((service) => {
      const { id, order_index } = service;
      return supabase
        .from("external_offers")
        .update({ order_index })
        .eq("id", id);
    });

    try {
      await Promise.all(updatePromises);
    } catch (e) {
      console.log(`Error updating order: ${e}`);
    }
  }

  useEffect(() => {
    if (activeServiceCategory != "") {
      fetchServices();
    } else {
      setServices([]);
    }
  }, [activeServiceCategory, venueId]);

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
    handleDragEnd,
  };
}
