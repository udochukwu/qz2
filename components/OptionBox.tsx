import React from 'react';
import { View } from 'react-native';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
const OptionBox = ({ text, selected, onPress }: { text: string, selected: boolean, onPress: () => void }) => {



    return (
        <TouchableOpacity
            style={{ ...styles.optionContainer, backgroundColor: selected ? "#6D56FA1A" : "#fff", borderColor: selected ? "#6D56FA" : "#CECECE", borderWidth: 2 }}
            onPress={onPress}>
            <Text style={{
                ...styles.optionText, color: selected ? "#6D56FA" : "#3D3D3D"
            }}>{text}</Text>
        </TouchableOpacity>
    );
}



const styles = StyleSheet.create({
    optionContainer: {
        width: "100%",
        backgroundColor: "#F2F2F2",
        borderRadius: 15,
        padding: 10,
        paddingVertical: 19,
        marginBottom: 10,
        justifyContent: "center",
    },

    optionText: {
        fontFamily: 'Nunito',
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 19,
        color: '#000000',
    },
})

export default OptionBox;