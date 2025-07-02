import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

export const CoinBox = ({ coinCount }: { coinCount: string }) => (
    <View style={styles.valueContainer}>
        <View style={styles.CoinBoxContainer}>
            <Image source={require("../../assets/coinbook.png")} style={{ width: 20, height: 20 }} />
        </View>
        <Text style={styles.CoinBoxText}>
            {coinCount}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    valueContainer: {
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 5,
        paddingLeft: 4,
        paddingRight: 10,
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderColor: "#EEE",
    },
    CoinBoxContainer: {
        padding: 4,
        borderRadius: 30,
        backgroundColor: "#DEE1FF",
    },

    CoinBoxText: {
        color: "#633CEF",
        fontFamily: "Nunito",
        fontStyle: "normal",
        fontWeight: "700",
        fontSize: 17,
        marginLeft: 5,
    },
});
