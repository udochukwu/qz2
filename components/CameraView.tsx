import { useIsFocused, useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View, Alert } from 'react-native'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
import { useCameraDevices, Camera } from "react-native-vision-camera"
import { SendButton } from './SendButton'
import { CameraButton } from './CameraButton'
import { getUserId, incrementAppOpensCount } from '../services/storage'
import Superwall from '@superwall/react-native-superwall'
import ProfileContext from '../contexts/ProfileContext'

//USE  RNHOLES TO ADD HOLES TO THE Parent VIEW so you can use buttons and other stuff
const CameraView = ({ onMediaCaptured, onButtonClicked, isButtonDisabled, isCameraActive, flashOn, orientation }) => {
    const { t } = useTranslation()
    const isFocused = useIsFocused()
    const [isDenied, setIsDenied] = React.useState(false)
    const [isGranted, setIsGranted] = React.useState(false)
    const [alerted, setAlerted] = React.useState(false)
    const {revenueCatMetadata, pro} = useContext(ProfileContext)
    const navigation = useNavigation()
  
    let getPermission = async () => {
        try {
            let cameraPermission = Camera.getCameraPermissionStatus();
            setIsGranted(cameraPermission === 'granted');                
            if (cameraPermission !== 'granted') {
                await Camera.requestCameraPermission();
                cameraPermission = Camera.getCameraPermissionStatus(); // Recheck after requesting
                setIsGranted(cameraPermission === 'granted');                
                //to triger going to paywall
                const userId = getUserId()
                const details = new Map()
                details.set("userId", userId)
                if (revenueCatMetadata.is_native_paywall && !pro) {
                    navigation.navigate('PaywallV2')
                } else {
                    Superwall.shared.register({placement: "trigger_pro_badge", params: details})
                }
                incrementAppOpensCount();
            }
            if (cameraPermission === 'denied' || cameraPermission === 'not-determined') {
                setIsDenied(true);
            } else {
                setIsDenied(false);
            }
        } catch (error) {
            setIsDenied(true);
        }
    };

    useEffect(() => {
        if (isGranted)
            return
        getPermission()
    }, [isGranted])
    const availableDevices = useCameraDevices()
    const back_devices_check = availableDevices.filter((device) => device.position === 'back')
    const isWideAngleCameraAvailable = back_devices_check.filter((device) => device.physicalDevices.includes('wide-angle-camera')).length > 0 ? true : false
    const device = isWideAngleCameraAvailable ? back_devices_check.filter((device) => device.physicalDevices.includes('wide-angle-camera'))[0] : back_devices_check[0]
    const camera = React.useRef<Camera>(null)
    const [media, setMedia] = React.useState(null)

    if (device == null) return (
        <View style={[StyleSheet.absoluteFill, { flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" }]}>
            <View style={{ flex: 1 }} />
            <View style={[
                { flex: 1, justifyContent: "center", alignItems: "center", padding: 15, marginBottom: 50, },
                orientation === "LANDSCAPE-LEFT"? styles.rotatedLeftDisplay: undefined,
                orientation === "LANDSCAPE-RIGHT"? styles.rotatedRightDisplay: undefined,
                ]}>
                <Text style={{ color: "white", fontSize: 20 }}>{t('camera.noCameraFound')}</Text>
                {
                    <Text style={{ color: "white", fontSize: 16, textAlign: "center"}}>
                        {t('camera.noCameraFoundContact')}
                    </Text>
                }
            </View>
        </View>
    )
    if (!isGranted || isDenied) {
        if (!alerted && isDenied) {
            setAlerted(true)
            Alert.alert(
                t('alert.cameraAccessDenied'),
                t('alert.allowCameraAccess'),
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
        }

        return (
            <View 
              style={[
                StyleSheet.absoluteFill, 
                { 
                  flex: 1, 
                  backgroundColor: "black", 
                  justifyContent: "center", 
                  alignItems: "center" 
                }
              ]}
            >
              <View style={{ flex: 1 }} />
              <View 
                style={{ 
                  flex: 1, 
                  justifyContent: "center", 
                  alignItems: "center", 
                  padding: 15 
                }}
              >
                {isDenied && (
                  <>
                    <Text style={{ color: "white", fontSize: 20 }}>
                      {t('camera.accessDenied')}
                    </Text>
                    <Text 
                      style={{ 
                        color: "white", 
                        fontSize: 16, 
                        textAlign: "center" 
                      }}
                    >
                      {t('camera.accessDeniedInstructions')}
                    </Text>
                  </>
                )}
              </View>
            </View>
          );
    }
    const toggleTakePicture = () => {
        const options = {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false
        };
        ReactNativeHapticFeedback.trigger('impactLight', options)
        if (!isCameraActive) {
            //disable the button for 3 seconds
            onButtonClicked()
            return onMediaCaptured(media) //this means we send the previous photo (no retake)
        }
        ///console.log("take photo")
        camera.current?.takePhoto({ enableShutterSound: false }).then((photo) => {
            onMediaCaptured(photo)
            setMedia(photo)
            onButtonClicked()
        }
        ).catch((error) => {
            ///console.log(error)
        }
        )
    }

    return (
        <>
            <Camera
                torch={flashOn? 'on' : 'off'}
                id={`camera-${isGranted}`}
                style={[StyleSheet.absoluteFill, styles.cameraSytle]}
                isActive={isCameraActive && isFocused}
                photo={true}
                ref={camera}
                photoQualityBalance="quality"
                device={device}
            />
            {!isCameraActive && <SendButton testID="camera-send-button" disabled={isButtonDisabled} onPress={toggleTakePicture} />}
            {isCameraActive && <CameraButton testID="camera-capture-button" onPress={toggleTakePicture} />}
        </>
    )
}

const styles = StyleSheet.create({
    cameraSytle: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    rotatedRightDisplay: {
        transform: [{ rotate: '-90deg' }],
        top: "-18%",
        right: "-18%",
      },
      rotatedLeftDisplay: {
        transform: [{ rotate: '90deg' }],
        top: "-18%",
        right: "25%"
      },
})

export default React.memo(CameraView)
