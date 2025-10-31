import { StyleSheet } from 'react-native';
import { COLORS } from '../../styles/globalStyles';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginTop: 20,
    marginHorizontal: 15,
  },
  sightingCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 15,
  },
  sightingCaseTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  sightingDesc: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  sightingImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  sightingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  approveButton: {
    backgroundColor: '#28a745',
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: '#e74c3c',
    marginLeft: 5,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  caseCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 15,
  },
  caseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  caseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    flex: 1,
  },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusActive: {
    backgroundColor: '#28a745',
  },
  statusInactive: {
    backgroundColor: COLORS.textSecondary,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  caseActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  caseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  caseButtonText: {
    color: COLORS.textPrimary,
    marginLeft: 6,
    fontSize: 14,
  },
});