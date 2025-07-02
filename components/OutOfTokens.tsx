import AnimatedLottieView from "lottie-react-native"
import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { PrimaryButton } from "./Button"
import { useTranslation } from "react-i18next"

function OutOfTokens({ onPress }: { onPress: () => void }) {
    const { t } = useTranslation()
    return (
        <View style={styles.earnContainer}>
            <AnimatedLottieView source={require("../assets/notokens.json")} autoPlay loop={false} style={{ width: "80%" }} />
            <Text style={styles.title}>
                {t("outOfTokens.title")}
            </Text>
            <Text style={styles.subtitle}>
                {t("outOfTokens.subtitle")}
            </Text>
            <PrimaryButton text={t("outOfTokens.getTokens")} onPress={onPress} />
        </View>
    )
}

const styles = StyleSheet.create({
    earnContainer: {
        backgroundColor: "#F7F7F7",
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingBottom: 30,
        justifyContent: "space-between",
        alignItems: "center"
    },
    title: {
        fontFamily: 'Montserrat',
        fontSize: 20,
        fontWeight: "600",
        color: "#24184E",
        textAlign: "center",
        marginTop: 20,
        marginBottom: 10

    },
    subtitle: {
        fontFamily: 'Montserrat',
        fontSize: 14,
        color: "#5D5D5D",
        textAlign: "center",
        marginBottom: 25
    }
})

export default OutOfTokens