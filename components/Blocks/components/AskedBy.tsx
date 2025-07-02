import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";


function AskedBy({ view_count }: { view_count: number }) {
    const { t } = useTranslation();
    return (
        <View style={styles.countContainer}>
            <Image source={require('../../../assets/asked.png')} style={{ width: 19, height: 19, marginRight: 5 }} />
            <Text style={styles.viewCount}>{t('AskedBycount', { viewCount: view_count })}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    countContainer: {
        flex: 1,
        flexDirection: "row",
        marginTop: 20,
        paddingTop: 13,
        justifyContent: 'flex-start',
        borderTopWidth: 1,
        borderColor: "#EFEFEF",
        alignItems: 'center',

    },
    viewCount: {
        fontSize: 13,
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: '400',
        color: '#D47422',
        marginRight: 5,
    }
})

export default AskedBy;