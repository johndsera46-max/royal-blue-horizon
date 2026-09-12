export interface BookingData {
  mode: "ocean" | "air" | "multimodal";
  origin: string;
  destination: string;
  readyDate: string;
  incoterm: string;
  cargoType: string;
  description: string;
  weight: string;
  units: string;
  notes: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  contactMethod: "email" | "phone";
}

export const EMPTY_BOOKING: BookingData = {
  mode: "ocean",
  origin: "",
  destination: "",
  readyDate: "",
  incoterm: "FOB",
  cargoType: "General cargo",
  description: "",
  weight: "",
  units: "",
  notes: "",
  fullName: "",
  company: "",
  email: "",
  phone: "",
  contactMethod: "email",
};
