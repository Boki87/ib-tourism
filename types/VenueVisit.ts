import { Venue } from "./Venue";
import { Employee } from "./Employee";
import { Nfc } from "./Nfc";

export type VenueType = {
  id?: number;
  venue_id?: string;
  active_employee_id?: string;
  created_at?: string;
  nfc_id?: string;
};

export type VenueTypeExpanded = VenueType & { venues: Venue } & {
  employees: Employee;
} & { nfcs: Nfc };
