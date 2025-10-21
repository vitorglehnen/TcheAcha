import { StyleSheet } from 'react-native';
import { COLORS } from '../../styles/globalStyles';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Cabeçalho com o menu
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuIcon: {
    padding: 5, // Aumenta a área de toque
  },
  logo: {
    width: 65,
    height: 65,
  },
  // Conteúdo principal que rola
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, // Espaço extra para a NavBar
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    lineHeight: 20,
    marginBottom: 20,
  },
  // Botão do Mapa
  mapButton: {
    backgroundColor: '#4DD0E1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#26C6DA',
  },
  mapButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  mapButtonTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A233D',
    marginLeft: 12,
  },
  mapButtonDescription: {
    fontSize: 12,
    color: '#1A233D',
    lineHeight: 18,
    marginTop: 4,
  },
  // Card de caso
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardHeader: {
    backgroundColor: COLORS.primary,
    padding: 8,
  },
  cardHeaderText: {
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardBody: {
    flexDirection: 'row',
    padding: 12,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  detailText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    marginBottom: 4,
  },
  detailLabel: {
    fontWeight: 'bold',
  },
  detailsButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export const modalStyles = {
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  close: {
    fontSize: 18,
    opacity: 0.6,
    paddingHorizontal: 4,
  },
  message: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#222',
  },
  row: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  secondary: {
    borderWidth: 1,
    borderColor: '#c7c7c7',
  },
  secondaryText: {
    fontWeight: '600',
  },
  primary: {
    backgroundColor: '#0f74c8',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },
};