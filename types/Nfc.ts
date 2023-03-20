export type Nfc = {
  id?: string;
  active_amployee_id?: string;
  created_at?: string;
  is_active?: boolean;
  device_type_id?: number;
  owner_id?: string;
  venue_id?: string;
  title?: string;
};

type NfcExtra = {
  device_types?: {
    image?: string;
  };
  venues?: {
    id?: string;
    logo?: string;
    title?: string;
  };
  employees?: {
    id?: string;
    full_name?: string;
  };
};

export type NfcExtended = Nfc & NfcExtra;
