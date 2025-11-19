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
    padding: 15,
    paddingBottom: 50,
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
    elevation: 2,
  },
  imagePreviewContainer: {
    marginVertical: 15,
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 8,
    elevation: 1,
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  imagePreview: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    resizeMode: "contain",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  actionButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 40,
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
    marginLeft: 10,
  },
  rejectButton: {
    backgroundColor: "#e74c3c",
    marginRight: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "80%",
    resizeMode: "contain",
  },
  closeModalButton: {
    position: "absolute",
    top: 50,
    right: 20,
    padding: 10,
  },
});

export default styles;
