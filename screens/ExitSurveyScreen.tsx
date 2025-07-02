import { Image, TouchableOpacity, StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Platform, SafeAreaView, Dimensions, TouchableWithoutFeedback, Keyboard, ScrollView, UIManager, LayoutAnimation, Linking } from "react-native";

import React, { useCallback, useEffect } from "react";
import Button from "../components/Button";
import { FetchFillUnsubReason, FetchManageSubscription } from "../services/backendCalls";
import OptionBox from "../components/OptionBox";
import { useTranslation } from "react-i18next";


function ExitSurveyScreen({ navigation }) {

    const [selected, setSelected] = React.useState([-1]);
    const [otherOptionText, setOtherOptionText] = React.useState("Other");
    const { t } = useTranslation()

    const options_list = [
        t('exitSurveyScreen.option1'),
        t('exitSurveyScreen.option2'),
        t('exitSurveyScreen.option3'),
        t('exitSurveyScreen.option4'),
        t('exitSurveyScreen.option5'),
        t('exitSurveyScreen.option6'),
        t('exitSurveyScreen.option7')
    ]

    const [options, setOptions] = React.useState(options_list.sort(() => Math.random() - 0.5));

    const onChangeText = useCallback((text) => {
        setOtherOptionText(text);
    }, []);


    const [keyboardVisible, setKeyboardVisible] = React.useState(false);

    if (
        Platform.OS === 'android' &&
        UIManager.setLayoutAnimationEnabledExperimental
    ) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    // ...

    React.useEffect(() => {

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidHideListener.remove();
        };
    }, []);
    function onUnsubscribe() {
        const finalOptions = [...options, otherOptionText];
        FetchFillUnsubReason(finalOptions.filter((item, index) => selected.includes(index)));
        
        // Call FetchManageSubscription and handle the response
        FetchManageSubscription().then(response => {
            if (response && response.redirect_url) {
                // Use the URL from the API if available
                Linking.openURL(response.redirect_url);
            } else {
                // Fallback to the hardcoded URL if no URL is returned
                Linking.openURL('https://lovely-vault-f15.notion.site/How-to-Unsubscribe-from-Pro-6acc5687164f4fe6b21a2e7f778866af');
            }
            navigation.navigate("Home");
        }).catch(error => {
            // Handle any errors by using the fallback URL
            console.error("Error fetching subscription management URL:", error);
            Linking.openURL('https://lovely-vault-f15.notion.site/How-to-Unsubscribe-from-Pro-6acc5687164f4fe6b21a2e7f778866af');
            navigation.navigate("Home");
        });
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingTop: 15 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}

                style={{ flex: 1, alignItems: "center" }} >
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    zIndex: 1,
                    paddingBottom: 10,
                    paddingTop: 15
                }} >
                    <View style={{ width: "15%", justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.exitContainer} onPress={() => navigation.goBack()}>
                            <Image source={require('../assets/exit.png')} style={styles.exit} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.header}>
                    <Text style={styles.subtitle}>{t('exitSurveyScreen.subtitle')}</Text>
                </View>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ ...styles.container, width: Dimensions.get('window').width, height: Dimensions.get('window').height, justifyContent: "space-around" }}
                    >

                        <View style={styles.optionsContainer}>
                            {
                                (!keyboardVisible) && options.map((option, index) => (

                                    <OptionBox
                                        key={index}
                                        text={option}
                                        selected={selected.includes(index)}
                                        onPress={() => {
                                            if (selected.includes(index)) {
                                                setSelected(selected.filter((item) => item !== index));
                                            } else {
                                                setSelected([...selected, index]);
                                            }
                                        }}
                                    />
                                ))}
                            <TouchableOpacity style={{ ...styles.optionContainer, backgroundColor: selected.includes(options.length) ? "#6D56FA1A" : "#fff", borderColor: selected.includes(options.length) ? "#6D56FA" : "#CECECE", borderWidth: 2 }}
                                onPress={() => {
                                    if (selected.includes(options.length)) { setSelected(selected.filter((item) => item !== options.length)); } else { setSelected([...selected, options.length]); }
                                }}>
                                <TextInput
                                    onChangeText={onChangeText}
                                    value={otherOptionText === t('Other') ? "" : otherOptionText}
                                    placeholder={t('exitSurveyScreen.otherOptionText')}
                                    placeholderTextColor="#606060"
                                    multiline={true}
                                    numberOfLines={2}
                                    onFocus={() => {
                                        if (!selected.includes(options.length)) {
                                            setSelected([...selected, options.length]);
                                        }
                                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

                                        setKeyboardVisible(true);

                                    }}
                                //selectTextOnFocus={true}
                                />
                            </TouchableOpacity>
                        </View>


                    </ScrollView>

                </TouchableWithoutFeedback>
                <Button style={styles.button} onPress={onUnsubscribe}>
                    <Text style={styles.buttonText}>{t('exitSurveyScreen.unsubscribeButtonText')}</Text>
                </Button>
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        // justifyContent: "space-around",
        paddingHorizontal: 10,

    },
    header: {
        width: "100%",
        paddingHorizontal: 10,
        justifyContent: "center",
        marginBottom: 20,
    },
    exitContainer: {
        width: 30,
    },
    exit: {
        width: 30,
        height: 30,

    },
    subtitle: {
        fontFamily: 'Inter',
        fontSize: 19,
        fontWeight: '500',
        letterSpacing: 0,
        textAlign: 'left',
        color: '#606060',
    },
    optionsContainer: {
        width: "100%",
        alignItems: "center",
        flex: 1,
        // justifyContent: "center",
    },
    optionContainer: {
        width: "100%",
        backgroundColor: "#F2F2F2",
        borderRadius: 15,
        padding: 10,
        paddingVertical: 15,
        marginBottom: 10,
        justifyContent: "center",
    },

    optionText: {
        fontFamily: 'Nunito',
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 19,
        color: '#000000',
    },
    button: {
        width: "90%",
        height: 55,
        backgroundColor: '#6D56FA',
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        fontFamily: 'Nunito',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 19,
        color: "white",
    },
})


export default ExitSurveyScreen;