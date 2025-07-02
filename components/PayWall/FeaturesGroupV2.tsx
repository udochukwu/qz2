import React, {  useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import FeatureContainerV2 from "./FeatureContainerV2";


export default function FeaturesGroupV2({ }) {

    const { t } = useTranslation();
    var features_list = [
        {
            resource: require("../../assets/paywall/orb.json"),
            title: t('purchaseScreen.feature1.title'),
            discription: t('purchaseScreen.feature1.description'),
        },
        {
            resource: require("../../assets/paywall/target.json"),
            title: t('purchaseScreen.feature2.title'),
            discription: t('purchaseScreen.feature2.description'),
        },
        {
            resource: require("../../assets/paywall/resources.json"),
            title: t('purchaseScreen.feature3.title'),
            discription: t('purchaseScreen.feature3.description'),
        },
        {
            resource: require("../../assets/paywall/vision.json"),
            title: t('purchaseScreen.feature5.title'),
            discription: t('purchaseScreen.feature5.description'),
        }
    ]




    return (
        <View style={styles.listContainer}>
            {
                features_list.map((item, index) => {
                    return (
                        <FeatureContainerV2 key={index} resource={item.resource} title={item.title} discription={item.discription} />
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    listContainer: {
        alignSelf: 'stretch', // Stretch to the parent's width
        gap: 10,
    },
})

