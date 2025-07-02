import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, Platform } from "react-native";
import React from "react";
import { blockstyles } from "./styles";
import { useContext } from "react";
import ProfileContext from "../../contexts/ProfileContext";
import { BlurView } from "@react-native-community/blur";
import Button from "../Button";
import { Circle, Path, Rect, Svg } from "react-native-svg";

// Fake placeholder data that will be blurred behind the main content
const fake_ai_comparisons = [
    {
        model: "ChatGPT",
        accuracy: "92%",
        response: "This is a placeholder response from ChatGPT that would show detailed analysis...",
        icon: "🤖"
    },
    {
        model: "Gauth",
        accuracy: "88%", 
        response: "Placeholder Gauth response with step-by-step solution methodology...",
        icon: "📚"
    },

];

function LockedSuperAIContainer() {
    const context = useContext(ProfileContext);

    const handleUpgrade = () => {
        context.mixpanel?.track('Super AI Clicked');
        Alert.alert(
            "Coming Soon",
            "This feature will be available in the next update!",
            [{ text: "OK" }]
        );
    };

    const isSuperAIExperiment = context.revenueCatMetadata.rc_experiment_group == "exp_SuperAI_true"
    
    if (!isSuperAIExperiment) {
        return null;
    }
    

    return (
        <View style={styles.container}>
            <View style={styles.resourcesContainer}>
                <View style={blockstyles.resourceCard}>
                    {/* Fake placeholder content that will be blurred */}
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderTitle}>AI Model Comparison Results</Text>
                        {fake_ai_comparisons.map((item, index) => (
                            <View key={index} style={styles.placeholderItem}>
                                <View style={styles.placeholderHeader}>
                                    <Text style={styles.placeholderIcon}>{item.icon}</Text>
                                    <Text style={styles.placeholderModel}>{item.model}</Text>
                                    <Text style={styles.placeholderAccuracy}>{item.accuracy}</Text>
                                </View>
                                <Text style={styles.placeholderResponse}>{item.response}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                <BlurView
                    blurType="light"
                    blurAmount={8}
                    style={styles.BlurView} >
                    <View style={styles.resourcesBlurredInside}>
                        {/* Original Super AI content - now visible on top */}
                        <View style={styles.contentContainer}>
                            <View style={{ flexDirection: 'column', gap: 5, alignItems: 'center', justifyContent: 'center', marginTop: -4 }}>
                                <Image source={require('../../assets/super_ai/super_ai.png')} style={{ height: 80, width: 66, overflow: 'visible', marginBottom: 12 }} />
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 30 }}>
                                    <Text style={{ fontSize: 18, textAlign: 'center', fontWeight: '500' }}>
                                    Compare Quizard's answer to every AI model
                                    </Text>
                                </View>
                                <Text style={{
                                    textAlign: 'center',
                                    fontSize: 12,
                                    color: '#0000095',
                                    paddingHorizontal: 60,
                                    marginTop: 4,
                                }}>
                                    Answers from Gauth, SnapAI, ChatGPT, Perplexity + more
                                </Text>
                                <Button style={styles.button} onPress={handleUpgrade}>
                                    <SuperAILock />
                                    <Text style={styles.buttonText}>Unlock Super AI</Text>
                                </Button>

                            </View>
                        </View>
                    </View>
                </BlurView>
            </View>
        </View>
    );
}

function SuperAILock() {
    return (
        <Svg width="20" height="20" viewBox="0 0 104 104" fill="none">
            <Rect width="103.5" height="103.5" rx="51.75" fill="white" />
            <Path d="M36.8397 45.0955V30.6372C36.8397 22.4022 43.5154 15.7264 51.7504 15.7264V15.7264C59.9854 15.7264 66.6612 22.4022 66.6612 30.6372V31.6252" stroke="#633CEF" strokeWidth="6.7275" strokeLinecap="round" />
            <Rect x="27.3226" y="46.345" width="48.855" height="37.5808" rx="7.51615" stroke="#633CEF" strokeWidth="6.7275" />
            <Circle cx="51.7509" cy="61.5589" r="5.90556" fill="#633CEF" />
            <Path d="M51.9125 65.3969V71.4327" stroke="#633CEF" strokeWidth="6.7275" strokeLinecap="round" />
        </Svg>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginTop: -8
    },
    resourcesContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    BlurView: {
        width: '98%',
        height: '98%',
        position: 'absolute',
        borderRadius: 16,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    resourcesBlurredInside: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
        width: '100%',
        height: '100%',
    },
    button: {
        height: 40,
        backgroundColor: '#633CEF',
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 12,
    },
    buttonText: {
        fontFamily: 'Nunito',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
        color: '#FFFFFF',
        marginLeft: 10,
    },
    contentContainer: {
        padding: 20,
    },
    placeholderContainer: {
        padding: 0,
    },
    placeholderTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    placeholderItem: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    placeholderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    placeholderIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    placeholderModel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    placeholderAccuracy: {
        fontSize: 14,
        fontWeight: '500',
        color: '#28a745',
    },
    placeholderResponse: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    title: {
        fontSize: 16,
        color: '#606060',
        fontFamily: 'Inter',
        fontWeight: '600',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#808080',
        fontFamily: 'Inter',
    },
});

export default LockedSuperAIContainer;
