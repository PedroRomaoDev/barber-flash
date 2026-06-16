import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { BarbershopDetailsScreen } from '../screens/BarbershopDetailsScreen';
import { BookingScreen } from '../screens/BookingScreen';
import { RegisterBarbershopScreen } from '../screens/RegisterBarbershopScreen';
import { RegisterBarberScreen } from '../screens/RegisterBarberScreen';
import { MyAppointmentsScreen } from '../screens/MyAppointmentsScreen';
import { RegisterServiceScreen } from '../screens/RegisterServiceScreen';
import { BarberAppointmentsScreen } from '../screens/BarberAppointmentsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SearchScreen } from '../screens/SearchScreen';

export type RootStackParamList = {
  Home: undefined;
  BarbershopDetails: { id: string };
  Booking: { barbershopId: string; serviceId?: string; barberId?: string };
  RegisterBarbershop: undefined;
  RegisterBarber: undefined;
  MyAppointments: undefined;
  RegisterService: undefined;
  BarberAppointments: undefined;
  Profile: undefined;
  Search: { query: string };
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="BarbershopDetails"
        component={BarbershopDetailsScreen}
      />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen
        name="RegisterBarbershop"
        component={RegisterBarbershopScreen}
      />
      <Stack.Screen name="RegisterBarber" component={RegisterBarberScreen} />
      <Stack.Screen name="MyAppointments" component={MyAppointmentsScreen} />
      <Stack.Screen name="RegisterService" component={RegisterServiceScreen} />
      <Stack.Screen
        name="BarberAppointments"
        component={BarberAppointmentsScreen}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
    </Stack.Navigator>
  );
};
