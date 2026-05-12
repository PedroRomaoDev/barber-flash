import React from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

const assets = {
  scissor:
    'https://www.figma.com/api/mcp/asset/48d5a070-6656-4db2-a396-74b116b784a1',
  logoText:
    'https://www.figma.com/api/mcp/asset/2c13e0a7-81c7-494b-a2fa-66ab96cb3c40',
  searchLens:
    'https://www.figma.com/api/mcp/asset/3f6a56ab-8e24-4310-a978-a9a2c062f9bc',
  searchHandle:
    'https://www.figma.com/api/mcp/asset/f626f7a8-e380-4bf3-919a-35ce9c47d9af',
  categoryScissors:
    'https://www.figma.com/api/mcp/asset/7cc7268b-6903-4994-9f21-4b412846d225',
  categoryMustache:
    'https://www.figma.com/api/mcp/asset/99e51f5c-fbe3-4c58-8577-e635b0e4b45e',
  categoryRazor:
    'https://www.figma.com/api/mcp/asset/0dbcadb2-3d73-4bd3-8811-8a42b334a09e',
  bannerBackground:
    'https://www.figma.com/api/mcp/asset/2495f440-114f-44a3-8e97-b128cc50db23',
  bannerWindow:
    'https://www.figma.com/api/mcp/asset/a638e653-27a0-4643-9144-f935bf7790f7',
  bannerStars:
    'https://www.figma.com/api/mcp/asset/60a4c9fc-89d1-4338-bfbe-0dd8fa22ddaa',
  bannerCharacterTwo:
    'https://www.figma.com/api/mcp/asset/b9e66f08-52de-499e-a437-4e6dd26024ec',
  bannerCharacterOne:
    'https://www.figma.com/api/mcp/asset/c501a2d0-9268-4f69-b59b-c20f31781bc3',
  bannerTable:
    'https://www.figma.com/api/mcp/asset/bb5b607c-70f4-496e-aee0-cc8fdedbfafb',
  bannerMirror:
    'https://www.figma.com/api/mcp/asset/36bef8bd-03a5-48e5-8f3d-9278fbe45e8c',
  scheduleAvatar:
    'https://www.figma.com/api/mcp/asset/cdfdae8b-3539-460d-bad2-18d128a94617',
  star: 'https://www.figma.com/api/mcp/asset/953abe0f-4667-487f-a247-c56603dd26cc',
  barberOne:
    'https://www.figma.com/api/mcp/asset/4f4ea8ac-cb2e-46c2-9005-ad36962c2e38',
  barberTwo:
    'https://www.figma.com/api/mcp/asset/a9a83df7-7e60-4f73-a869-07eed06b05a5',
  barberThree:
    'https://www.figma.com/api/mcp/asset/b4ab0cfe-10a5-4f66-abf1-d1e6893d4102',
  barberFour:
    'https://www.figma.com/api/mcp/asset/79623260-c21c-46fc-ab5b-84fbd170ca62',
};

const categories = [
  { id: 'cabelo', label: 'Cabelo', icon: assets.categoryScissors },
  { id: 'barba', label: 'Barba', icon: assets.categoryMustache },
  { id: 'acabamento', label: 'Acabamento', icon: assets.categoryRazor },
  { id: 'sombrancelha', label: 'Sombrancelha' },
];

const recommendedItems = [
  {
    id: '1',
    name: 'Vintage Barber',
    address: 'Avenida São Sebastião, 357, São Paulo',
    image: assets.barberOne,
  },
  {
    id: '2',
    name: 'Clássica Cortez',
    address: 'Rua Castro Alves, 331, São Paulo',
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

const popularItems = [
  recommendedItems[2],
  recommendedItems[3],
  recommendedItems[0],
  recommendedItems[1],
];

const SectionTitle = ({ text }: { text: string }) => (
  <Text style={styles.sectionTitle}>{text}</Text>
);

const SearchIcon = () => (
  <View style={styles.searchIconBox}>
    <Image source={{ uri: assets.searchLens }} style={styles.searchLens} />
    <Image source={{ uri: assets.searchHandle }} style={styles.searchHandle} />
  </View>
);

const BarberCard = ({
  name,
  address,
  image,
}: {
  name: string;
  address: string;
  image: string;
}) => (
  <View style={styles.barberCard}>
    <View style={styles.barberImageWrapper}>
      <Image source={{ uri: image }} style={styles.barberImage} />
      <View style={styles.ratingBadge}>
        <Image source={{ uri: assets.star }} style={styles.ratingStar} />
        <Text style={styles.ratingText}>5,0</Text>
      </View>
    </View>
    <View style={styles.barberInfo}>
      <View style={styles.barberTextBlock}>
        <Text style={styles.barberName} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.barberAddress} numberOfLines={2}>
          {address}
        </Text>
      </View>
      <TouchableOpacity style={styles.reserveButton} activeOpacity={0.85}>
        <Text style={styles.reserveButtonText}>Reservar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const BannerArt = () => (
  <View style={styles.bannerArt}>
    <Image
      source={{ uri: assets.bannerBackground }}
      style={styles.bannerBackground}
    />
    <Image source={{ uri: assets.bannerWindow }} style={styles.bannerWindow} />
    <Image source={{ uri: assets.bannerStars }} style={styles.bannerStars} />
    <Image
      source={{ uri: assets.bannerCharacterTwo }}
      style={styles.bannerCharacterTwo}
    />
    <Image
      source={{ uri: assets.bannerCharacterOne }}
      style={styles.bannerCharacterOne}
    />
    <Image source={{ uri: assets.bannerTable }} style={styles.bannerTable} />
    <Image source={{ uri: assets.bannerMirror }} style={styles.bannerMirror} />
  </View>
);

export const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.logo}>
              <Image
                source={{ uri: assets.scissor }}
                style={styles.logoScissor}
              />
              <Image
                source={{ uri: assets.logoText }}
                style={styles.logoText}
                resizeMode="contain"
              />
            </View>
            <View style={styles.menuButton}>
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
            </View>
          </View>
          <View style={styles.divider} />
        </View>

        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>
            Olá, <Text style={styles.greetingName}>Miguel!</Text>
          </Text>
          <Text style={styles.greetingSubtitle}>Sexta, 2 de Fevereiro</Text>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
            <TextInput
              placeholder="Buscar"
              placeholderTextColor="#838896"
              style={styles.searchInput}
            />
          </View>
          <View style={styles.searchButton}>
            <SearchIcon />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {categories.map((category) => (
            <View key={category.id} style={styles.categoryChip}>
              {category.icon && (
                <Image
                  source={{ uri: category.icon }}
                  style={styles.categoryIcon}
                />
              )}
              <Text style={styles.categoryText}>{category.label}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Agende</Text>
            <Text style={styles.bannerTitle}>nos melhores</Text>
            <Text style={styles.bannerSubtitle}>com FSW Barber</Text>
          </View>
          <BannerArt />
        </View>

        <View style={styles.section}>
          <SectionTitle text="AGENDAMENTOS" />
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleInfo}>
              <View style={styles.statusPill}>
                <Text style={styles.statusText}>Confirmado</Text>
              </View>
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleTitle}>Corte de Cabelo</Text>
                <View style={styles.scheduleBarber}>
                  <Image
                    source={{ uri: assets.scheduleAvatar }}
                    style={styles.scheduleAvatar}
                  />
                  <Text style={styles.scheduleBarberName}>Vintage Barber</Text>
                </View>
              </View>
            </View>
            <View style={styles.scheduleDate}>
              <Text style={styles.scheduleMonth}>Fevereiro</Text>
              <Text style={styles.scheduleDay}>06</Text>
              <Text style={styles.scheduleTime}>09:45</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle text="RECOMENDADOS" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsRow}
          >
            {recommendedItems.map((item) => (
              <BarberCard
                key={`rec-${item.id}`}
                name={item.name}
                address={item.address}
                image={item.image}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <SectionTitle text="POPULARES" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsRow}
          >
            {popularItems.map((item, index) => (
              <BarberCard
                key={`pop-${index}`}
                name={item.name}
                address={item.address}
                image={item.image}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2026 Copyright{' '}
            <Text style={styles.footerTextBold}>FSW Barber</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141518',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: '#141518',
  },
  headerRow: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 22,
  },
  logoScissor: {
    width: 22,
    height: 22,
    marginRight: 6,
  },
  logoText: {
    width: 95,
    height: 18,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#141518',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  menuLine: {
    width: 16,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#26272B',
  },
  greeting: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
    gap: 4,
  },
  greetingTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Nunito_400Regular',
    lineHeight: 24,
  },
  greetingName: {
    fontFamily: 'Nunito_700Bold',
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    fontFamily: 'Nunito_400Regular',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  searchInputWrapper: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#26272B',
    backgroundColor: '#1A1B1F',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  searchInput: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    paddingVertical: 0,
  },
  searchButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#8162FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIconBox: {
    width: 20,
    height: 20,
  },
  searchLens: {
    position: 'absolute',
    top: '12.5%',
    left: '12.5%',
    right: '20.83%',
    bottom: '20.83%',
  },
  searchHandle: {
    position: 'absolute',
    top: '69.58%',
    left: '69.58%',
    right: '12.5%',
    bottom: '12.5%',
  },
  categoryRow: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#26272B',
    backgroundColor: '#1A1B1F',
    gap: 10,
  },
  categoryIcon: {
    width: 16,
    height: 16,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  banner: {
    marginTop: 24,
    marginHorizontal: 20,
    height: 150,
    borderRadius: 10,
    backgroundColor: '#221C3D',
    overflow: 'hidden',
  },
  bannerContent: {
    position: 'absolute',
    left: 27,
    top: 41,
  },
  bannerTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    fontFamily: 'Nunito_700Bold',
    lineHeight: 26,
  },
  bannerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Nunito_300Light',
  },
  bannerArt: {
    position: 'absolute',
    left: 165,
    top: -44,
    width: 240,
    height: 240,
  },
  bannerBackground: {
    position: 'absolute',
    left: '10.11%',
    right: '9.22%',
    top: '10.11%',
    bottom: '14.71%',
  },
  bannerWindow: {
    position: 'absolute',
    left: '9.24%',
    right: '9.81%',
    top: '8.78%',
    bottom: '37.42%',
  },
  bannerStars: {
    position: 'absolute',
    left: '47.64%',
    right: '15.45%',
    top: '17.02%',
    bottom: '39.35%',
  },
  bannerCharacterTwo: {
    position: 'absolute',
    left: '18.46%',
    right: '25.74%',
    top: '15.69%',
    bottom: '26.26%',
  },
  bannerCharacterOne: {
    position: 'absolute',
    left: '23.38%',
    right: '20.32%',
    top: '27.94%',
    bottom: '15.42%',
  },
  bannerTable: {
    position: 'absolute',
    left: '13.03%',
    right: '13.43%',
    top: '84.57%',
    bottom: '15.43%',
  },
  bannerMirror: {
    position: 'absolute',
    left: '46.64%',
    right: '12.93%',
    top: '65.74%',
    bottom: '8.79%',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 12,
  },
  sectionTitle: {
    color: '#838896',
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  scheduleCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#26272B',
    backgroundColor: '#1A1B1F',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scheduleInfo: {
    flex: 1,
    padding: 12,
    gap: 12,
  },
  statusPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#221C3D',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
  },
  statusText: {
    color: '#8162FF',
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  scheduleDetails: {
    gap: 8,
  },
  scheduleTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  scheduleBarber: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  scheduleBarberName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  scheduleDate: {
    width: 106,
    borderLeftWidth: 1,
    borderLeftColor: '#26272B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  scheduleMonth: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  scheduleDay: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 28,
  },
  scheduleTime: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  cardsRow: {
    gap: 16,
    paddingRight: 20,
  },
  barberCard: {
    width: 167,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#26272B',
    backgroundColor: '#1A1B1F',
    overflow: 'hidden',
  },
  barberImageWrapper: {
    paddingTop: 4,
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  barberImage: {
    width: 159,
    height: 159,
    borderRadius: 16,
  },
  ratingBadge: {
    position: 'absolute',
    left: 8,
    top: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(34, 28, 61, 0.7)',
    gap: 4,
  },
  ratingStar: {
    width: 12,
    height: 12,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  barberInfo: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 12,
  },
  barberTextBlock: {
    gap: 4,
  },
  barberName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  barberAddress: {
    color: '#838896',
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 16,
  },
  reserveButton: {
    borderRadius: 10,
    backgroundColor: '#26272B',
    alignItems: 'center',
    paddingVertical: 8,
  },
  reserveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  footer: {
    marginTop: 48,
    backgroundColor: '#1A1B1F',
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#838896',
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
  },
  footerTextBold: {
    fontFamily: 'Nunito_700Bold',
    color: '#838896',
  },
});
