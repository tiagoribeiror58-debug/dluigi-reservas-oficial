export const WHATSAPP_NUMBER = "5541995468465";
export const WHATSAPP_MESSAGE_DEFAULT = "Olá! Vi o catálogo de acessórios e gostaria de saber mais.";
export const COMPANY_NAME = "JVC Carretas";

export const EVENT_TYPES = [
  'Aniversário',
  'Confraternização',
  'Casamento',
  'Festa Corporativa',
  'Outros'
];

export const BUFFETS = [
  { value: 'Rodízio Tradicional', label: 'Rodízio Tradicional', description: 'O clássico com todas as nossas pizzas', price: 'R$ 79,90/pessoa' },
  { value: 'Rodízio Premium', label: 'Rodízio Premium', description: 'Pizzas especiais e entradas', price: 'R$ 99,90/pessoa' },
  { value: 'Sem Buffet (A La Carte)', label: 'Sem Buffet (A La Carte)', description: 'O cliente pede no local' }
];

export const PACKAGES = [
  {
    id: 'fallback-1',
    title: 'Aniversário Clássico',
    description: 'Pacote padrão para aniversários com amigos e família',
    event_type: 'Aniversário',
    buffet: 'Rodízio Tradicional',
    min_guests: 10,
    price: 79.9,
    active: true,
    visible_fields: ['guests', 'date', 'time', 'eventType', 'birthday', 'buffet', 'notes']
  }
];
