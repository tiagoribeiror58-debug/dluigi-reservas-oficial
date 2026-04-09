import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Reservation, FormErrors } from "@/types/reservation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMinDate(guests?: string | number): string {
  const g = parseInt(String(guests)) || 0;
  const days = g > 20 ? 2 : 1;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

export function detectPeriod(time: string): 'diurno' | 'noturno' {
  if (!time) return 'noturno';
  const hour = parseInt(time.split(':')[0], 10);
  return hour >= 18 ? 'noturno' : 'diurno';
}

export function getBlockedDates(): string[] {
  // Retornará datas bloqueadas no futuro
  return [];
}

export function validateForm(form: Reservation, blockedDates: string[]): FormErrors {
  const errors: FormErrors = {};
  if (!form.name) errors.name = 'Nome é obrigatório';
  if (!form.phone) errors.phone = 'Telefone é obrigatório';
  if (!form.date) errors.date = 'Data é obrigatória';
  if (!form.time) errors.time = 'Horário é obrigatório';
  if (blockedDates.includes(form.date)) errors.date = 'Data bloqueada/indisponível';
  return errors;
}
