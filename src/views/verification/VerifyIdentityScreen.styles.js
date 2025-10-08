import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    backBtn: {
        padding: 5,
    },
    content: {
        padding: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardLeft: {
        marginRight: 15,
    },
    cardBody: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A233D',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#6c757d',
        marginTop: 2,
    },
    cardRight: {
        marginLeft: 15,
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#CED4DA',
    },
    primaryBtn: {
        backgroundColor: '#007BFF',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    primaryBtnDisabled: {
        backgroundColor: '#A0C7FF',
    },
    primaryText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    hint: {
        fontSize: 12,
        color: '#6c757d',
        textAlign: 'center',
        marginTop: 20,
        lineHeight: 18,
    },
});
