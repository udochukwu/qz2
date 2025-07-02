import { StyleSheet } from "react-native";



export const blockstyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
    },
    card: {
        width: '100%',
        shadowColor: 'rgba(20, 21, 27, 0.02)',
        shadowOffset: {
            width: 0,
            height: 8
        },
        shadowOpacity: 0.02,
        shadowRadius: 20,
        elevation: 5,
        borderRadius: 15,
        padding: 20,
        backgroundColor: 'white',
    },
    resourceCard: {
        justifyContent: 'center',
        backgroundColor: '#fff',
        alignItems: 'center',
        shadowColor: 'rgba(20, 21, 27, 0.02)',
        shadowOffset: {
            width: 0,
            height: 8
        },
        shadowOpacity: 0.02,
        shadowRadius: 20,
        elevation: 5,
        borderRadius: 15,
        width: '100%',
        padding: 20,
        flexDirection: 'column',
        overflow: 'hidden',
    }
})