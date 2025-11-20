import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../../styles/globalStyles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  // Contêiner para o pino fixo no centro
  markerFixed: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    // Ajusta o pino para que a "ponta" dele fique no centro
    marginLeft: -12, // Metade da largura do ícone (para Ionicons size 24)
    marginTop: -24,  // Metade da altura do ícone
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Botão "Confirmar" na parte inferior
  confirmButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 30, // Espaço seguro no iOS
    left: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Botão "Minha Localização" no canto
  myLocationButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    right: 20,
    backgroundColor: COLORS.white,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  // Estilos para a tela de aviso na Web
  webPlaceholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
  },
  webPlaceholderText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
});