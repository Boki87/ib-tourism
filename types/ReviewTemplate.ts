export type ReviewTemplate = {
  id?: string;
  question: string;
  venue_id: string;
  rating_limit?: number;
  order_index: number;
  created_at: string;
  is_active: boolean;
};
