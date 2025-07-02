import React, { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import ConverterKeypads from "./components/ConverterKeypads";
import ConverterInputDisplay from "./components/ConverterInputDisplay";
import { hapticEffect } from "../../services/common";
import {evaluate} from "mathjs"
import UnitModal from "./components/UnitModal";
import { MeasurementUnit, EUnitCategory } from "./types";
import { measurementUnits } from "./constants";
import { convertUnit } from "./helper";
import { History, useCalculatorHistoryStore } from "./store/calculatorHistory";
interface IProps {
    showHistory: () => void;
    historyValue?: History;
}

const screenHeight = Dimensions.get('window').height;

export default function ConverterCalculator({showHistory, historyValue}: IProps){
    const { addToHistory} = useCalculatorHistoryStore()
    const [currentlySelectedIndex, setCurrentlySelectedIndex] = useState(0)
    const [topValue, setTopValue] = useState("")
    const [bottomValue, setBottomValue] = useState("")
    const [topUnit, setTopUnit] = useState<MeasurementUnit>(measurementUnits?.[0]?.units?.[0])
    const [bottomUnit, setBottomUnit] = useState<MeasurementUnit>(measurementUnits?.[0]?.units?.[1])
    const [showUnitModal, setShowUnitModal] = useState(false)
    const [currentCat, setCurrentCat] = useState<EUnitCategory>(measurementUnits?.[0]?.units?.[0]?.category)
    const [isOperating, setIsOperating] = useState(false)
    const isTopActive = currentlySelectedIndex === 0;

    const onUnitValueSelect = (index: number) => {
        hapticEffect()
        setCurrentlySelectedIndex(index)
    }

    const onUnitPress = (index: number) => {
        setCurrentlySelectedIndex(index)
        setShowUnitModal(true)
    }

    const onSwitchPress = () => {
        hapticEffect()
        let value
        if (isTopActive) {
            value = convertUnit(Number(topValue), bottomUnit.short_name, topUnit.short_name, currentCat)
            setBottomValue(topValue)
            setTopValue(String(value))
        } else {
            value = convertUnit(Number(bottomValue), topUnit.short_name, bottomUnit.short_name, currentCat)
            setBottomValue(String(value))
            setTopValue(bottomValue)
        }
        setCurrentlySelectedIndex(currentlySelectedIndex === 0 ? 1 : 0)
    }

    const performConversion = async (equalKeypressed: boolean) => {
        const setValue = isTopActive ? setTopValue : setBottomValue;
        const currentValue = isTopActive ? topValue : bottomValue;
        const cleanValue = currentValue?.replace(/x/g, "*")?.replace(/÷/g, "/")
        try {
            const evaluatedValue = evaluate(cleanValue);
            let convertedValue;
            if(evaluatedValue !== undefined){
                if(isTopActive){
                    setTopValue(evaluatedValue)
                    convertedValue = convertUnit(evaluatedValue, topUnit.short_name, bottomUnit.short_name, currentCat)
                    setBottomValue(String(convertedValue))
                }else {
                    setBottomValue(evaluatedValue)
                    convertedValue = convertUnit(evaluatedValue, bottomUnit.short_name, topUnit.short_name, currentCat)
                    setTopValue(String(convertedValue))
                }
                setValue(equalKeypressed ?  evaluatedValue: currentValue);
                if(equalKeypressed){
                    addToHistory({
                        equation: `${evaluatedValue}-${isTopActive ? topUnit.short_name : bottomUnit.short_name}`,
                        result: `${convertedValue}-${isTopActive ? bottomUnit.short_name : topUnit.short_name}`,
                        type: "converter",
                        unitCategory: currentCat
                    })
                }
            }
        } catch (error) {
            console.log(error, "Failed to evaluate equation")
        }
    }

    const onKeypadPress =  (val: string, longPress: boolean) => {
        const currentValue = isTopActive ? topValue : bottomValue;
        const setValue = isTopActive ? setTopValue : setBottomValue;
        if(!longPress){
            if(val === "pm"){
                if(!currentValue) return
                let newValue = -Number(currentValue)
                setValue(String(newValue))
                return
            }

            if (val === "AC") {
                if(isOperating && currentValue){
                    setValue((prev) => prev.slice(0, prev.length -1))
                    return
                }
                setTopValue("");
                setBottomValue("");
                setIsOperating(false)
                return;
            }

            if(val === "history"){
                showHistory()
                return
            }

            if (val === "=") {
                performConversion(true)
                setIsOperating(false)
            } else {
                setValue(currentValue + val?.replace(/\\times/g, "x"));
                setIsOperating(true)
            }
        }else {
            setTopValue("");
            setBottomValue("");
            setIsOperating(false)
        }
    }

    const onUnitSelect = (unit:MeasurementUnit) => {
        const filteredSelectedUnit = measurementUnits.filter((fl) => fl.name.toLowerCase() === unit.category.toLowerCase())?.[0]
        if(currentlySelectedIndex === 0){
            setTopUnit(unit)
            if(bottomUnit.category !== unit.category){
                setBottomUnit(filteredSelectedUnit?.units?.[1])
            }
        }else {
            setBottomUnit(unit)
            if(topUnit.category !== unit.category){
                setTopUnit(filteredSelectedUnit?.units?.[1])
            }
        }
        setCurrentCat(filteredSelectedUnit.name)
        setShowUnitModal(false)
    }
    const onSelectCategory = (val: EUnitCategory) => {
        setCurrentCat(val)
    }

    const findMeasureUnit = (shrtName: string, list?: MeasurementUnit[]) => {
        if(shrtName && list){
            const unitObject = list.find((u) => u.short_name === shrtName)
            return unitObject;
        }
        return null
    }

    useEffect(() => {
        performConversion(false)
    }, [topValue, bottomValue])

    useEffect(() => {
        if(topValue || bottomValue){
            performConversion(false)
        }
    }, [topUnit.short_name, bottomUnit.short_name])

    useEffect(() => {
        if(historyValue?.type === "converter"){
            const [tUnitValue, tUnitName] = historyValue.equation?.split("-")
            const [_, bUnitName] = historyValue.result?.split("-")
            const ms = measurementUnits.find((m) => m.name === historyValue.unitCategory)?.units
            const tUnit = findMeasureUnit(tUnitName, ms)
            const bUnit = findMeasureUnit(bUnitName, ms)
            tUnit && setCurrentCat(tUnit?.category)
            bUnit && setBottomUnit(bUnit)
            tUnit && setTopUnit(tUnit)
            tUnitValue && setTopValue(tUnitValue)
        }
    }, [historyValue])

    return (
        <View style={{flex: 1, justifyContent: "flex-end", flexDirection: 'column', paddingHorizontal: 20, paddingBottom: screenHeight > 700 ? 51 : 18}} >
            <ConverterInputDisplay
                topValue={topValue}
                bottomValue={bottomValue}
                currentlySelected={currentlySelectedIndex}
                onUnitValueSelect={onUnitValueSelect}
                onUnitPress={onUnitPress}
                onSwitchPress={onSwitchPress}
                topUnit={topUnit}
                bottomUnit={bottomUnit}
            />
            <ConverterKeypads isOperating={isOperating} onPress={onKeypadPress}/>
            <UnitModal
            isVisible={showUnitModal}
            selectedCategory={currentCat}
            onSelect={onUnitSelect}
            onDismiss={() => setShowUnitModal(false)}
            onSelectCategory={onSelectCategory}
            currentlySelectedMeasurement={currentlySelectedIndex === 0 ? topUnit : bottomUnit}
            />
        </View>
    )
}
