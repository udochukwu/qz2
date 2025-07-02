import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MeasurementUnit } from '../types';
import images from '../../../assets/images';

interface ConverterDisplayProps {
    topValue: string;
    bottomValue: string;
    currentlySelected: number;
    onUnitValueSelect: (index: number) => void;
    onUnitPress: (index: number) => void;
    onSwitchPress: () => void;
    topUnit: MeasurementUnit;
    bottomUnit: MeasurementUnit;
}

export default function ConverterInputDisplay({
    onSwitchPress,
    onUnitValueSelect,
    onUnitPress,
    currentlySelected,
    topUnit,
    topValue,
    bottomUnit,
    bottomValue }: ConverterDisplayProps) {


    return (
        <View style={styles.container} >
            <View style={[styles.unitContainer]} >
                <ScrollView
                    horizontal
                    contentContainerStyle={{  flexGrow: 1 }}
                    showsHorizontalScrollIndicator={false}
                    >
                    <Pressable
                        style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        maxHeight: 100
                        }}
                        onPress={() => onUnitValueSelect(0)}
                    >
                        <Text
                        style={[
                            styles.unitAmount,
                            {
                            color: currentlySelected === 0 ? "#000000" : "#00000099",
                            textAlign: "right",
                            width: "auto" // Allow text to expand
                            }
                        ]}
                        >
                        {topValue || "0"}
                        </Text>
                    </Pressable>
                </ScrollView>
                <Pressable style={[styles.row]} onPress={() => onUnitPress(0)}>
                <Text style={styles.unit} >{topUnit.short_name}</Text>
                    <Image source={images['chevron-selector']} />
                </Pressable>
            </View>
            <View style={[styles.row]} >
                <Pressable onPress={onSwitchPress} >
                    <Image style={styles.switchIcon} source={images['arrow-two-way']} />
                </Pressable>
                <View style={{ backgroundColor: "#E7F0F4", height: 1, width: "100%" }} />
            </View>
            <View style={[styles.unitContainer]}>
               <ScrollView
                    horizontal
                    contentContainerStyle={{  flexGrow: 1 }}
                    showsHorizontalScrollIndicator={false}
                    >
                    <Pressable
                        style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        maxHeight: 100
                        }}
                        onPress={() => onUnitValueSelect(1)}
                    >
                        <Text
                        style={[
                            styles.unitAmount,
                            {
                            color: currentlySelected === 1 ? "#000000" : "#00000099",
                            textAlign: "right",
                            width: "auto" // Allow text to expand
                            }
                        ]}
                        >
                        {bottomValue || "0"}
                        </Text>
                    </Pressable>
                </ScrollView>
                <Pressable style={[styles.row]} onPress={() => onUnitPress(1)}>
                    <Text style={styles.unit}>{bottomUnit.short_name}</Text>
                    <Image source={images['chevron-selector']} />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-around",
        flex: 1,
        width: "100%",
        overflow: "hidden",
        paddingVertical: 20,
    },
    unitContainer: {
        flexDirection: 'row',
        justifyContent: "flex-end",
        alignItems: "baseline"
    },
    unitAmount: {
        fontSize: 54,
        fontWeight: "700",
    },
    row: {
        flexDirection: "row",
        alignItems: "center"
    },
    switchIcon: {
        width: 21,
        height: 18.7,
        marginRight: 20
    },
    unit: {
        fontSize: 20,
        fontWeight: "400",
        color: "#646464",
        marginHorizontal: 6,
    }
})
