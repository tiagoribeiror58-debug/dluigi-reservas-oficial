export interface Package {
  id: string;
  iconName: string;
  title: string;
  desc: string;
  tag: string;
  eventType: string;
  buffet: string;
  color: string;
}

export interface BuffetOption {
  value: string;
  label: string;
  desc: string;
}

export interface Reservation {
  id?: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  eventType: string;
  buffet: string;
  birthday: boolean;
  notes: string;
  period?: string;
  status?: string;
  package_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FormErrors {
  name?: string;
  phone?: string;
  date?: string;
  time?: string;
  guests?: string;
  eventType?: string;
  buffet?: string;
}

export type ReservationStatus = 'pendente' | 'confirmada' | 'cancelada';
export type FilterType = 'all' | ReservationStatus;
