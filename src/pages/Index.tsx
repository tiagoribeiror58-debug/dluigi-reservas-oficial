import { useState, useEffect } from 'react';
import { Package, Reservation, FormErrors } from '@/types/reservation';
import { PACKAGES } from '@/lib/constants'; // Fallback
import { validateForm, getBlockedDates, detectPeriod } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import Hero from '@/components/landing/Hero';
import VideoSection from '@/components/landing/VideoSection';
import PhotoGallery from '@/components/landing/PhotoGallery';
import PackagesSection from '@/components/landing/PackagesSection';
import ReservationModal from '@/components/landing/ReservationModal';
import Footer from '@/components/layout/Footer';
import GoogleReviewsSection from '@/components/landing/GoogleReviewsSection';

interface HomeProps {
  onSuccess: () => void;
}

export default function Home({ onSuccess }: HomeProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPkgs = async () => {
      const { data, error } = await supabase.from('packages').select('*').eq('active', true).order('created_at', { ascending: true });
      if (data && !error) {
        setPackages(data as Package[]);
      } else {
        setPackages(PACKAGES);
      }
    };
    fetchPkgs();
  }, []);

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
    const pkg = packages.find((p) => p.id === id);
    if (!pkg) return;

    setSelectedPackage(id);
    setForm({
      ...form,
      eventType: pkg.event_type,
      buffet: pkg.buffet,
      guests: '12',
      notes: `Pacote selecionado: ${pkg.title}`,
      birthday: pkg.event_type === 'Aniversário' ? true : form.birthday,
    });
    setErrors({
      ...errors,
      eventType: '',
      buffet: '',
      guests: '',
    });

    setIsModalOpen(true);
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
      name: form.name,
      phone: form.phone,
      date: form.date,
      time: form.time,
      guests: parseInt(form.guests),
      event_type: form.eventType,
      buffet: form.buffet,
      birthday: form.birthday,
      notes: form.notes,
      period,
      status: 'pendente',
      package_id: selectedPackage || '',
    };

    const { error } = await supabase.from('reservations').insert([reservation]);

    if (error) {
      console.error('Error creating reservation:', error);
      alert('Erro ao criar reserva. Tente novamente.');
      return;
    }

    setIsModalOpen(false);
    onSuccess();
  };

  const scrollToPackages = () => {
    const el = document.querySelector('.section-packages');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Hero onCtaClick={scrollToPackages} />
      <VideoSection 
        title="Conheça o Nosso Espaço" 
        subtitle="Assista aos nossos vídeos e sinta a atmosfera perfeita para a sua família"
        videos={[
          { id: '1', url: '/videos/video1.mp4', title: 'Espaço Amplo e Kids' },
          { id: '2', url: '/videos/video2.mp4', title: 'D\'Luigi Pizzaria' },
          { id: '5', url: '/videos/VIDEO 5.MP4', title: 'Uma Noite Especial' }
        ]}
      />
      <div className="divider my-8">
        <hr />
      </div>

      <PackagesSection packages={packages} selectedPackage={selectedPackage} onSelectPackage={handlePackageSelect} />
      <div className="divider">
        <hr />
      </div>
      <PhotoGallery />
      <div className="divider my-6">
        <hr />
      </div>
      <GoogleReviewsSection />
      
      <div className="divider my-6">
        <hr />
      </div>
      <VideoSection 
        title="Celebre Conosco" 
        subtitle="O lugar ideal para suas festas e confraternizações"
        videos={[
          { id: '3', url: '/videos/video3.mp4', title: 'Festas de Final de Ano' },
          { id: '4', url: '/videos/video4.mp4', title: 'Confraternização' }
        ]}
      />
      
      <ReservationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        form={form}
        errors={errors}
        packages={packages}
        selectedPackage={selectedPackage}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
      />

      <Footer />
    </>
  );
}
