import AnimatedLottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
type FeatureContainerProps = {
    resource: string;
    title: string;
    discription: string;
};


function FeatureContainer({ resource, title, discription }: FeatureContainerProps) {


    return (
        <View style={{ ...styles.featureContainer }}>
            <View style={styles.featureEmpojiContainer}>
                <AnimatedLottieView source={resource} style={{ width: 120, height: 120 }} loop={true} autoPlay />
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
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        marginBottom: 5,

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
    },

    featureTextContainer: {
        width: "90%",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        textAlign: "center",
        marginTop: 16,
    },
    featureTitle: {
        fontFamily: 'Nunito',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 20,
        color: '#000',
        textAlign: "center",

    },
    featureDiscription: {
        marginTop: 10,
        fontFamily: 'Nunito',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 17,
        lineHeight: 19,
        color: '#6D6D6D',
        textAlign: "center",

    }
})

export default FeatureContainer;