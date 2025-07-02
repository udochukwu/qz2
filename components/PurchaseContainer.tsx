
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
function PurchaseContainer({ text, price, originalPrice, onClick, selected, ...rest }) {
    return (
        <Pressable style={[styles.container, selected ? { borderColor: '#6D56FA', backgroundColor: "rgba(109, 86, 250, 0.1)" } : { borderColor: '#CECECE' }]} onPress={onClick} {...rest}>
            <View style={styles.left}>
                <Text style={styles.text}>{text}</Text>

            </View>
            <View style={styles.right}>
                <Text style={styles.originalPrice}>{originalPrice}</Text>
                <Text style={styles.text}>{price}</Text>
            </View>
        </Pressable>
    );

}

const styles = StyleSheet.create({
    container: {
        width: '95%',
        height: "10%",
        borderRadius: 15,
        flexDirection: 'row',
        borderColor: '#CECECE',
        borderWidth: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    left: {
        width: '70%',
        height: '100%',
        justifyContent: 'center',
    },
    right: {
        width: '30%',
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        //space between the two texts 4% of the width

    },
    originalPrice: {
        fontSize: 12,
        color: '#E7A4A4',
        fontFamily: 'Nunito',
        //slash in the middle
        textDecorationLine: 'line-through',

    },
    text: {

        fontSize: 12,
        color: '#000',
        fontFamily: 'Nunito',
    }
})

export default PurchaseContainer;
