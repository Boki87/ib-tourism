import { useState, useEffect } from "react";
import { supabase } from "../libs/supabase";
import { VenueType, VenueTypeExpanded } from "../types/VenueVisit";
import { LinkClickExpanded } from "../types/LinkClick";
import {
  prepareLinkChartData as prepareDeviceChartData,
  prepareVenueChartData,
} from "../libs/utils";

export function useStatsData(
  venueId?: string,
  dateRange?: { from: string; to: string }
) {
  const [venuesStats, setVenuesStats] = useState<any>();
  const [deviceStats, setDeviceStats] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  async function fetchVenueStats() {
    if (!dateRange) return;

    const { data: venuesData, error: venueError } = await supabase
      .from("venue_visits")
      .select("*, venues(*), employees(*), nfcs(*)")
      .match({ venue_id: venueId })
      .gte("created_at", dateRange?.from)
      .lte("created_at", dateRange?.to);

    if (venueError) return;

    const stats = prepareVenueChartData(
      venuesData,
      dateRange?.from,
      dateRange?.to
    );

    setVenuesStats(stats);
  }

  async function fetchDeviceStats() {
    if (!dateRange) return;
    const { data: deviceData, error: linkError } = await supabase
      .from("venue_links_clicks")
      .select("*, venues(*), venue_links(*), employees(*), nfcs(*)")
      .match({ venue_id: venueId })
      .gte("created_at", dateRange?.from)
      .lte("created_at", dateRange?.to);

    if (linkError) return;

    const stats = prepareDeviceChartData(
      deviceData,
      dateRange.from,
      dateRange.to
    );

    setDeviceStats(stats);
  }

  useEffect(() => {
    if (!venueId) return;
    async function fetchAll() {
      setIsLoading(true);
      await Promise.all([fetchVenueStats(), fetchDeviceStats()]);
      setIsLoading(false);
    }
    fetchAll();
  }, [venueId, dateRange]);

  return {
    venuesStats,
    deviceStats,
    isLoading,
  };
}
