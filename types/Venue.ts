import { ExternalOffer } from "./ExternalOffer";

export type Venue = {
  id?: string;
  owner_id?: string;
  website?: string;
  title?: string;
  description?: string;
  logo?: string;
  background_image?: string;
  background_color?: string;
  default_theme?: string;
  created_at?: string;
  phone?: string;
  email?: string;
  cta_link?: string;
  cta_title?: string;
  show_cta?: boolean;
  show_review?: boolean;
  externalOffers?: ExternalOffer[];
};
