import houseRules from "./assets/house_rules.svg";
import sos from "./assets/sos.svg";
import transport from "./assets/transport.svg";
import restaurants from "./assets/restaurants.svg";
import tours from "./assets/tours.svg";
import servicesIcon from "./assets/services.svg";
import attractions from "./assets/attractions.svg";
import offers from "./assets/offers.svg";

export const services: { key: string; label: string; image: any }[] = [
  {
    key: "house_rules",
    label: "house rules",
    image: houseRules,
  },
  {
    key: "sos",
    label: "sos",
    image: sos,
  },
  {
    key: "transport",
    label: "transport",
    image: transport,
  },
  {
    key: "restaurants",
    label: "restaurants",
    image: restaurants,
  },
  {
    key: "tours",
    label: "day tours",
    image: tours,
  },
  {
    key: "services",
    label: "services",
    image: servicesIcon,
  },
  {
    key: "attractions",
    label: "what to visit",
    image: attractions,
  },
  {
    key: "offers",
    label: "our offers",
    image: offers,
  },
];
