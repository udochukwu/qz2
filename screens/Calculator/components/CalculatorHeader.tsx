import React from "react";
import { StyleSheet, View } from "react-native";
import ButtonGroup from "../../../components/Button/ButtonGroup";
import { t } from "i18next";

export default function CalculatorHeader({ tab, setTab }: { tab: number; setTab: (index: number) => void }){

    return (
        <View style={styles.headerContainer} >
            <View >
                <ButtonGroup labels={[t('calculator.title'), t('calculator.converter')]} onPress={setTab} selectedIndex={tab} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer:{
        flexDirection: "row",
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center"
    }
})
