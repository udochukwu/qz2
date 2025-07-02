import { Platform, SafeAreaView, View } from "react-native"
import React, { useContext, useEffect, useState } from "react";
import CalculatorHeader from "./components/CalculatorHeader";
import { CALCULATOR_MODE } from "./types";
import ConverterCalculator from "./Converter";
import ScientificCalculator from "./ScientificCalculator";
import { History, useCalculatorHistoryStore } from "./store/calculatorHistory";
import CalculatorHistoryModal from "./components/CalculatorHistoryModal";
import ProfileContext from "../../contexts/ProfileContext";

export default function Calculator(){
    const [tab, setTab] = useState(CALCULATOR_MODE.SCIENTIFIC);
    const { addToHistory , clearHistory} = useCalculatorHistoryStore()
    const [showHistroy, setShowHistroy] = useState(false)
    const [historyValue, setHistoryValue] = useState<History>({} as History)

    const closeHistory = () => setShowHistroy(false)
    const openHistory = () => setShowHistroy(true)

    const clearHistoryValue = () => setHistoryValue({} as History)
    const context = useContext(ProfileContext);
    useEffect(() => {
        context.mixpanel?.track("Page View", { 
            'Page Title': 'Calculator',
            'Calculator Type': tab === CALCULATOR_MODE.SCIENTIFIC ? 'Scientific' : 'Converter',
            'Device Type': Platform.OS
        });
    }, [tab])
    const onSelectHistory = (history:History) => {
      setShowHistroy(false)
      setHistoryValue(history)
      if(history.type === "calc"){
        setTab(CALCULATOR_MODE.SCIENTIFIC)
      }else {
        setTab(CALCULATOR_MODE.CONVERTER)
      }
      setTimeout(() => clearHistoryValue(), 500)
    }

    return <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF",  }}>
   <CalculatorHeader tab={tab} setTab={setTab} />
   <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            display: tab === CALCULATOR_MODE.CONVERTER ? "flex" : "none",
          }}
        >
          <ConverterCalculator  historyValue={historyValue} showHistory={openHistory} />
        </View>
        <View
          style={{
            flex: 1,
            display: tab === CALCULATOR_MODE.SCIENTIFIC ? "flex" : "none",
          }}
        >
          <ScientificCalculator historyValue={historyValue} showHistory={openHistory} />
        </View>
      </View>
      <CalculatorHistoryModal  onPress={onSelectHistory} isVisible={showHistroy} onDismiss={closeHistory} clearHistory={clearHistory} />
 </SafeAreaView>
}
