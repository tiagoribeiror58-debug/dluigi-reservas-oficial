export interface Package {
  id: string;
  icon_name: string;
  title: string;
  desc: string;
  tag: string;
  event_type: string;
  buffet: string;
  color: string;
  active: boolean;
  image_urls?: string[];
  price?: string;
  visible_fields?: string[];
  created_at?: string;
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
  admin_notes?: string;
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

export type CRMStage = 'novo' | 'em_contato' | 'negociando' | 'fechado' | 'perdido';
export type ReservationStatus = CRMStage;
export type FilterType = 'all' | CRMStage;
export type CRMView = 'dashboard' | 'pipeline' | 'leads' | 'templates' | 'pacotes' | 'ajuda';
