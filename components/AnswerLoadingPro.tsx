import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';
const PopLoading = require('../assets/lottie/Loading.json');



function AnswerLoadingPro() {
    const { t } = useTranslation();
    const LOADING_TEXT_OPTIONS = [t('lookingForResources')]
    // Default to the first loading text option, if it exists
    const [loadingText, setLoadingText] = React.useState(LOADING_TEXT_OPTIONS[0]);
    //There are 80 facts for each language, that are stored at key funfact1, funfact2, funfact3, etc.
    const [funFact] = React.useState(() => {
        try {
            const funFactNumber = Math.floor(Math.random() * 80) + 1;
            return t(`funfact${funFactNumber}`)
        }
        catch (e) {
            console.log(e)
            return ""
        }

    });

    // Rotate through the loading text options
    React.useEffect(() => {
        let loadingTextIndex = 0;
        const interval = setInterval(() => {
            loadingTextIndex = (loadingTextIndex + 1) % LOADING_TEXT_OPTIONS.length;
            setLoadingText(LOADING_TEXT_OPTIONS[loadingTextIndex]);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <View style={{ height: "50%", width: "100%" }} >
                <LottieView source={PopLoading} loop autoPlay />
            </View>
            <View style={{ alignItems: 'center', width: "90%", marginTop: 30 }}>
                {loadingText && <Text style={styles.loadingText}>{loadingText}</Text>}
            </View>
            <View style={{ alignItems: 'center', width: "90%", marginTop: 5 }}>
                <Text style={styles.fun_fact}>{t('funFact') + ": " + funFact}</Text>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "95%",
        justifyContent: 'center',
        alignItems: 'center'

    },
    loadingText: {
        justifyContent: 'center',
        alignItems: 'center',
        color: '#A0A0A0',
        textAlign: 'center',
        fontSize: 23,
        fontFamily: 'Montserrat',
        fontWeight: '700',
        lineHeight: 36,
    },
    fun_fact: {
        justifyContent: 'center',
        alignItems: 'center',
        color: '#A0A0A0',
        textAlign: 'center',
        fontSize: 15,
        fontFamily: 'Inter',
        fontWeight: '500',
        lineHeight: 24,
        marginTop: 10,

    }
});
export default AnswerLoadingPro;