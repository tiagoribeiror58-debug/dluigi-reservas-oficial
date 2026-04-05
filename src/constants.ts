import { Package, BuffetOption } from './types';

export const PACKAGES: Package[] = [
  {
    id: 'aniversario',
    iconName: 'Cake',
    title: 'Aniversário em família',
    desc: 'Pizza, bolo, espaço kids e muito afeto. O lugar certo para celebrar.',
    tag: 'Até 100 pessoas',
    eventType: 'Aniversário',
    buffet: 'buffet_full',
    color: '#FFF0EE',
  },
  {
    id: 'bodas',
    iconName: 'HeartHandshake',
    title: 'Bodas & Mini casamento',
    desc: 'Um ambiente acolhedor para os momentos mais especiais da vida a dois.',
    tag: 'Ambiente íntimo',
    eventType: 'Mini casamento',
    buffet: 'buffet_full',
    color: '#F0F4FF',
  },
  {
    id: 'confra',
    iconName: 'Users',
    title: 'Confraternização',
    desc: 'Reúna a equipe ou os amigos. Buffet farto e estrutura completa.',
    tag: 'Corporativo & social',
    eventType: 'Confraternização',
    buffet: 'buffet_food',
    color: '#F0FFF4',
  },
  {
    id: 'fechado',
    iconName: 'Star',
    title: 'Evento exclusivo',
    desc: 'Salão reservado só para você. Total privacidade e atenção.',
    tag: 'Reserva exclusiva',
    eventType: 'Outro',
    buffet: 'alacarte',
    color: '#FDF7F2',
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


