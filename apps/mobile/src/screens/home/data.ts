import { assets } from './assets';

export type CategoryItem = {
  id: string;
  label: string;
  icon?: string | number | any;
};

export type BarberItem = {
  id: string;
  name: string;
  address: string;
  imageUrl: string | number | any;
  rating?: number;
  reviewCount?: number;
};

export const mockSchedule = {
  status: "Confirmado",
  service: "Corte de Cabelo",
  barberName: "Vintage Barber",
  avatar: null, // Will use placeholder
  month: "Fevereiro",
  day: "06",
  time: "09:45"
};

export const categories: CategoryItem[] = [
];

export const recommendedItems: BarberItem[] = [
  {
    id: '1',
    name: 'Vintage Barber',
    address: 'Avenida São Sebastião, 357, São Paulo',
    imageUrl: assets.barberOne,
  },
  {
    id: '2',
    name: 'Clássica Cortez',
    address: 'Rua Castro Alves, 331, Sao Paulo',
    imageUrl: assets.barberTwo,
  },
  {
    id: '3',
    name: 'Los Barberos',
    address: 'Rua Sete de Setembro, 428, São Paulo',
    imageUrl: assets.barberThree,
  },
  {
    id: '4',
    name: 'Homem Elegante',
    address: 'Rua Projetada, 529, São Paulo',
    imageUrl: assets.barberFour,
  },
];

export const popularItems: BarberItem[] = [
  recommendedItems[2],
  recommendedItems[3],
  recommendedItems[0],
  recommendedItems[1],
];
