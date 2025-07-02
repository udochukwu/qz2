import { ActivityIndicator, Alert, Dimensions, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import Button from "../../../components/Button";
import { useState } from "react";
import { useGetUserId } from "../../../hooks/useGetUserId";
import { SwipeablePanel } from "../../../components/SwipeablePanel/Panel";
import { t } from "i18next";
import { sendReport, uploadImageToPreSignedUrl, uploadScreenshot } from "../../../services/slackReporter";

type Props = {
    isModalOpen: boolean;
    onModalClose: () => void;
    screenshotURI: string;
    request_id: string;
}

const screenHeight = Dimensions.get('window').height

export const SubmitReportModal = ({ request_id, isModalOpen, onModalClose, screenshotURI }: Props) => {
    const { userId } = useGetUserId()
    const [reportText, setReportText] = useState('')
    const [isReportSuccessful, setIsReportSuccessful] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [panelProps, setPanelProps] = useState({
        fullWidth: true,
        openLarge: true,
        onlyLarge: true,
        showCloseButton: false,
        closeOnTouchOutside: true,
    });

    const ReportReceieved = () => {
        return (
            <View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'center', rowGap: 20, paddingHorizontal: 15 }}>
                <Image source={require("../../../assets/paper-plane.png")} />
                <Text style={{
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    fontSize: 18,
                    textAlign: 'center',
                    lineHeight: 25,

                }}>{t('blockScreen.reportReceivedText')}</Text>
                <Text style={{
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    fontSize: 14,
                    textAlign: 'center',
                    color: 'rgba(0, 0, 0, 0.5)',
                    lineHeight: 14,
                    letterSpacing: 0.18

                }}>{t('blockScreen.reportReceivedSmallText')}</Text>
                <Button
                    style={styles.button}
                    onPress={() => {
                        setIsReportSuccessful(false)
                        onModalClose()
                    }
                    }>
                    <Text style={styles.buttonText}>{t('blockScreen.button_goToHome')}</Text>
                </Button>
            </View>

        )
    }

    const onSubmit = async () => {
        if (userId) {
            setIsLoading(true)
            // get file name from screenshot URL
            const imageArray = screenshotURI.split('/')
            const fileName = imageArray[imageArray.length - 1]

            uploadScreenshot(fileName)
            .then(async (response) => {
                const uploadImageResponse = await uploadImageToPreSignedUrl(response.data.presigned_url[0], screenshotURI)

                if (uploadImageResponse) {
                    await sendReport(request_id, userId, reportText, response.data.final_image_url)
                    setIsReportSuccessful(true)
                } else {
                    Alert.alert('Unable to upload screenshot, please try again later')
                }
                setIsLoading(false)

            })
            .catch(() => {
                Alert.alert('Unable to send report, please try again later')
                setIsLoading(false)
            });
            
        }
    }

    return (
        <SwipeablePanel {...panelProps} isActive={isModalOpen}
            onClose={() => {
                setIsReportSuccessful(false)
                setReportText('')
                onModalClose()
            }
            } style={[styles.container, !isReportSuccessful ? { top: screenHeight > 700 ? '53%': '50%' } : { top:  screenHeight > 700 ? '38%':'30%' }]} noScroll={false}>
            {
                isReportSuccessful
                    ? <ReportReceieved />
                    : <View style={styles.reportContainer}>
                        <Text style={styles.reportTitleText}>{t('blockScreen.reportAProblem')}</Text>

                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={styles.centeredView} >
                            <View style={styles.modalView} >
                                <TextInput
                                    placeholderTextColor='#A0A0A0'
                                    style={styles.input}
                                    onChangeText={setReportText}
                                    value={reportText}
                                    multiline={true}
                                    numberOfLines={3}
                                    editable={true}
                                    textAlignVertical="center"
                                    placeholder={t('blockScreen.placeholder_brieflyExplain')}
                                />
                                <View style={styles.screenshotContainer}>
                                    <Image resizeMode="contain" source={{ uri: screenshotURI }} width={49} height={100} borderRadius={6} />
                                </View>
                                <Button
                                    style={styles.button}
                                    onPress={() => onSubmit()}
                                    
                                    disabled={isLoading}>
                                        {
                                            isLoading 
                                            ? <ActivityIndicator testID="loader" color={'white'} animating={isLoading} size="small" />
                                            :  <Text style={styles.buttonText}>{t('blockScreen.button_sendReport')}</Text>
                                        }
                                </Button>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
            }

        </SwipeablePanel>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        zIndex: 3,
        display: 'flex',
        justifyContent: 'flex-start',
    },
    modalView: {
        width: "100%",
        alignContent: "center",
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    button: {
        width: "100%",
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '8%',
        bottom: 30,
        alignSelf: 'flex-end'
    },
    buttonText: {
        fontFamily: 'Inter',
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 19,
        textAlign: 'center',
        color: '#FFFFFF',
    },
    input: {
        width: '100%',
        height: 50,
        marginTop: 20,
        color: '#606060',
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'Inter',
    },
    screenshotContainer: {
        width: 55,
        height: 102,
        borderRadius: 6,
        borderWidth: 1.2,
        borderColor: 'rgba(109, 86, 250, 1)',
        alignSelf: 'flex-start',
        alignItems: 'center',
        marginTop: '10%',
        marginBottom: 30
    },
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignContent: "center",
    },
    reportContainer: {
        padding: 20,
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        width: '100%'
    },
    reportTitleText: {
        fontFamily: 'Inter',
        fontWeight: '600',
        fontSize: 18,
        lineHeight: 18
    }
})
