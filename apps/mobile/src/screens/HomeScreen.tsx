import React from 'react';
import { ScrollView, SafeAreaView, View } from 'react-native';
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

export const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HomeHeader />
        <Greeting
          title="Seja"
          highlight="Bem-vindo!"
          subtitle="Sexta, 2 de Fevereiro"
        />
        <SearchBar />
        <CategoryRow categories={categories} />
        <Banner
          titleLines={['Agende', 'nos melhores']}
          subtitle="com Flash Barber"
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

        <Footer brand="Flash Barber" />
      </ScrollView>
    </SafeAreaView>
  );
};
