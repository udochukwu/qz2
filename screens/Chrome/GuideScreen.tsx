import { useTranslation } from "react-i18next";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { BackArrow } from "../../components/BackArrow";
import AnimatedLottieView from "lottie-react-native";
import Button from "../../components/Button";


type Props = {
    navigation: any;
};

export default function ChromeGuideScreen({ navigation }: Props) {

    const { t } = useTranslation();
    const onLinkDevice = () => {
        navigation.navigate("Link");
    }
    return (

        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <View style={{ position: "absolute", left: 30 }}>
                    <BackArrow onClick={() => navigation.goBack()} />
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}> {t("chrome.guide.screenTitle")} </Text>
                </View>
            </View>
            <ScrollView style={{ flex: 1 }}>

                <View style={styles.body}>
                    <View style={styles.demoContainer}>
                        <AnimatedLottieView
                            source={{ uri: "https://quizard-app-public-assets.s3.us-east-2.amazonaws.com/chrome-guide.json" }}
                            style={{
                                width: "100%",
                                maxHeight: 300,
                            }}
                            autoPlay
                            loop
                        />
                    </View>
                    <View style={styles.stepsContianer}>
                        <View style={styles.stepContainer}>
                            <Text style={styles.stepTitle}>{t("chrome.guide.step1Title")}</Text>
                            <Text style={styles.stepDescription}>{t("chrome.guide.step1Description")}</Text>
                        </View>

                        <View style={styles.stepContainer}>
                            <Text style={styles.stepTitle}>{t("chrome.guide.step2Title")}</Text>
                            <Text style={styles.stepDescription}>{t("chrome.guide.step2Description")}</Text>
                        </View>

                        <View style={{ ...styles.stepContainer, borderBottomWidth: 0 }}>

                            <Text style={styles.stepTitle}>{t("chrome.guide.step3Title")}</Text>
                            <Text style={styles.stepDescription}>{t("chrome.guide.step3Description")}</Text>

                        </View>
                    </View>
                    <View style={styles.CTAContainer}>
                        <Button onPress={onLinkDevice} style={styles.button} >
                            <Text style={styles.buttonText}>
                                {t('chrome.linkButton')}
                            </Text>
                        </Button>

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )

}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        paddingTop: 12,
        zIndex: 1,
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
    body: {
        flex: 1,

    },
    demoContainer: {
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        margin: 20,
        marginVertical: 0
    },
    stepsContianer: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 36
    },
    stepContainer: {
        marginBottom: 24,
        borderBottomWidth: 1,
        width: "100%",
        borderBottomColor: "#EFEFEF",
        alignItems: "flex-start",
        paddingBottom: 16,

    },
    stepTitle: {
        fontFamily: "Inter",
        fontWeight: "600",
        fontSize: 18,
        color: "black",
        marginBottom: 3,
    },
    stepDescription: {
        fontFamily: "Inter",
        fontWeight: "400",
        fontSize: 15,
        color: "black",
        lineHeight: 22,
    },
    CTAContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
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
})