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

export interface AdminNote {
  id: string;
  text: string;
  created_at: string;
  author: string;
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
  admin_notes?: AdminNote[] | any; // Backwards compatible parsing
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

// CRM pipeline stages (for Leads/Pipeline view)
export type CRMStage = 'novo' | 'em_contato' | 'negociando' | 'fechado' | 'perdido';

// D'Luigi reservation statuses (for reservations management)
export type ReservationStatus = 'pendente' | 'confirmada' | 'cancelada';
export type FilterType = 'all' | ReservationStatus;
export type CRMView = 'dashboard' | 'pipeline' | 'leads' | 'templates' | 'pacotes' | 'ajuda';
