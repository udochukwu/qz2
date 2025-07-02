import { SafeAreaView } from 'react-native-safe-area-context'
import { BackArrow } from '../components/BackArrow'
import { StyleSheet, Text, View } from 'react-native'
import Button from '../components/Button'
import AnimatedLottieView from 'lottie-react-native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useReferral from '../hooks/useReferral'

type ReferralScreenProps = {
    navigation: any
    route: any
}

function ReferralScreen({ navigation, route }: ReferralScreenProps) {
    const { t } = useTranslation();

    const params = route.params
    const number_of_tokens = params?.number_of_tokens || 0
    const message = `Get Quizard now! Take a photo of any problem and get instant answers. Use my link to get ${number_of_tokens} extra uses`
    const {referralCode, shareReferral} = useReferral(message)
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>

            <View style={styles.header}>
                <View style={{ position: "absolute", left: 30 }}>
                    <BackArrow onClick={() => navigation.goBack()} />
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{t('referralScreen.title')}</Text>
                </View>
            </View>

            <View style={styles.container}>

                <AnimatedLottieView source={require('../assets/paywall/quizardGift.json')} autoPlay style={{ width: 300, height: 300 }} loop={false} />


                <View style={{ width: "100%", marginBottom: 30, }}>
                    <Text style={styles.inviteText}>
                        {t('referralScreen.getFreeLightening', { tokens: number_of_tokens })}
                    </Text>
                    <Text style={styles.instructions}>
                        {t('referralScreen.instructions', { tokens: number_of_tokens })}
                    </Text>
                </View>
                <View>
                    <Button 
                    style={styles.button}
                    onPress={shareReferral} disabled={!referralCode}>
                        <Text style={styles.buttonText}>{t('referralScreen.inviteButton')}</Text>
                    </Button>
                </View>
            </View>
        </SafeAreaView >

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'space-between',

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
    inviteText: {
        fontFamily: 'Montserrat',
        fontStyle: 'normal',
        color: '#6D56FA',
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 20,
    },
    instructions: {
        color: '#8A8A8A',
        textAlign: 'center',
        fontFamily: 'Montserrat',
        fontWeight: '500',
        fontSize: 17,
    },
    button: {
        width: "100%",
        height: 60,
        backgroundColor: '#6D56FA',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        fontFamily: 'Montserrat',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 17,
        color: "white",
    },
})
export default ReferralScreen
