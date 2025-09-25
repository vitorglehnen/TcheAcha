import { StyleSheet } from 'react-native';
import { COLORS } from '../styles/globalStyles';

export const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    marginHorizontal: 20,
    paddingVertical: 12,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navButton: {
    paddingHorizontal: 20, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusButton: {
    backgroundColor: COLORS.white,
    width: 60,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
      color: COLORS.textPrimary,
  },
  plusIcon: {
      color: COLORS.primary,
  }
});