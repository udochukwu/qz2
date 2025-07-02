import { Animated, Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SwipeablePanel } from "./SwipeablePanel/Panel";
import Button from "./Button";
import AnimatedLottieView from "lottie-react-native";
export function ErrorLoadingAnimation({ ...props }) {

    return (
        <View style={[{ justifyContent: 'center', alignItems: 'center' }, props.style]} >
            <AnimatedLottieView
                source={require('../assets/lottie/error.json')}
                autoPlay
                loop
                style={{ height: 300, width: 300 }} />

        </View >
    );


}


function ErrorScreen({ errorTitle = "Error", errorDiscription = "Something went wrong, please retry later", active = false, onRetry = () => { }, onClose = () => { }, canRetry = false, ...props }) {


    const [panelProps, setPanelProps] = useState({
        fullWidth: true,
        openLarge: true,
        onlyLarge: true,
        showCloseButton: false,
        onClose: () => onClose(),
        onPressCloseButton: () => onClose(),
        closeOnTouchOutside: true,
    });

    //when retry is pressed we change the button to say "retrying" and disable it for 3 seconds
    const [retrying, setRetrying] = useState(false);



    return (
        <SwipeablePanel {...panelProps} isActive={active} style={styles.container} noScroll={false}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                <ErrorLoadingAnimation />
                <Text style={styles.meetQuizard}> {errorTitle} </Text>
                <Text style={styles.quizardDescription}>
                    {errorDiscription}
                </Text>
                {canRetry &&
                    <Button
                        style={styles.button}
                        disabled={retrying}
                        onPress={() => {
                            setRetrying(true);
                            onRetry();
                            setTimeout(() => {
                                setRetrying(false);
                            }, 5000);

                        }} >
                        <Text style={styles.buttonText}> {retrying ? "Retrying..." : "Retry"} </Text>
                    </Button>}
            </View>

        </SwipeablePanel>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 10,
        backgroundColor: '#F9F8F8',
        zIndex: 3,
    },
    meetQuizard: {
        fontFamily: 'Montserrat',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 30,
        lineHeight: 37,
        textAlign: 'center',


    },
    quizardDescription: {
        width: "80%",
        marginTop: 20,
        fontFamily: 'Nunito',
        fontStyle: 'normal',
        fontWeight: '300',
        fontSize: 17,
        lineHeight: 23,
        textAlign: 'center',
    },
    button: {
        marginTop: 40,
        width: "80%",
        height: 55,
        backgroundColor: '#6D56FA',
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',

    },
    buttonText: {
        fontFamily: 'Nunito',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
        color: '#FFFFFF',
    },
    quizard: {
        width: 100,
        height: 100,
    },
    loadingAnimation: {
        marginTop: 20,
        marginBottom: 20,
        width: 200,
        height: 300,
    },
    queueTimeText: {
        fontFamily: 'Nunito',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 15,
        lineHeight: 19,
        textAlign: 'center',
        color: '#1F2153',
        marginTop: 20,
    },
    shadow: {
        marginTop: 35,
        marginBottom: 20,
        backgroundColor: '#D9D9D9',
        borderRadius: 50,
        opacity: 0.5,
        width: 50,
        height: 50,
        zIndex: -1,
    },
    exclamation: {
        top: -30,
        right: 80
    },
    quetionmark: {
        top: -120,
        left: 80
    }
});

export default ErrorScreen;