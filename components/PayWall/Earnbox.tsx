// EarnBox.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CoinBox } from './CoinBox';

export const EarnBox = ({ title, coinCount }: { title: string, coinCount: string }) => (
    <View style={styles.earnContainer}>
        <Text style={styles.earnTitle}>
            {title}
        </Text>
        <CoinBox coinCount={coinCount} />
    </View>
);

const styles = StyleSheet.create({
    earnContainer: {
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: 35,
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "space-between",
    },
    earnTitle: {
        color: "#2F2F2F",
        fontFamily: "Nunito",
        fontStyle: "normal",
        fontWeight: "700",
        fontSize: 26,
        lineHeight: 29,
    },
});
