export type Service = {
  id?: string;
  title: string;
  url?: string;
  phone?: string;
  video?: string;
  has_whatsapp?: boolean;
  has_viber?: boolean;
  images?: string[];
  is_live: boolean;
  description?: string;
  type?: string;
  address?: string;
  order_index?: number;
  venue_id?: string;
};
