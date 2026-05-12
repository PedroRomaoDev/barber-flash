import { menuAssets } from './assets';

export type MenuItem = {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
};

export const primaryItems: MenuItem[] = [
  { id: 'home', label: 'Ínicio', icon: menuAssets.iconHome, active: true },
  { id: 'bookings', label: 'Agendamentos', icon: menuAssets.iconCalendar },
];

export const serviceItems: MenuItem[] = [
  { id: 'hair', label: 'Cabelo', icon: menuAssets.iconScissors },
  { id: 'beard', label: 'Barba', icon: menuAssets.iconMustache },
  { id: 'finish', label: 'Acabamento', icon: menuAssets.iconRazor },
  { id: 'eyebrow', label: 'Sobrancelha', icon: menuAssets.iconEyebrow },
  { id: 'massage', label: 'Massagem', icon: menuAssets.iconTowel },
  { id: 'hydrate', label: 'Hidratação', icon: menuAssets.iconShampoo },
];
