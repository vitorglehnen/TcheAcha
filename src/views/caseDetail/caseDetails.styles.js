import { StyleSheet } from 'react-native';
import { COLORS } from '../../styles/globalStyles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 50,
    bottom: 15,
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  caseCard: {
    backgroundColor: COLORS.white,
    margin: 15,
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  caseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  caseDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  caseImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  announcementDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  detailText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    marginBottom: 4,
  },
  detailLabel: { 
    fontWeight: 'bold',
  },
  timelineContainer: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  timelineSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  timelineItem: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    flex: 1,
    marginHorizontal: 5,
  },
  timelineDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  timelineContent: {
    paddingLeft: 34, 
    marginTop: 8,
  },
  timelineDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
});