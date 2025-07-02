import { Platform, StyleSheet, View } from "react-native"
import GestureRecognizer from "react-native-swipe-gestures"



function BarWithGesture({ onSwipeDown }: { onSwipeDown: () => void }) {


    if (Platform.OS === 'ios') {
        return (
            <View style={{ width: "100%", justifyContent: "center", alignItems: "center", alignContent: 'center' }} >
                <View style={styles.bar} />
            </View>
        )
    }


    return (
        <GestureRecognizer onSwipeDown={() => onSwipeDown()} style={{ width: "100%", justifyContent: "center", alignItems: "center", alignContent: 'center' }}>
            <View style={styles.bar} />
        </GestureRecognizer>)
}



const styles = StyleSheet.create({
    bar: {
        width: '12%',
        height: 4,
        borderRadius: 5,
        marginTop: 25,
        marginBottom: 15,
        backgroundColor: '#D1D1D1',

    }
})

export default BarWithGesture;