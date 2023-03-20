import { useState, useEffect } from "react";
import { supabase } from "../libs/supabase";
import { VenueType, VenueTypeExpanded } from "../types/VenueVisit";
import { LinkClickExpanded } from "../types/LinkClick";
import {
  prepareLinkChartData as prepareDeviceChartData,
  prepareVenueChartData,
} from "../libs/utils";
import { venue_links } from "../libs/utils";

export function useStatsData(
  venueId?: string,
  dateRange?: { from: string; to: string }
) {
  const [venuesStats, setVenuesStats] = useState<any>();
  const [deviceStats, setDeviceStats] = useState<any>();
  const [socialStats, setSocialStats] = useState<any>();
  const [tableStats, setTableStats] = useState<any>();
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

    const socials = prepareDeviceChartData(
      deviceData,
      dateRange.from,
      dateRange.to,
      "social"
    );

    setDeviceStats(stats);
    setSocialStats(socials);
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

  useEffect(() => {
    if (!deviceStats && !venuesStats) return;
    let data: {
      devices: {
        nfc_id: string;
        title: string;
        totalVisitsTimeRange: number;
        links: { title: string; clicks: number }[];
      }[];
      venue: { totalVisitsTimeRange: number; totalVisits: number };
    } = {
      venue: {
        totalVisitsTimeRange: 0,
        totalVisits: 0,
      },
      devices: [],
    };

    data.venue.totalVisits = venuesStats?.datasets[0]?.data.reduce(
      (acc: number, currVal: number) => {
        return acc + currVal;
      },
      0
    );

    data.venue.totalVisitsTimeRange = deviceStats?.datasets?.reduce(
      (acc: number, iter: { total: number }) => acc + iter.total,
      0
    );

    async function fetch() {
      //pre-populate devices
      const { data: nfcData, error: nfcError } = await supabase
        .from("nfcs")
        .select()
        .match({ venue_id: venueId });

      if (!nfcError) {
        data.devices = [];
        nfcData?.forEach((nfc) => {
          data.devices.push({
            nfc_id: nfc.id,
            title: nfc.title,
            totalVisitsTimeRange: 0,
            links: venue_links.map((link) => {
              return { title: link.name, clicks: 0 };
            }),
          });
        });
        data.devices.map((d) => {
          deviceStats?.datasets.forEach((dStat: any) => {
            if (dStat.nfc_id === d.nfc_id) {
              d.totalVisitsTimeRange = dStat.total;
            }
          });
          return d;
        });
      }

      const { data: venueVisitsData, error: venueVisitsError } = await supabase
        .from("venue_visits")
        .select()
        .match({ venue_id: venueId });
      if (!venueVisitsError) {
        data.venue.totalVisits = venueVisitsData?.length;
      }

      const { data: linksData, error: linksDataError } = await supabase
        .from("venue_links_clicks")
        .select("*, venues(*), venue_links(*), employees(*), nfcs(*)")
        .match({ venue_id: venueId })
        .gte("created_at", dateRange?.from)
        .lte("created_at", dateRange?.to);

      if (!linksDataError) {
        linksData.forEach((link_click) => {
          data.devices.map((device) => {
            if (device.nfc_id === link_click.nfc_id) {
              device.links.map((link) => {
                if (link.title === link_click.venue_links.type) {
                  link.clicks += 1;
                }
                return link;
              });
            }

            return device;
          });
        });
      }
      setTableStats(data);
    }

    fetch();
  }, [deviceStats, venuesStats]);

  return {
    venuesStats,
    deviceStats,
    socialStats,
    tableStats,
    isLoading,
  };
}
