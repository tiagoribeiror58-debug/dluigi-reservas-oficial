import { Reservation, FormErrors } from './types';

function secondSunday(year: number, month: number): string {
  const date = new Date(year, month, 1);
  let count = 0;
  while (count < 2) {
    if (date.getDay() === 0) count++;
    if (count < 2) date.setDate(date.getDate() + 1);
  }
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function getBlockedDates(): string[] {
  const year = new Date().getFullYear();
  const blocked: string[] = [];

  [year, year + 1].forEach((yr) => {
    blocked.push(secondSunday(yr, 4));
    blocked.push(`${yr}-06-12`);
    blocked.push(secondSunday(yr, 7));
  });

  return blocked;
}

export function getMinDate(guests: string): string {
  const date = new Date();
  const guestCount = parseInt(guests) || 0;
  date.setDate(date.getDate() + (guestCount > 20 ? 2 : 1));
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function detectPeriod(time: string): string {
  if (!time) return '';
  const hour = parseInt(time.split(':')[0]);
  return hour >= 11 && hour < 16 ? 'diurno' : hour >= 19 ? 'noturno' : '';
}

export function validateForm(form: Reservation, blockedDates: string[]): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) {
    errors.name = 'Nome obrigatório';
  }

  if (!form.phone.trim()) {
    errors.phone = 'Contato obrigatório';
  }

  const guestCount = parseInt(form.guests);
  if (!form.guests || guestCount < 1) {
    errors.guests = 'Informe o número de pessoas';
  } else if (guestCount > 100) {
    errors.guests = 'Capacidade máxima: 100 pessoas';
  }

  if (!form.date) {
    errors.date = 'Data obrigatória';
  } else if (blockedDates.includes(form.date)) {
    errors.date = 'Data indisponível (data festiva)';
  } else {
    const minDate = getMinDate(form.guests);
    if (form.date < minDate) {
      errors.date = guestCount > 20
        ? 'Reservas com +20 pessoas: mínimo 2 dias de antecedência'
        : 'Mínimo 1 dia de antecedência';
    }
  }

  if (!form.time) {
    errors.time = 'Horário obrigatório';
  }

  if (!form.eventType) {
    errors.eventType = 'Selecione o tipo de evento';
  }

  if (!form.buffet) {
    errors.buffet = 'Selecione uma opção';
  }

  return errors;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T12:00');
  return date.toLocaleDateString('pt-BR');
}

export function daysUntil(dateString: string): number {
  const target = new Date(dateString + 'T12:00');
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatWhatsAppNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10 || cleaned.length === 11) {
    return `55${cleaned}`;
  }
  return cleaned;
}
