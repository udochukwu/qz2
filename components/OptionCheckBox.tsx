import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const OptionCheckBox = ({ text, selected, onPress }: { text: string, selected: boolean, onPress: () => void }) => {
    return (
        <TouchableOpacity
            style={{ ...styles.optionContainer, backgroundColor: selected ? "#6D56FA1A" : "#fff", borderColor: selected ? "#6D56FA" : "#CECECE", borderWidth: 2 }}
            onPress={onPress}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>

                <Text style={{
                    ...styles.optionText, color: selected ? "#6D56FA" : "#3D3D3D"
                }}>{text}</Text>
                <View style={{ width: 20, height: 20, borderRadius: 5, marginRight: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: selected ? "#6D56FA" : "#BABABA", padding: 2 }}>
                    {selected &&

                        <Svg fill="none">
                            <Path d="M2.2344 5.6157L4.71016 8.52612L9.41266 3.47266" stroke="#6D56FA" strokeWidth="1.3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    }


                </View>
            </View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    optionContainer: {
        width: "100%",
        backgroundColor: "#F2F2F2",
        borderRadius: 15,
        padding: 10,
        height: 65,
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

export default OptionCheckBox;
