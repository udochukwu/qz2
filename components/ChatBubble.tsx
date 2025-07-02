import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

function ChatBubble({ message }) {

    return (
        <View style={styles.bubbleContainer}>
            <Image source={require("../assets/bubbletip.png")} style={styles.arrow} resizeMode="contain" />

            <View style={styles.bubble}>
                <Text style={styles.bubbleText}>{message}</Text>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    bubbleContainer: {
        flexDirection: 'row',
        width: '100%',
        alignSelf: 'flex-start',
        marginLeft: 0,
        marginBottom: 20,
    },
    bubble: {
        backgroundColor: 'transparent',
        borderRadius: 5,
        padding: 10,
        borderWidth: 2,
        marginLeft: 16,
        borderColor: '#E4E4E4',
        //width: 100% - 20px 
        flex: 1
    },
    bubbleText: {
        color: '#7E7E7E',
        fontFamily: 'Nunito',
        fontWeight: '700',
        fontSize: 18,
    },
    arrow: {
        height: 20, width: 20,
        left: 0,
        top: 15,
        position: 'absolute',
        zIndex: 2,
    },
});

export default ChatBubble;
