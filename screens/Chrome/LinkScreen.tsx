import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { BackArrow } from '../../components/BackArrow';
import { FetchDeviceLinkingCode } from '../../services/backendCalls';
import AnimatedLottieView from 'lottie-react-native';

type Props = {
    navigation: any;
};

export default function LinkScreen({ navigation }: Props) {
    const [code, setCode] = React.useState("000000");
    const [isError, setIsError] = React.useState(false);
    const [time_until_expiration, setExpiresAIn] = React.useState(0);

    const { t } = useTranslation();
    const fetchCode = async () => {
        const response = await FetchDeviceLinkingCode();
        if (response && response.code && response.expires_at) {
            setCode(response.code);
            // Append 'Z' to indicate UTC time zone
            const expirationTimeUTC = new Date(response.expires_at + 'Z').getTime();
            const currentTimeUTC = new Date().getTime(); // Current time in UTC milliseconds
            const timeUntilExpiration = expirationTimeUTC - currentTimeUTC; // Difference in milliseconds
            const timeUntilExpirationInSeconds = Math.floor(timeUntilExpiration / 1000); // Convert to seconds
            setExpiresAIn(timeUntilExpirationInSeconds);
        }

        else {
            setIsError(true)
        }
    }



    useEffect(() => {
        if (time_until_expiration <= 0) {
            fetchCode().catch(() => setIsError(true));
        }
        let interval: any;
        if (time_until_expiration > 0) {
            interval = setInterval(() => {
                setExpiresAIn(time => time - 1);
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [time_until_expiration]);


    return (
        <>
            <SafeAreaView style={styles.safeArea}>

                <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
                    <View style={styles.header}>
                        <View style={{ position: "absolute", left: 30 }}>
                            <BackArrow onClick={() => navigation.goBack()} />
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}> {t("chrome.link.screenTitle")} </Text>
                        </View>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.stepsContianer}>
                            <View style={styles.stepContainer}>
                                <Text style={styles.stepTitle}>{t("chrome.link.step1Title")}</Text>
                                <Text style={styles.stepDescription}>{t("chrome.link.step1Description")}</Text>
                            </View>

                            <View style={styles.stepContainer}>
                                <Text style={styles.stepTitle}>{t("chrome.link.step2Title")}</Text>
                                <Text style={styles.stepDescription}>{t("chrome.link.step2Description")}</Text>
                            </View>

                            <View style={{ ...styles.stepContainer, marginBottom: 0, borderBottomWidth: 0 }}>

                                <Text style={styles.stepTitle}>{t("chrome.link.step3Title")}</Text>
                                <Text style={styles.stepDescription}>{t("chrome.link.step3Description")}</Text>
                                <View style={styles.codeInputContainer}>
                                    {isError && <Text style={{ color: 'red', marginBottom: 5 }}>{t("chrome.link.step3Error")}</Text>}
                                    <CodeDisplay code={code} isError={isError} />
                                    {time_until_expiration > 0 && <Text style={styles.counterText}>{t("chrome.link.step3Expiration", { time: time_until_expiration })}</Text>}
                                </View>
                            </View>
                        </View>

                        <View style={styles.tutorialContainer}>
                            <Text style={styles.stepTitle}>{t("chrome.link.tutorialTitle")}</Text>
                            <Text style={{ ...styles.stepDescription, color: "#6D56FA" }}>{t("chrome.link.tutorialDescription")}</Text>
                            <View style={styles.demoContainer}>
                                <AnimatedLottieView
                                    source={{ uri: "https://quizard-app-public-assets.s3.us-east-2.amazonaws.com/chrome-link.json" }}
                                    style={{
                                        width: "100%",
                                        maxHeight: 300,
                                    }}
                                    autoPlay
                                    loop
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
            <SafeAreaView style={{ backgroundColor: "#F8F8F8" }} />
        </>
    );
}

const CodeDisplay = ({ code, isError }: { code: string, isError: boolean }) => {
    const digits = code.split('');

    return (
        <View style={styles.codeContainer}>
            {digits.map((digit, index) => (
                <View key={index} style={[styles.digitBox, isError && styles.errorDigitBox]}>
                    <Text style={[styles.digitText, isError && { color: 'red' }]}>
                        {digit}
                    </Text>
                </View>
            ))}
        </View>
    );
};

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
        paddingBottom: 12,
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
    content: {
        flex: 1,
        justifyContent: "center",
        marginTop: 24,
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
    codeInputContainer: {
        // Style for your code input container
        marginTop: 10,
    },
    tutorialContainer: {
        backgroundColor: "#F8F8F8",
        flex: 1,
        paddingTop: 30,
        paddingBottom: 200, // This is a hack to make the scrollview on the bottom the same color as the background
        marginBottom: -200, // This is a hack to make the scrollview on the bottom the same color as the background CREDIT: MY LUCKY ASS
        alignItems: "flex-start",
        padding: 20,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8
    },
    digitBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#6D56FA',

    },
    digitText: {
        fontFamily: 'Inter',
        fontSize: 24,
        color: '#6D56FA',
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 38,
    },
    errorDigitBox: {
        borderColor: 'red',
    },
    counterText: {
        fontFamily: 'Inter',
        fontSize: 14,
        color: '#6D6D6D',
        fontWeight: '400',
        lineHeight: 38,
    },
    demoContainer: {
        width: "100%",
        marginTop: -20
    }
});
