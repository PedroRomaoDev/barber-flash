import { assets } from './assets';

export type CategoryItem = {
  id: string;
  label: string;
  icon?: string;
};

export type BarberItem = {
  id: string;
  name: string;
  address: string;
  image: string;
};

export const categories: CategoryItem[] = [
  { id: 'cabelo', label: 'Cabelo', icon: assets.categoryScissors },
  { id: 'barba', label: 'Barba', icon: assets.categoryMustache },
  { id: 'acabamento', label: 'Acabamento', icon: assets.categoryRazor },
  { id: 'sombrancelha', label: 'Sombrancelha' },
];

export const recommendedItems: BarberItem[] = [
  {
    id: '1',
    name: 'Vintage Barber',
    address: 'Avenida São Sebastião, 357, São Paulo',
    image: assets.barberOne,
  },
  {
    id: '2',
    name: 'Clássica Cortez',
    address: 'Rua Castro Alves, 331, Sao Paulo',
    image: assets.barberTwo,
  },
  {
    id: '3',
    name: 'Los Barberos',
    address: 'Rua Sete de Setembro, 428, São Paulo',
    image: assets.barberThree,
  },
  {
    id: '4',
    name: 'Homem Elegante',
    address: 'Rua Projetada, 529, São Paulo',
    image: assets.barberFour,
  },
];

export const popularItems: BarberItem[] = [
  recommendedItems[2],
  recommendedItems[3],
  recommendedItems[0],
  recommendedItems[1],
];
