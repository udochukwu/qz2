import { SafeAreaView, StyleSheet, Text, View } from "react-native"
import { BackArrow } from "../../components/BackArrow";
import { useTranslation } from "react-i18next";
import Button from "../../components/Button";
import AnimatedLottieView from "lottie-react-native";

type Props = {
    navigation: any;
    pro: boolean;
    tokens: number;
};

export default function ChromeScreen({ navigation }: Props) {

    const { t } = useTranslation();
    const onLinkDevice = () => {
        navigation.navigate("Link");
    }
    const onGuide = () => {
        navigation.navigate("ChromeGuide");
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 }}>
            <View style={styles.header}>
                <View style={{ position: "absolute", left: 30 }}>
                    <BackArrow onClick={() => navigation.goBack()} />
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}> {t("chrome.screenTitle")} </Text>
                </View>
            </View>
            <View style={styles.body}>
                <View style={styles.mainContent}>
                    <View style={styles.demoContainer}>
                        <View style={{ paddingHorizontal: 20, height: "100%", width: "100%" }}>
                            <AnimatedLottieView
                                source={{ uri: "https://quizard-app-public-assets.s3.us-east-2.amazonaws.com/chrome.json" }}
                                style={{
                                    width: "100%",
                                }}
                                autoPlay
                                loop
                            />
                        </View>
                        <View style={styles.demoTextContainer}>
                            <Text style={styles.demoTitle}> {t("chrome.demoTitle")} </Text>
                            <Text style={styles.demoText}> {t("chrome.demoText")} </Text>
                        </View>
                    </View>
                    <View style={styles.featuresTextContainer}>
                        <Text style={styles.demoTitle}> {t("chrome.featuresTitle")} </Text>
                        <Text style={styles.demoText}> {t("chrome.featureText1")} </Text>
                        <Text style={styles.demoText}> {t("chrome.featureText2")} </Text>
                    </View>
                </View>
                <View style={styles.CTAContainer}>
                    <Button onPress={onLinkDevice} style={styles.button} >
                        <Text style={styles.buttonText}>
                            {t('chrome.linkButton')}
                        </Text>
                    </Button>
                    <Button onPress={onGuide} color="secondary" style={{...styles.button, backgroundColor: 'white'}}>

                        <Text style={styles.buttonTextSecondary}>
                            {t('chrome.guideButton')}
                        </Text>
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        paddingBottom: 12,
        paddingTop: 12,
        zIndex: 1,
    },
    body: {
        justifyContent: "space-between",
        flex: 1
    },
    mainContent: {
        flex: 1,
        justifyContent: "center",

    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

    },
    title: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "700",
        color: "rgb(47, 47, 47)",
        fontSize: 20,
    },
    demoContainer: {
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        marginTop: 30,
        marginBottom: 30,
        height: "50%"
    },
    demoTextContainer: {
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 20,

    },
    demoTitle: {
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: "600",
        color: "black",
        fontSize: 18,
        textAlign: "center"
    },
    demoText: {
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: "400",
        color: "#5D5D5D",
        fontSize: 15,
        lineHeight: 22,
        textAlign: "center",
    },
    CTAContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    featuresTextContainer: {
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        marginTop: 40,
        backgroundColor: "#F6F6F6",
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 16,
    },
    button: {
        width: "90%",
        height: 55,
        backgroundColor: '#6D56FA',
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    buttonText: {
        fontFamily: 'Nunito',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 19,
        textAlign: 'center',
        color: '#FFFFFF',
    },
    buttonTextSecondary: {
        fontFamily: 'Nunito',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 19,
        textAlign: 'center',
        color: '#6D56FA',
    }
})