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
  auxilieButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  auxilieButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

