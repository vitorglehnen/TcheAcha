import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/globalStyles";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    textAlign: "center",
    color: COLORS.textSecondary,
    marginTop: 30,
    fontSize: 16,
  },
  listItem: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  itemSubText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  detailContainer: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginTop: 10,
    marginBottom: 10,
  },
  userInfo: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  imagePreviewContainer: {
    marginVertical: 10,
  },
  imageLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  imagePreview: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    backgroundColor: "#eee",
    resizeMode: "contain",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  actionButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingBottom: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  approveButton: {
    backgroundColor: "#28a745",
    marginRight: 10,
  },
  rejectButton: {
    backgroundColor: "#e74c3c",
    marginLeft: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default styles;
