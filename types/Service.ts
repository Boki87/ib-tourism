export type Service = {
  id?: string;
  title: string;
  url?: string;
  phone?: string;
  images?: string[];
  is_live: boolean;
  description?: string;
  type?: string;
  address?: string;
  order_index?: number;
  venue_id?: string;
};
