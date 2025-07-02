
import React from 'react'
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Pressable, Image, useWindowDimensions } from 'react-native'
import Svg, { Path } from 'react-native-svg';

function Label({ text, color = "#5465FF", ...rest }: { text: string, color?: string }) {
    //when you press the label, it will show the description above it
    const { t } = useTranslation();


    return (
        <View >

            <View style={{ ...styles.labelSubject, backgroundColor: color, borderColor: color }} {...rest}>
                {text === t('Confident') &&
                    <Svg width="12" height="12" fill="none">
                        <Path d="M2.2344 5.6157L4.71016 8.52612L9.41266 3.47266" stroke="white" strokeWidth="1.3" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                }
                <Text style={styles.questionSubject}> {text} </Text>
            </View>
        </View >

    );
}

const styles = StyleSheet.create({

    labelSubject: {
        borderWidth: 1,
        borderRadius: 50,
        paddingVertical: 6,
        paddingHorizontal: 10,

        //no overflow
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',

    },
    questionSubject: {
        fontSize: 10,
        fontFamily: 'Inter',
        fontWeight: '600',
        color: 'white',

    }
});
export default Label;
