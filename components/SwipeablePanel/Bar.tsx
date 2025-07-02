import * as React from 'react';
import { StyleSheet, View } from 'react-native';

type BarProps = {
    barStyle?: object;
    barContainerStyle?: object;
};

export const Bar = ({ barStyle, barContainerStyle }: BarProps) => {
    return (
        <View style={[BarStyles.barContainer, barContainerStyle]}>
            <View style={[BarStyles.bar, barStyle]} />
        </View>
    );
};

const BarStyles = StyleSheet.create({
    barContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bar: {
        width: '15%',
        height: 6,
        borderRadius: 5,
        marginTop: 15,
        marginBottom: 10,
        backgroundColor: '#D9D9D9',
    },
});