import { useState } from 'react';
import { Reservation, FormErrors } from '../types';
import { PACKAGES } from '../constants';
import { validateForm, getBlockedDates, detectPeriod } from '../utils';
import { supabase } from '../supabase';
import Hero from './Hero';
import PackagesSection from './PackagesSection';
import ReservationForm from './ReservationForm';
import Footer from './Footer';

interface HomeProps {
  onSuccess: () => void;
}

export default function Home({ onSuccess }: HomeProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [form, setForm] = useState<Reservation>({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    eventType: '',
    buffet: '',
    birthday: false,
    notes: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handlePackageSelect = (id: string) => {
    const pkg = PACKAGES.find((p) => p.id === id);
    if (!pkg) return;

    setSelectedPackage(id);
    setForm({
      ...form,
      eventType: pkg.eventType,
      buffet: pkg.buffet,
    });
    setErrors({
      ...errors,
      eventType: '',
      buffet: '',
    });

    setTimeout(() => {
      const el = document.getElementById('form-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleFormChange = (updates: Partial<Reservation>) => {
    setForm({ ...form, ...updates });
    const updatedErrors = { ...errors };
    Object.keys(updates).forEach((key) => {
      delete updatedErrors[key as keyof FormErrors];
    });
    setErrors(updatedErrors);
  };

  const handleSubmit = async () => {
    const blockedDates = getBlockedDates();
    const validationErrors = validateForm(form, blockedDates);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const period = detectPeriod(form.time);
    const reservation = {
      ...form,
      period,
      status: 'pendente',
      package_id: selectedPackage || '',
      guests: parseInt(form.guests),
    };

    const { error } = await supabase.from('reservations').insert([reservation]);

    if (error) {
      console.error('Error creating reservation:', error);
      alert('Erro ao criar reserva. Tente novamente.');
      return;
    }

    onSuccess();
  };

  const scrollToPackages = () => {
    const el = document.querySelector('.section-packages');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToForm = () => {
    const el = document.getElementById('form-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Hero onCtaClick={scrollToPackages} />
      <PackagesSection selectedPackage={selectedPackage} onSelectPackage={handlePackageSelect} />
      <div className="divider">
        <hr />
      </div>
      <ReservationForm
        form={form}
        errors={errors}
        selectedPackage={selectedPackage}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
      />
      <Footer />
    </>
  );
}
