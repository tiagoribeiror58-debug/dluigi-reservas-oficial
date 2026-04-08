import { Package, BuffetOption } from '@/types/reservation';

export const PACKAGES: Package[] = [
  {
    id: 'aniversario',
    icon_name: 'Cake',
    title: 'Aniversário em família',
    desc: 'Pizza, bolo, espaço kids e muito afeto. O lugar certo para celebrar.',
    tag: 'Até 100 pessoas',
    event_type: 'Aniversário',
    buffet: 'buffet_full',
    color: '#FFF0EE',
    active: true,
  },
  {
    id: 'bodas',
    icon_name: 'HeartHandshake',
    title: 'Bodas & Mini casamento',
    desc: 'Um ambiente acolhedor para os momentos mais especiais da vida a dois.',
    tag: 'Ambiente íntimo',
    event_type: 'Mini casamento',
    buffet: 'buffet_full',
    color: '#F0F4FF',
    active: true,
  },
  {
    id: 'confra',
    icon_name: 'Users',
    title: 'Confraternização',
    desc: 'Reúna a equipe ou os amigos. Buffet farto e estrutura completa.',
    tag: 'Corporativo & social',
    event_type: 'Confraternização',
    buffet: 'buffet_food',
    color: '#F0FFF4',
    active: true,
  },
  {
    id: 'fechado',
    icon_name: 'Star',
    title: 'Evento exclusivo',
    desc: 'Salão reservado só para você. Total privacidade e atenção.',
    tag: 'Reserva exclusiva',
    event_type: 'Outro',
    buffet: 'alacarte',
    color: '#FDF7F2',
    active: true,
  },
];

export const BUFFETS: BuffetOption[] = [
  {
    value: 'alacarte',
    label: 'À la carte',
    desc: 'Cardápio normal · pagamento na saída',
  },
  {
    value: 'buffet_food',
    label: 'Buffet de comidas',
    desc: 'Pizzas pré-definidas + bebidas à parte · 30% entrada + 70% saída',
  },
  {
    value: 'buffet_full',
    label: 'Buffet completo',
    desc: 'Comidas e bebidas pré-definidas · 50% entrada + 50% saída',
  },
];

export const EVENT_TYPES = [
  'Aniversário',
  'Bodas',
  'Mini casamento',
  'Confraternização',
  'Evento corporativo',
  'Outro',
];


