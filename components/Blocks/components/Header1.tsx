import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type HeaderProps = {
    header_text: string,
    font_size?: number,
    header_image?: string | null,
    font_weight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'normal' | 'bold',
    color?: string,
    style?: any
};

function Header({ header_text, font_size = 13, header_image, font_weight = '600', color, style }: HeaderProps) {
    return (
        <View style={{ ...styles.labelType, ...style }}>
            {header_image && <Image source={{ uri: header_image }} style={{ width: 20, height: 20, marginRight: 10 }} />}
            <Text style={[styles.questionType, {
                fontSize: font_size, fontWeight: font_weight, color: color ? color : '#6D6D6D',
            }]}>{header_text}</Text>
        </View >
    )
}

const styles = StyleSheet.create({
    labelType: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 7,
    },
    questionType: {
        fontFamily: 'Inter',
        fontStyle: 'normal',
    },
})

export default Header;
