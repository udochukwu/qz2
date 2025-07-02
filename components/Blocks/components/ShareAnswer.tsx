import { StyleSheet, Text, TouchableOpacity, Share, Platform } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Path, Svg } from "react-native-svg";



function ShareAnswer({ answer_url }: { answer_url: string }) {
    const { t } = useTranslation();
    const onShare = async () => {
        try {
            const result = await Share.share({
                message: t('AnswerToQuestion') + " " + answer_url,
                url: answer_url,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {

        }
    };
    return (
        <TouchableOpacity style={styles.container} onPress={() => { onShare() }}>
            <Svg width="24" height="24" fill="none">
                <Path d="M19.3808 3.82031L11.6903 11.5103" stroke="#6D6D6D" strokeWidth="1.5" strokeLinecap="round" />
                <Path d="M9.58534 3.59961V3.59961C7.93997 3.59961 7.11728 3.59961 6.45442 3.82604C5.219 4.24805 4.24866 5.21839 3.82665 6.45381C3.60022 7.11667 3.60022 7.93936 3.60022 9.58473V12.4296C3.60022 15.1908 3.60022 16.5714 4.22171 17.5856C4.56947 18.153 5.0466 18.6302 5.6141 18.9779C6.62828 19.5994 8.00886 19.5994 10.77 19.5994H13.6149C15.2603 19.5994 16.083 19.5994 16.7458 19.373C17.9813 18.951 18.9516 17.9807 19.3736 16.7452C19.6 16.0824 19.6 15.2597 19.6 13.6143V13.6143" stroke="#6D6D6D" strokeWidth="1.5" strokeLinejoin="round" />
                <Path d="M19.6 8.9375L19.6 4.03817C19.6 3.79554 19.4033 3.59884 19.1607 3.59884L14.2613 3.59884" stroke="#6D6D6D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.text}>{t('Share')}</Text>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',

    },
    text: {
        fontSize: 13,
        fontFamily: 'Inter',
        fontWeight: '500',
        marginLeft: 4,
        color: '#6D6D6D',
        lineHeight: 15,
    }
})


export default ShareAnswer;