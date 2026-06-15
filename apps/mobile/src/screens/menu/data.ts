export type MenuItem = {
  id: string;
  label: string;
  icon: string | number;
  active?: boolean;
};

export const primaryItems: MenuItem[] = [
  { id: 'home', label: 'Início', icon: 'home', active: true },
  { id: 'my-appointments', label: 'Agendamentos', icon: 'calendar' },
];

export const serviceItems: MenuItem[] = [
  { id: 'hair', label: 'Cabelo', icon: 'scissors-cutting' },
  { id: 'beard', label: 'Barba', icon: 'mustache' },
  { id: 'finish', label: 'Acabamento', icon: 'razor-double-edge' },
  { id: 'eyebrow', label: 'Sobrancelha', icon: 'eye-outline' },
  { id: 'massage', label: 'Massagem', icon: 'spa' },
  { id: 'hydrate', label: 'Hidratação', icon: 'water' },
];
