
import React, { useContext, useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import Button from '../Button'
import { BlocksContext } from '../../screens/BlocksScreen';
import { useTranslation } from 'react-i18next';

function NeedProContainer({ block_text }: { block_text: string }) {
    const { t } = useTranslation();
    const shakeAnimation = useRef(new Animated.Value(0)).current;
    const { shake, pressUnlock } = useContext(BlocksContext);

    const shakeIt = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
        ]).start();
    }

    useEffect(() => {
        shakeIt();
    }, [shake])


    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.text}>{block_text}</Text>
                <Animated.View style={{ width: "80%", transform: [{ translateX: shakeAnimation }] }}>
                    <Button style={styles.button} onPress={() => pressUnlock("follow_up")}>
                        <Text style={styles.buttonText}> {t('UnlockPro')}</Text>
                    </Button>
                </Animated.View>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 12,

    },
    innerContainer: {
        width: '100%',
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 10,
        borderColor: '#E4E4E4',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 3, // for android
        padding: 20,
        backgroundColor: 'white',
    },
    text: {
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 14,
        color: '#606060',
        textAlign: 'center',
    },
    button: {

        paddingVertical: 14,
        backgroundColor: '#6D56FA',
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,

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
})

export default NeedProContainer