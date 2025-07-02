



import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View, Text, Linking, Platform } from "react-native";
import FastImage from "react-native-fast-image";
import { blockstyles } from "../styles";
import ProfileContext from "../../../contexts/ProfileContext";

export interface ResourceContainerProps {
    request_id: string,
    resource_question: string,
    resource_answer: string,
    resource_url: string,
    resource_image_url: string,
    resource_header: string,
    resource_similarity: number,
}
function ResourceContainer({ request_id, resource_question, resource_answer, resource_url, resource_image_url, resource_header, resource_similarity }: ResourceContainerProps) {
    const { t } = useTranslation();
    const scale = Math.pow(resource_similarity / 100, 3);
    const hue = resource_similarity ? (120 * scale) : 0;
    const similarityColor = `hsl(${hue}, 100%, 40%)`;
    const context = useContext(ProfileContext);
    const onLinkPress = () => {
        Linking.openURL(resource_url);
        context.mixpanel?.track('Resource Clicked', {
            'Request ID': request_id,
            'Device Type': Platform.OS,
            'Resource Answer': resource_answer,
            'Resource Header': resource_header,
            'Resource Question': resource_question,
            'Resource Similarity': resource_similarity,
            'Resource Url': resource_url,
        });
    }

    return (
        <TouchableOpacity style={blockstyles.card} onPress={() => onLinkPress()} >
            <View style={styles.footer}>
                <View style={styles.linkContainer}>
                    <FastImage style={styles.image} source={{ uri: resource_image_url }} />
                    <Text style={styles.linkText} numberOfLines={1} ellipsizeMode='tail'>{resource_header}</Text>
                </View>
                <View style={styles.similarityContainer} >
                    <View style={{ height: 10, backgroundColor: similarityColor, borderRadius: 10, width: 10 }} />
                    <Text style={{ ...styles.similarityText, color: similarityColor }} numberOfLines={1} ellipsizeMode='tail'>{t(`Similarity`, { similarity: resource_similarity })}</Text>
                </View>
            </View>
            <View style={styles.questionContainer} >
                <Text style={styles.questionText} numberOfLines={2}>{resource_question}</Text>
            </View>
            <View style={styles.answerContainer} >
                <Text style={styles.answerText} numberOfLines={4}>{resource_answer}</Text>
            </View>


        </TouchableOpacity >
    )
}


const styles = StyleSheet.create({

    questionContainer: {
        minHeight: 50,
    },
    answerContainer: {
        minHeight: 100,
    },
    questionText: {
        fontFamily: 'Inter',
        fontSize: 13,
        fontWeight: Platform.OS === 'ios' ? '600' : '700',
        color: '#606060',
        marginTop: 15,

    },
    answerText: {
        fontFamily: 'Inter',
        fontSize: 13,
        fontWeight: '400',
        marginTop: 10,
        color: '#606060',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    similarityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: {
        width: 19,
        height: 19,
        marginRight: 10,
    },
    linkText: {
        fontSize: 12,
        color: '#2F80ED',
        fontFamily: 'Inter',
    },
    similarityText: {
        fontSize: 12,
        fontFamily: 'Inter',
    }

})


export default ResourceContainer;