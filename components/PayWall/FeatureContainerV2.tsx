import AnimatedLottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
type FeatureContainerProps = {
    resource: string;
    title: string;
    discription: string;
};


export default function FeatureContainerV2({ resource, title, discription }: FeatureContainerProps) {


    return (
        <View style={{ ...styles.featureContainer }}>
            <View style={styles.featureEmpojiContainer}>
                <AnimatedLottieView source={resource} style={{ width: 65, height: 65 }} loop={false} autoPlay />
            </View>
            <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureDiscription}>{discription}</Text>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    featureContainer: {
        flexDirection: 'row', // To have the emoji and text side by side
        alignItems: 'center', // Align items vertically
    },
    featureEmpoji: {
        fontSize: 90,
        textAlign: "center",

    },
    featureEmpojiContainer: {
        backgroundColor: "#EDEEFF",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 70,
        textAlign: "center",
        marginRight: 10,

    },

    featureTextContainer: {
        justifyContent: "center",
        alignContent: "center",
        textAlign: "center",
    },
    featureTitle: {
        fontFamily: 'Nunito',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 17,
        color: '#000',

    },
    featureDiscription: {
        fontFamily: 'Nunito',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 15,
        lineHeight: 19,
        color: '#6D6D6D',

    }
})
