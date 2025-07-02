import React, { Component, useEffect, useRef } from 'react';
import { Animated, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Button from './Button';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useTranslation } from 'react-i18next';



function LoadingAnimation({ ...props }) {
    //animation of "quizard floating in the air" going up and down

    const [animation, setAnimation] = React.useState(new Animated.Value(0));
    //we also want a shadow eclipse under the quizard getting bigger and smaller
    const [shadow, setShadow] = React.useState(new Animated.Value(0));

    const [sparkles, setSparkles] = React.useState(new Animated.Value(0));
    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(sparkles, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: false,
                }),
                Animated.timing(sparkles, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: false,
                }),
            ])
        ).start();

    }, []);

    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 10],
    });

    const scaleShadow = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.9, 1],
    });

    const scaleSparkle = sparkles.interpolate({
        inputRange: [0, 1],
        outputRange: [0.95, 1],
    });


    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', ...props.style }}>
            <Animated.View style={{ transform: [{ translateY }] }} >
                <Image source={require('../assets/quizard.png')} style={styles.quizard} resizeMethod="resize" resizeMode='contain' />
            </Animated.View>
            <Animated.View style={{ transform: [{ scale: scaleSparkle }] }} >
                <Image source={require('../assets/sparkles.png')} style={styles.sparkles1} />
                <Image source={require('../assets/sparkles.png')} style={styles.sparkles2} />
            </Animated.View>
            <Animated.View style={{ ...styles.shadow, transform: [{ scale: scaleShadow }, { scaleX: 2 }] }} />

        </View>
    );


}
export { LoadingAnimation }




function LoadingBar({ timeRemaining, onSkipClick }) {
    const { t } = useTranslation()

    const [percentage, setPercentage] = React.useState(2);
    const [timer, setTimer] = React.useState(0);
    const [skipTimer, setSkipTimer] = React.useState(0);
    const initTimeRemaining = useRef(timeRemaining.current)

    //this will initiate the initial value of timeRemaining 
    useEffect(() => {
        if (timeRemaining.current !== undefined && initTimeRemaining.current === undefined) {
            initTimeRemaining.current = timeRemaining.current
            return
        }

        if ((initTimeRemaining.current - (timeRemaining.current)) >= timer) {
            setTimer(initTimeRemaining.current - (timeRemaining.current))
        }


    }, [timeRemaining.current])




    React.useEffect(() => {


        if (skipping.current) {
            //the user is skipping the queue so just wait 7 seconds and then go 
            if (percentage >= 100) {
                return
            }
            const skip_initTimeRemaining = 7
            const interval = setInterval(() => {
                setSkipTimer(skipTimer + 0.05);
                setPercentage((skipTimer / (skip_initTimeRemaining)) * 100);
            }, 50);
            return () => clearInterval(interval);



        } else {

            if (percentage >= 100) {
                return
            }
            const interval = setInterval(() => {
                setTimer(timer + 0.05);
                setPercentage((timer / (initTimeRemaining.current)) * 100);

            }, 50);
            return () => clearInterval(interval);

        }

    }, [timer, skipTimer, initTimeRemaining.current]);

    let getTimeText = (d) => {
        if (skipping.current)
            return t('loadingBar.skipQueueMessage')
        d = Number(d);
        const h = Math.floor(d / 3600);
        const m = Math.floor(d % 3600 / 60);
        const s = Math.floor(d % 3600 % 60);
        const qtime = ((h + m + s > 0) ? t('loadingBar.queueTimePrefix') : t('loadingBar.answerComingMessage'));
        const hDisplay = h > 0 ? h + (h == 1 ? t('loadingBar.hourDisplaySingular') : t('loadingBar.hourDisplayPlural')) : "";
        const mDisplay = m > 0 ? m + (m == 1 ? t('loadingBar.minuteDisplaySingular') : t('loadingBar.minuteDisplayPlural')) : "";
        const sDisplay = s > 0 ? s + (s == 1 ? t('loadingBar.secondDisplaySingular') : t('loadingBar.secondDisplayPlural')) : "";
        return qtime + hDisplay + mDisplay + sDisplay;
    }

    let generateQueueTitle = (timeRemaining) => {
        //every 10 seconds, change the title from an array of titles
        const titles = t('loadingBar.queueTitles');
        if (skipping.current)
            return t('loadingBar.noQueueMessage')
        const titleKey = `loadingBar.queueTitle${(Math.floor(timeRemaining / 10) % 3) + 1}`;
        return t(titleKey)
    }

    const skipping = useRef(false)

    let skipQueue = async () => {
        skipping.current = true
        // skiperTimer starting point will be 
        setSkipTimer(10 * percentage / 100)
        //add haptic feedback
        const options = {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false,
        }
        ReactNativeHapticFeedback.trigger("notificationSuccess", options);


        onSkipClick()

    }
    let getPercentage = () => {
        if (percentage >= 100) {
            return 100
        }
        return percentage
    }
    const urgency = useRef(0)

    let urgencyFunction = () => {


        const interval = setInterval(() => {
            urgency.current = urgency.current + Math.floor(Math.random() * 3) + 1
        }, 2000);
        return () => clearInterval(interval);

    }
    useEffect(() => {
        urgencyFunction()
    }, [])


    return (
        <SafeAreaView style={{ height: "100%", justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.text}>{generateQueueTitle(timer)}</Text>
            <LoadingAnimation style={styles.loadingAnimation} />
            <View style={{ width: "80%", height: 20, backgroundColor: 'lightgray', borderRadius: 10 }}>

                <View style={{
                    width: `${getPercentage()}%`,
                    height: 20, backgroundColor: skipping.current ? '#1F2153' : '#6D56FA',
                    borderRadius: 10
                }} />
            </View>
            <Text style={styles.timeRemainingText}>{getTimeText(initTimeRemaining.current - timer)}</Text>
            {/* <Text style={styles.remainingTokensText}>Dont want to wait in the queue?</Text> */}
            <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", padding: 5, marginTop: 10, marginBottom: 15 }}>
                <Button style={styles.button} onPress={skipQueue} disabled={skipping.current} disabledColor={"#1F2153"}>
                    <Text style={styles.buttonText}> {t('UnlockPro')}</Text>
                </Button>
                <Text style={styles.urgencyText}>{urgency.current + t('loadingBar.usersSkippedMessage')}</Text>

            </View >
        </SafeAreaView >
    );
}


const styles = StyleSheet.create({
    text: {
        fontFamily: 'Montserrat',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 26,
        lineHeight: 32,
        textAlign: 'center',
        color: '#2F2F2F',
        marginTop: 5,
    },
    quizard: {
        //width: 150,

        //height: "100%",
        height: 150,
    },
    loadingAnimation: {
        width: 200,
        height: "60%",
    },
    timeRemainingText: {
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
        backgroundColor: '#D9D9D9',
        borderRadius: 50,
        opacity: 0.5,
        width: 50,
        height: 50,
        zIndex: -1,
    },
    remainingTokensText: {
        //         font-family: 'Nunito';
        // font-style: normal;
        // font-weight: 700;
        // font-size: 14px;
        // line-height: 19px;
        // text-align: center;
        fontFamily: 'Nunito',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
        color: '#9E9E9E',
        marginTop: "8%",

    },
    urgencyText: {
        fontFamily: 'Nunito',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
        color: '#9E9E9E',
        marginTop: 5,

    },
    button: {
        width: "100%",
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
    sparkles1: {
        top: -30,
        right: 80
    },
    sparkles2: {
        top: -120,
        left: 80
    }

});


export default LoadingBar;