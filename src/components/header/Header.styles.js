import { StyleSheet } from 'react-native';
import { COLORS } from '../../styles/globalStyles';

export const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 65,
  },
  leftIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  rightContentContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logo: {
    width: 47,
    height: 65,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
});