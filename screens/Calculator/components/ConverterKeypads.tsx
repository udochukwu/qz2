
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { converterBtns } from "../constants";
import { hapticEffect } from "../../../services/common";

interface ConveterKeypadProps {
    onPress: (value: string, longPress: boolean) => void
    isOperating?: boolean
}

export default function ConverterKeypads ({onPress, isOperating = false}: ConveterKeypadProps){
    const { width , height} = useWindowDimensions();

    const basicBtnWidthHeight = {
        width: width * 0.2,
        height: height * 0.07
    }
    return (
        <View  >
            <View style={styles.keypadFlex} >
                {converterBtns.map(({label, value, ...rest}, index) => {
                    const backgroundColor = rest.isBasicOperation ? "#633CEF": rest.isNumeric ? "#DDDDDD": "#EDEDED"
                    const textColor = rest.isBasicOperation ? "#FFF": rest.isNumeric ? "##000000": "#646464"

                        if(index === 0){
                            return <TouchableOpacity key={index}
                            onPress={() => {
                                hapticEffect()
                                onPress(!isOperating ? value : "AC", false)
                            }}
                            onLongPress={() => onPress(value, true)}
                            style={[styles.keypad,  {backgroundColor, ...basicBtnWidthHeight} ]} >
                                { isOperating ? <Image style={styles.deleteKey} source={rest.icon} />  :(
                                    <Text style={[styles.key, {color: textColor}]} >AC</Text>)
                                }
                            </TouchableOpacity>
                        }

                    return <TouchableOpacity key={index} onPress={() => {
                        hapticEffect()
                        onPress(value, false)
                    }} style={[styles.keypad, {backgroundColor, ...basicBtnWidthHeight} ]} >
                        { rest.icon ? <Image style={styles.iconKey} source={rest.icon} />  :(
                            <Text style={[styles.key, {color: textColor}]} >{label}</Text>)
                        }
                    </TouchableOpacity>
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    keypadFlex: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },
    keypad: {
        width: 75,
        height: 75,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10
    },
    key: {
        fontSize: 35,
        fontWeight: "700"
    },
    iconKey: {
        width: 30,
        height: 30,
        resizeMode: "contain"
    },
    deleteKey: {
        width: 40,
        height: 40,
        resizeMode: "contain",
    },
})
