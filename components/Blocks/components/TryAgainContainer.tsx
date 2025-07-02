import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";


function TryAgainContainer({ text, onClick }: { text: string, onClick: () => void }) {

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onClick} style={styles.pressable}>
                <Image source={require('../../../assets/alert2.png')} style={styles.image} />
                <Text style={styles.text}>{text}</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        with: '100%',
        backgroundColor: "#FFEBEB",

    },
    pressable: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'flex-start',
    },
    text: {
        color: '#FF9B9B',
        fontSize: 12,
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: '600',
    },
    image: {
        width: 15,
        height: 15,
        tintColor: '#FF9B9B',
        marginRight: 5,
    }
})


export default TryAgainContainer;