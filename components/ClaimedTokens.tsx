import AnimatedLottieView from "lottie-react-native"
import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { PrimaryButton } from "./Button"
import { useTranslation } from "react-i18next"


function ClaimedTokens({ onPress }: { onPress: () => void }) {
    const { t } = useTranslation()
    return (
        <View style={styles.earnContainer}>
            <AnimatedLottieView source={require("../assets/lottie/token_claimed.json")} autoPlay loop={true} style={{ width: "50%" }} />
            <Text style={styles.title}>
                {t("claimTokens.title")}
            </Text>
            <PrimaryButton text={t("claimTokens.dismiss")} onPress={onPress} />
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
        marginBottom: 20

    },
})

export default ClaimedTokens