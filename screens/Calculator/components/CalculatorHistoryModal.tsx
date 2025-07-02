import React from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { History, useCalculatorHistoryStore } from "../store/calculatorHistory";
import images from "../../../assets/images";
import { MathJaxSvg } from "react-native-mathjax-html-to-svg";
import { t } from "i18next";

interface CalculatorHistoryModalProps {
    isVisible: boolean;
    onDismiss: () => void;
    clearHistory: () => void;
    onPress: (history: History ) => void
}

export default function CalculatorHistoryModal({
    isVisible,
    onDismiss,
    clearHistory,
    onPress
}: CalculatorHistoryModalProps) {
    const { history } = useCalculatorHistoryStore()

    return (
        <Modal visible={isVisible} animationType="fade"
            transparent
        >
            <View style={styles.container} >
                <Pressable onPress={onDismiss} style={styles.overLay} />
                <View style={styles.content} >
                    <View style={styles.header} >
                        <View style={{ width: 50 }} />
                        <View  >
                            <Text style={styles.historyHeaderTxt} >{t('calculator.history')}</Text>
                        </View>
                        <Pressable disabled={!history.length} onPress={clearHistory} ><Text style={[styles.clearTxt, { opacity: history.length ? 1 : 0.3 }]} >{t    ('calculator.clear')}</Text></Pressable>
                    </View>
                        <ScrollView>
                        <View style={{ marginTop: 20, paddingHorizontal: 20 }} >
                            {!history.length ? (
                                <View>
                                    <Image style={styles.emptyImg} source={images.quizard} />
                                    <Text style={styles.noHistoryTxt} >{t('calculator.noHistory')}</Text>
                                </View>

                            ) : history.map((h, index) => (
                                <Pressable key={index} onPress={() => onPress(h) } >
                                <View  style={styles.historyData}  >
                                    <MathJaxSvg
                                        fontSize={14}
                                        color="grey"
                                        fontCache={true}
                                        style={{marginBottom:4}}
                                    >
                                        {`$$${h.type === "calc" ? h.equation : h.equation.replace("-", "")}$$`}
                                    </MathJaxSvg>

                                    <MathJaxSvg
                                        fontSize={18}
                                        color="#000"
                                        fontCache={true}
                                    >
                                        {`${h.type === "calc" ? h.result : h.result.replace("-", "")}`}
                                    </MathJaxSvg>
                                </View>
                                </Pressable>

                            ))}
                             </View>
                        </ScrollView>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        borderWidth: 1,
    },
    content: {
        minHeight: "50%",
        maxHeight: "80%",
        backgroundColor: "white",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 20,
        zIndex: 100,
    },
    emptyImg: {
        width: 100,
        height: 100,
        resizeMode: "contain",
        alignSelf: "center"
    },
    header: {
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderBottomColor: "#EDEDED",
        paddingHorizontal: 20,
    },
    historyHeaderTxt: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000"
    },
    overLay: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor:  "rgba(0,0,0,0.2)",
        height: "100%",
        zIndex: 10
    },
    clearTxt: {
        color: "red",
        fontSize: 18,
        fontWeight: "600"
    },
    noHistoryTxt: {
        textAlign: "center",
        marginTop: 20,
        color: "#00000066",
        fontWeight: "600"
    },
    historyData: {
        borderBottomWidth: 1,
        paddingBottom: 8,
        borderBottomColor: "#EDEDED",
        marginBottom: 15,
    },
    result: {
        fontSize: 18,
        color: "#000",
        fontWeight: "500"
    },
})
