import { Venue } from "./Venue";
import { Employee } from "./Employee";
import { Nfc } from "./Nfc";
import { Link } from "./Link";

export type LinkClickType = {
  id?: number;
  venue_id?: string;
  active_employee_id?: string;
  created_at?: string;
  nfc_id?: string;
};

export type LinkClickExpanded = LinkClickType & { venues: Venue } & {
  employees: Employee;
} & { nfcs: Nfc } & { venue_links: Link };
