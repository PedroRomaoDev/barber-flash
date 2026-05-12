import React, { useState } from 'react';
import { ScrollView, SafeAreaView, View, StyleSheet } from 'react-native';
import { assets } from './home/assets';
import { categories, popularItems, recommendedItems } from './home/data';
import { styles } from './home/homeStyles';
import {
  Banner,
  BarberRow,
  CategoryRow,
  Footer,
  Greeting,
  HomeHeader,
  ScheduleCard,
  SearchBar,
  SectionTitle,
} from './home/components';
import { MenuScreen } from './MenuScreen';

export const HomeScreen: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HomeHeader onMenuPress={() => setMenuOpen(true)} />
        <Greeting
          title="Olá,"
          highlight="Miguel!"
          subtitle="Sexta, 2 de Fevereiro"
        />
        <SearchBar />
        <CategoryRow categories={categories} />
        <Banner
          titleLines={['Agende', 'nos melhores']}
          subtitle="com FSW Barber"
        />

        <View style={styles.section}>
          <SectionTitle text="AGENDAMENTOS" />
          <ScheduleCard
            status="Confirmado"
            service="Corte de Cabelo"
            barberName="Vintage Barber"
            avatar={assets.scheduleAvatar}
            month="Fevereiro"
            day="06"
            time="09:45"
          />
        </View>

        <View style={styles.section}>
          <SectionTitle text="RECOMENDADOS" />
          <BarberRow items={recommendedItems} prefix="rec" />
        </View>

        <View style={styles.section}>
          <SectionTitle text="POPULARES" />
          <BarberRow items={popularItems} prefix="pop" />
        </View>

        <Footer brand="FSW Barber" />
      </ScrollView>
      {menuOpen && (
        <View style={[StyleSheet.absoluteFillObject, { zIndex: 10 }]}>
          <MenuScreen onClose={() => setMenuOpen(false)} />
        </View>
      )}
    </SafeAreaView>
  );
};
