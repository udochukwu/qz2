import React, { useEffect, useMemo, useRef } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MeasurementUnit, EUnitCategory } from "../types";
import { measurementUnits } from "../constants";
import { t } from "i18next";

interface UnitModalProp {
    isVisible: boolean;
    onSelect: (event: MeasurementUnit) => void;
    onDismiss: () => void;
    currentlySelectedMeasurement: MeasurementUnit;
    onSelectCategory: (category: EUnitCategory) => void;
    selectedCategory: EUnitCategory;
}

const measurements = measurementUnits.map((ms) => ({
    displayName: ms.displayName,
    name: ms.name,  
    icon: ms.icon
}))

export default function UnitModal({
    isVisible,
    onDismiss,
    currentlySelectedMeasurement,
    onSelectCategory,
    selectedCategory,
    onSelect}: UnitModalProp){

    const scrollRef = useRef<ScrollView>(null);
    const itemPositions = useRef<{ [key: string]: number }>({});

    const unitList = useMemo(() => {
        return measurementUnits.find((ms) => ms.name.toLowerCase() === selectedCategory.toLowerCase())?.units || []
    }, [selectedCategory])

    useEffect(() => {
        if (isVisible && selectedCategory && itemPositions.current[selectedCategory] !== undefined) {
            // Delay scrolling to ensure elements are rendered
            setTimeout(() => {
                scrollRef.current?.scrollTo({
                    x: itemPositions.current[selectedCategory] - 50, // Adjust centering
                    animated: true
                });
            }, 100); // Small delay to ensure layout is calculated
        }
    }, [selectedCategory, isVisible]);

    return (
        <Modal visible={isVisible} animationType="fade"
        transparent
          >
            <View style={styles.container} >
                <View style={styles.content} >
                    <View style={[styles.row, {justifyContent: 'space-between', marginBottom: 15}]} >
                        <Pressable onPress={onDismiss} >
                        <Image style={styles.closeIcon} source={require("../../../assets/x-close.png")} />
                        </Pressable>
                        <Text style={styles.headerTxt} >{t('calculator.selectUnit')}</Text>
                        <View style={styles.closeIcon} />
                    </View>
                    <View>
                    <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{paddingLeft: 20}}
                    ref={scrollRef}
                    >
                        {measurements.map((ms, index) => {
                            const isSelected = ms.name.toLowerCase() === selectedCategory.toLowerCase()
                            let bg = isSelected ? "#6D56FA33" : "#E7F0F4"
                            let textColor = isSelected ? "#6D56FA" : "#646464"
                            let tintColor = isSelected ? "#6D56FA" : "#646464"
                            return <TouchableOpacity
                                    onPress={() => onSelectCategory(ms.name)}
                                    key={index}
                                    style={[styles.row, styles.unitBtn, {backgroundColor: bg}]}
                                    onLayout={(event) => {
                                        const { x } = event.nativeEvent.layout;
                                        itemPositions.current[ms.name] = x;
                                    }}
                                >
                                <Image style={[styles.measureIcon]} tintColor={tintColor} source={ms.icon} />
                                <Text style={[styles.unitName, {color: textColor}]}>{ms.displayName}</Text>
                            </TouchableOpacity>
                        })}
                    </ScrollView>
                    </View>
                    <View style={{marginTop: 10}} >
                        <ScrollView
                            contentContainerStyle={{paddingTop: 20}}
                            showsVerticalScrollIndicator={false}
                        >
                            {unitList?.map((un, index) => {
                                const isSelected = un.name.toLowerCase() === currentlySelectedMeasurement.name.toLowerCase()
                                let name_color = isSelected ? "#6D56FA": "#646464"
                                let short_name_color = isSelected ? "#6D56FA99": "#64646459"

                                return (
                                    <TouchableOpacity onPress={() => onSelect(un)} key={index} style={styles.measureBtn} >
                                        <View style={styles.row} >
                                            <Text style={[styles.measureTxt, {color: name_color}]} >{un.name}</Text>
                                            <Text style={[styles.measureTxt, {marginLeft: 4, color: short_name_color}]} >{`(${un.short_name})`}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(0,0,0,0.2)",
        flex: 1,
        justifyContent: "flex-end"
    },
    content: {
        height: "90%",
        backgroundColor: "white",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    row: {
        flexDirection: "row",
        alignItems: "center"
    },
    headerTxt: {
        fontSize: 20,
        fontWeight: "600",
        color: "#000"
    },
    closeIcon: {
        width: 24,
        height: 24,
    },
    unitName: {
        fontSize: 12,
        fontWeight: "500"
    },
    unitBtn: {
        borderRadius: 18,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 10
    },
    measureIcon: {
        width: 16,
        height: 16,
        marginRight: 5
    },
    measureBtn: {
        borderBottomWidth: 0.5,
        borderBottomColor: "#E7F0F4",
        paddingBottom: 15,
        marginBottom: 15
    },
    measureTxt: {
        fontSize: 16,
        fontWeight: "600"
    }
})
