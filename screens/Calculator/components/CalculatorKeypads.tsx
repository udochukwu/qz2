
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { calculatorBasicBtns, scientificBtns } from "../constants";
import { hapticEffect } from "../../../services/common";
interface ConveterKeypadProps {
    onPress: (value: string) => void;
    hasResult?: boolean
    isDegreeFormat: boolean
    onDeleteLongPress: () => void
}

export default function CalculatorKeypads ({onPress, hasResult = false, isDegreeFormat, onDeleteLongPress}: ConveterKeypadProps){
    const { width , height} = useWindowDimensions();

    const basicBtnWidthHeight = {
        width: width * 0.2,
        height: height * 0.07
    }

    const functionBtnWidthHeight = {
        width: width * 0.13,
        height: height * 0.05
    }

    return (
        <View  style={{height: "75%"}} >
            <View style={styles.keypadFlex} >
                {scientificBtns.map(({label, value, ...rest}, index) => {
                    const backgroundColor = rest.isBasicOperation ? "#633CEF": rest.isNumeric ? "#D1DCE1": "#EDEDED"
                    const textColor = rest.isBasicOperation ? "#FFF": rest.isNumeric ? "##000000": "#646464"

                    if(value === "rad"){
                        return <TouchableOpacity key={index} onPress={() => {
                            hapticEffect()
                            onPress(value)
                        }} style={[styles.keypad, {backgroundColor, ...functionBtnWidthHeight} ]} >
                             <Text style={[styles.key, {color: textColor}]} >{isDegreeFormat ? "Deg" : "Rad"}</Text>
                        </TouchableOpacity>
                    }

                    return <TouchableOpacity key={index} onPress={() => {
                        hapticEffect()
                        onPress(value)
                    }} style={[styles.keypad, {backgroundColor, ...functionBtnWidthHeight} ]} >
                        { rest.icon ? <Image style={styles.iconKey}  source={rest.icon} />  :(
                            <Text style={[styles.key, {color: textColor}]} >{label}</Text>)
                        }
                    </TouchableOpacity>
                })}
                {calculatorBasicBtns.map(({label, value, ...rest}, index) => {
                    const backgroundColor = rest.isBasicOperation ? "#633CEF": rest.isNumeric ? "#DDDDDD": "#EDEDED"
                    const textColor = rest.isBasicOperation ? "#FFF": rest.isNumeric ? "#000000": "#646464"
                    if(index === 0){

                        return <TouchableOpacity key={index}
                        onPress={() => {
                            hapticEffect()
                            onPress(!hasResult ? value : "AC")
                        }}
                        onLongPress={onDeleteLongPress}
                        style={[styles.keypad, , {backgroundColor, ...basicBtnWidthHeight} ]} >
                            { !hasResult ? <Image style={styles.deleteKey} source={rest.icon} />  :(
                                <Text style={[styles.key, styles.basicKey, {color: textColor}]} >AC</Text>)
                            }
                        </TouchableOpacity>
                    }

                    return <TouchableOpacity key={index} onPress={() => {
                        hapticEffect()
                        onPress(value)
                    }} style={[styles.keypad, {backgroundColor, ...basicBtnWidthHeight } ]} >
                        { rest.icon ? <Image style={styles.iconKey} source={rest.icon} />  :(
                            <Text style={[styles.key, styles.basicKey, {color: textColor}]} >{label}</Text>)
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
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10
    },
    key: {
        fontSize: 18,
        fontWeight: "700"
    },
    basicKey: {
        fontSize: 35
    },
    iconKey: {
        width: 30,
        height: 30,
        resizeMode: "contain",
        aspectRatio: "2/1"
    },
    deleteKey: {
        width: 40,
        height: 40,
        resizeMode: "contain",
    },

})
