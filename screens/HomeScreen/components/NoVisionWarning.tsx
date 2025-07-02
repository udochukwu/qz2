import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import AnimatedLottieView from "lottie-react-native";
import Button from "../../../components/Button";
import { useContext, useEffect } from "react";
import ProfileContext from "../../../contexts/ProfileContext";
import Superwall from "@superwall/react-native-superwall";
import { useGetUserId } from "../../../hooks/useGetUserId";

type Props = {
    navigation: NavigationProp<ParamListBase>;
    isModalOpen: boolean;
    onContinue: () => void;
}

export const NoVisionWarningModal = ({ navigation, isModalOpen, onContinue }: Props) => {
    const {userId} = useGetUserId()
    const context = useContext(ProfileContext);

    const UpgradeToPro = () => {
        let details = new Map()
        details.set("userId", userId)
        if (context.revenueCatMetadata.is_native_paywall) {
            navigation.navigate('PaywallV2')
        } else {
            Superwall.shared.register({placement: "trigger_vision_upgrade", params: details})
        }
       
    }
    useEffect(() => {
        if (isModalOpen) {
            context.mixpanel?.track("Page View", 
            { 
            'Page Title': 'No Vision Warning Modal',
            'Device Type': Platform.OS
            });
        }
    }, [isModalOpen])

    return (
        <Modal
            animationType="slide"
            visible={isModalOpen}
            transparent={true}
            onRequestClose={onContinue}
        >
            <Pressable style={{ flex: 1, justifyContent: "center", padding: 10 }} onPress={onContinue}>
                <Pressable style={{ justifyContent: "center" }}>
                    <NoVisionWarning onContinue={onContinue} onUpgrade={UpgradeToPro} />
                </Pressable>
            </Pressable>
        </Modal>
    );
}


function NoVisionWarning({ onContinue, onUpgrade }: { onContinue: () => void, onUpgrade: () => void }) {
    const { t } = useTranslation()
    return (
        <View style={styles.container}>
            <AnimatedLottieView source={require("../../../assets/lottie/error.json")} autoPlay loop={false} style={{ width: "80%" }} />
            <Text style={styles.title}>
                {t("NoVisionWarning.title")}
            </Text>
            <Text style={styles.subtitle}>
                {t("NoVisionWarning.subtitle")}
            </Text>
            <Button onPress={onUpgrade} style={styles.button} >
                <Text style={styles.buttonText}>
                    {t("NoVisionWarning.upgrade")}
                </Text>
            </Button>
            <Button onPress={onContinue} color="secondary" style={styles.button} >
                <Text style={styles.buttonTextSecondary}>
                    {t("NoVisionWarning.continue")}
                </Text>
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
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
        marginTop: -30,
        marginBottom: 8

    },
    subtitle: {
        fontFamily: 'Montserrat',
        fontSize: 14,
        color: "#5D5D5D",
        textAlign: "center",
        marginBottom: 12
    },
    button: {
        width: "90%",
        height: 55,
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