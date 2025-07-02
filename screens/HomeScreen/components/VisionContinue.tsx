import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';
import Button from '../../../components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagesCarousel from '../../../components/Blocks/components/ImagesCarousel';
import { useTranslation } from 'react-i18next';
import ProfileContext from '../../../contexts/ProfileContext';

type ContinueProps = {
    images_uri: string[];
    onContinue: () => void;
    onUpgrade: () => void;
}
export const VisionContinue = ({ images_uri, onContinue, onUpgrade }: ContinueProps) => {
    const { t } = useTranslation()
    
    const context = useContext(ProfileContext);
    useEffect(() => {
        context.mixpanel?.track("Page View", 
        { 
          'Page Title': 'Initial Vision Modal',
          'Device Type': Platform.OS
        });
        
    }, [])

    return (
        <View style={styles.container}>
            <View style={{ width: "100%", height: "50%", alignItems: 'center', justifyContent: 'center' }}>
                <ImagesCarousel image_urls={images_uri} />

            </View>

            <View style={{ width: "100%", height: "50%", alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.description}>{t('visionFlow.description')}</Text>

                <View style={styles.buttonsContainer}>
                    <Button style={styles.button} onPress={() => onUpgrade()} color='primary'>
                        <Text style={styles.buttonText}> {t('visionFlow.upgrade')} </Text>
                    </Button>
                    <TouchableOpacity style={styles.SecondaryButton} onPress={() => onContinue()} color='secondary'>
                        <Text style={styles.buttonTextSecondary}> {t('visionFlow.continue')} </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )


}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F9F8F8',
        alignItems: 'center',
        alignContent: 'space-between',
        height: "100%",
    },
    description: {
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 20,
        color: '#24184E',
        width: "90%",
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    buttonsContainer: {
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 0,
        marginBottom: 10,
    },
    button: {
        width: "90%",
        height: 55,
        backgroundColor: '#6D56FA',
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    SecondaryButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    buttonText: {
        fontFamily: 'Nunito',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 19,
        textAlign: 'center',
        color: '#FFFFFF',
    },
    buttonTextSecondary: {
        fontFamily: 'Nunito',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 16,
        textAlign: 'center',
        color: '#888',
    }
});