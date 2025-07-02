import React, { useState, useCallback } from "react";
import { Platform, StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import LottieView from 'lottie-react-native';

interface ChatInputProps extends TextInputProps {
    onSend: (text: string) => void;
    loading: boolean;
    max_chars_per_follow_up: any;
}

const PopIn = require('../../../assets/lottie/Pop-In.json');
const PopLoading = require('../../../assets/lottie/Pop-Loading.json');
const PopOut = require('../../../assets/lottie/Pop-Out.json');

const ChatInput = (props: ChatInputProps) => {
    const [text, setText] = useState("");
    const [animation, setAnimation] = useState(null);
    const [sendToggle, setSendToggle] = useState(false);
    if (props.loading && animation === null) {
        setAnimation(PopIn);
    } else if (!props.loading && animation === PopLoading) {
        setAnimation(PopOut);
    }
    const onAnimationFinish = useCallback(() => {
        if (animation === PopIn) {
            setAnimation(PopLoading);
        } else if (animation === PopOut) {
            //wait for 1 second before setting animation to null
            setTimeout(() => {
                setAnimation(null);
            }, 1000);
        }
    }, [animation]);


    const fillRatio = text.length / props.max_chars_per_follow_up;
    const sendImage = require('../../../assets/sendarrow.png');
    const disabledSendImage = require('../../../assets/notsendarrow.png')

    return (
        <View style={{ backgroundColor: 'transparent' }}>
            {animation &&
                <View style={styles.lottieAnimation}>
                    <LottieView
                        source={animation}
                        autoPlay
                        loop={animation === PopLoading}
                        onAnimationFinish={onAnimationFinish} // listen for when the animation ends to change the state
                    />
                </View>}
            <View style={styles.container}>
                <TextInput
                    placeholderTextColor={'#A0A0A0'}
                    {...props}
                    style={[styles.input, props.style]}
                    onChangeText={text => setText(text)}
                    value={text}
                    multiline={true}
                    editable={true}
                    textAlignVertical="center"
                />
                <TouchableOpacity
                    onPress={() => {
                        props.onSend(text);
                        //to avoid a race condition (where it autocorrects the text after sending)
                        setTimeout(() => {
                            setText("");
                        }, 100);
                    }}
                    disabled={text.length == 0 || props.loading || fillRatio > 1}>
                    <FastImage style={styles.image} source={props.loading || fillRatio > 1 ? disabledSendImage : sendImage} />
                </TouchableOpacity>
            </View>
            {fillRatio > 0.8 &&
                <View style={styles.warningContainer}>
                    <Text style={styles.warning}>
                        {text.length}/{props.max_chars_per_follow_up} characters remaining
                    </Text>
                </View>}
        </View>
    );
};

const styles = StyleSheet.create({

    lottieAnimation: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 52 : 72,
        height: 50,
        width: 50,
        left: 10,
        zIndex: 2,
    },
    container: {
        backgroundColor: '#F6F6F6',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingBottom: Platform.OS === 'ios' ? 0 : 10,
        borderTopWidth: 1,
        borderTopColor: '#CECECE',

    },
    input: {
        flex: 1,
        minHeight: 40,
        borderWidth: 1,
        borderColor: '#CECECE',
        backgroundColor: 'white',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingTop: 10,
        marginRight: 10,
        color: '#606060',
        fontWeight: '400',
        fontFamily: 'Inter',
    },
    image: {
        width: 35,
        height: 35
    },
    warningContainer: {
        width: '100%',
        paddingHorizontal: 10,
        paddingTop: 5,

    },
    warning: {
        color: '#FF9B9B',
        fontFamily: 'Inter',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: 14,
    },
})

export default ChatInput
