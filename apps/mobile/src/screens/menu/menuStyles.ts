import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlayPressable: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 21, 24, 0.5)',
  },
  container: {
    marginLeft: 40,
    backgroundColor: '#141518',
    paddingVertical: 24,
    minHeight: '100%',
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Nunito_700Bold',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonSquare: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#8162FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  loginRow: {
    marginTop: 24,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loginText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Nunito_700Bold',
  },
  divider: {
    marginTop: 24,
    height: 1,
    backgroundColor: '#26272B',
  },
  menuGroup: {
    marginTop: 24,
    paddingHorizontal: 20,
    gap: 4,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 82,
  },
  menuButtonActive: {
    backgroundColor: '#8162FF',
  },
  menuIcon: {
    width: 16,
    height: 16,
  },
  menuLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Nunito_400Regular',
  },
  loginIconWrap: {
    width: 20,
    height: 20,
  },
  loginArrowOuter: {
    position: 'absolute',
    top: '12.5%',
    left: '62.5%',
    right: '12.5%',
    bottom: '12.5%',
  },
  loginArrowInner: {
    position: 'absolute',
    top: '29.17%',
    left: '41.67%',
    right: '37.5%',
    bottom: '29.17%',
  },
  loginArrowStem: {
    position: 'absolute',
    top: '50%',
    left: '12.5%',
    right: '37.5%',
    bottom: '50%',
  },
  closeLineOne: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    right: '25%',
    bottom: '25%',
  },
  closeLineTwo: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    right: '25%',
    bottom: '25%',
  },
});
