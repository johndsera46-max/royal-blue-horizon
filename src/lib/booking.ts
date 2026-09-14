export interface BookingData {
  mode: "ocean" | "air" | "multimodal";
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  senderEmail: string;
  receiverName: string;
  receiverAddress: string;
  receiverPhone: string;
  receiverEmail: string;
  origin: string;
  destination: string;
  readyDate: string;
  eta: string;
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

export const NOTES_MAX_LENGTH = 4000;

export const EMPTY_BOOKING: BookingData = {
  mode: "ocean",
  senderName: "",
  senderAddress: "",
  senderPhone: "",
  senderEmail: "",
  receiverName: "",
  receiverAddress: "",
  receiverPhone: "",
  receiverEmail: "",
  origin: "",
  destination: "",
  readyDate: "",
  eta: "",
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
