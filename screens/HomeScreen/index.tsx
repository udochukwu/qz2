import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { NavigationProp, ParamListBase, Route, useFocusEffect } from '@react-navigation/native';
import { Text, View, StyleSheet, Platform, TouchableOpacity, Image, Pressable } from 'react-native';
import { RNHoleView } from 'react-native-hole-view';
import CameraView from '../../components/CameraView';
import ErrorScreen from '../../components/ErrorScreen';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import ProfileContext from '../../contexts/ProfileContext';
import inAppMessaging from "@react-native-firebase/in-app-messaging";
import CropLayer from '../../components/CropLayer';
import ScannerAnnimation from '../../components/ScannerAnimation';
import { useTranslation } from 'react-i18next';
import { Answer, answerProblemV5, continueAnswerProblemV5 } from '../../services/api/answerProblem';
import { useSocketContext } from '../../services/socket/';
import { ErrorResponse } from '../../services/api/common';
import * as Sentry from '@sentry/react-native';
import { SecondaryActions } from './components/SecondaryActions';
import { HeaderActions } from './components/HeaderActions';
import { NoTokensModal } from './components/NoTokensModal';
import { TokensClaimedModal } from './components/TokensClaimedModal';
import { TypedQuestionModal } from './components/TypedQuestionModal';
import { hapticEffect } from '../../services/common';
import { getRotatedCoordinates, initialDotCordinates } from './utils/constants';
import { LoadingPanel } from './components/LoadingPanel';
import { useDisplaySurvey } from '../DynamicSurvey/utils/useDisplaySurvey';
import { QUESTION_ERRORS, base64FromImageURI, cropGalleryImageBasedOnBox, cropImageBasedOnBox, cropImageBasedOnRatio } from './utils/image';
import { shouldShowFeedbackAlert, useFeedbackAlert } from './utils/feedback';
import { GalleryImage } from './components/GalleryImage';
import { NoVisionWarningModal } from './components/NoVisionWarning';
import Orientation from 'react-native-orientation-locker';
import { getUserId } from '../../services/storage';
import Superwall from '@superwall/react-native-superwall';
import { useGetUserId } from '../../hooks/useGetUserId';
import { Camera } from "react-native-vision-camera"
import Svg, { Path } from 'react-native-svg';
import { useBottomTabDisplay } from '../../contexts/BottomTabDisplayContext';


type Props = {
  navigation: NavigationProp<ParamListBase>;
  route: Route<"Home", any>;
}
type VisionFlow = {
  isVisionFlow: boolean,
  images_uri: string[],
  onContinue: () => void,
  onUpgrade: () => void,
  showWarningModal: boolean,
}

export const enum CameraModes {
  ALL_SUBJECTS = "All Subjects",
  READING_TASK = "Reading Task",
}

function HomeScreen({ navigation, }: Props) {
  const { t } = useTranslation();
  const {isBottomTabVisible} = useBottomTabDisplay()
  const { connect, socket } = useSocketContext();
  const context = useContext(ProfileContext);
  const [dotsCordinates, setDotsCordinates] = useState(initialDotCordinates);
  const [isCameraPaused, setIsCameraPaused] = useState(false);
  const [promptRetake, setPromptRetake] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const isMainPanelActive = useRef(false);
  const [isTypePanelActive, setIsTypePanelActive] = useState(false);
  const [typedQuestion, setTypedQuestion] = useState("");
  const [showNoTokenModal, setShowNoTokenModal] = useState(false);
  const [galleryImg, setGalleryImg] = useState("");
  const [errorState, setErrorState] = useState({ errorTitle: "", errorDiscription: "" });
  const [visionFlow, setVisionFlow] = useState<VisionFlow>({ isVisionFlow: false, images_uri: [], onContinue: () => { }, onUpgrade: () => { }, showWarningModal: false });
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [orientation, setOrientation] = useState<OrientationType>('PORTRAIT');
  const {userId} = useGetUserId()
  const [cameraMode, setCameraMode] = useState<CameraModes>(CameraModes.ALL_SUBJECTS)

  useEffect(() => {
      Orientation.lockToPortrait();

      const listener = (orientation: OrientationType) => {
          if (isCameraPaused) {
            return  
          }
          if ((orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') ) {
            setDotsCordinates(getRotatedCoordinates());
            setOrientation(orientation);
          } else {
            setDotsCordinates(initialDotCordinates);
            setOrientation("PORTRAIT");
          }
      }

      Orientation.addDeviceOrientationListener(listener);

      return () => {
        Orientation.removeDeviceOrientationListener(listener);
      };
  }, [isCameraPaused]);




  const closePanel = async () => {
    ///console.log("closing panel");
    isMainPanelActive.current = false;
    setIsCameraPaused(false);
    setIsButtonDisabled(false);
    setPromptRetake(false);
    setDotsCordinates(initialDotCordinates)
    setOrientation("PORTRAIT");
    setTypedQuestion("");
    setGalleryImg("");
    setVisionFlow({ isVisionFlow: false, images_uri: [], onContinue: () => { }, onUpgrade: () => { }, showWarningModal: false });
  };

  const openPanel = () => {
    ///console.log("opening panel");
    setIsButtonDisabled(false);
    isMainPanelActive.current = true;
    setPromptRetake(false);
  };

  const onButtonClicked = () => {
    setPromptRetake(true);
    setIsCameraPaused(true);
  }

  const onInitialVisionFlowContinue = async (request_id: string, forceAPI?: boolean) => {
    setVisionFlow({
      isVisionFlow: false, images_uri: [],
      //The continue after the warning
      onContinue: async () => {
        setVisionFlow({ ...visionFlow, showWarningModal: false })
        await continueAnswerProblemV5({ request_id: request_id, use_diagram: true, force_api: forceAPI }).then(response => {
          const data = response.data;
          handleAnswerFlow(data);
        }).catch((error: ErrorResponse) => {
          const successful = handleAnswerError(error, context.tokens, forceAPI);
          if (!successful) {
            //retry with force api set to true
            console.log("retrying with force api set to true")
            continueAnswerProblemV5({ request_id: request_id, use_diagram: true, force_api: true }).then(response => {
              const data = response.data;
              handleAnswerFlow(data);
            }).catch((error: ErrorResponse) => {
              handleAnswerError(error, context.tokens, true);
            });
          }
        })
      },
      onUpgrade: () => { },
      showWarningModal: true
    });
  }

  const setVistionFlowInitialState = (images_uri: string[], request_id: string, forceAPI?: boolean) => {
    setVisionFlow({
      isVisionFlow: true,
      images_uri: images_uri,
      onContinue: async () => {
        onInitialVisionFlowContinue(request_id, forceAPI);
      },
      onUpgrade: () => {
        closePanel();
        let details = new Map()
         details.set("userId", userId)
         if (context.revenueCatMetadata.is_native_paywall) {
          navigation.navigate('PaywallV2')
        } else {
          Superwall.shared.register({placement: "trigger_vision_upgrade", params: details})
        }
      },
      showWarningModal: false,
    })
  }

  const handleAnswerFlow = async (data: Answer) => {
    if (!isMainPanelActive.current) {
      //User closed the panel before getting the answer
      return;
    }
    if (!socket.connected && data.stream === true) {
      Sentry.captureException("Answer is marked for streaming while socket is disconnected.");
      throw new Error("Socket is not connected anymore but the answer is marked for streaming");
    }
    context.setTokens(data.tokens_left);
    navigation.navigate("Blocks", { blocks: data.blocks, templates: data.templates, request_id: data.request_id, max_chars_per_follow_up: data.max_chars_per_follow_up, stream: data.stream, suggestedFollowUps: data.suggested_follow_ups || [] });
    closePanel();
  }

  //Rertuns true if the error happened after forceAPI was set to true
  const handleAnswerError = (error: ErrorResponse, tokens: number, forceAPI?: boolean, is_pro?: boolean) => {
    console.error(error);
    if (!is_pro) {
      context.setTokens(tokens);
    }
    if (!forceAPI) {
      return false;
    }
    closePanel()
    setErrorState({
      errorTitle: t('homeScreen.errorTitle_errorGettingAnswer'), errorDiscription: error.error ?? t('homeScreen.errorDescription_retry'),
    });
    return true;
  }
  const askQuestion = async (text: string[], image?: string, forceAPI?: boolean) => {
    const is_pro = context.pro
    openPanel();
    let tokens = context.tokens;
    if (!is_pro) {
      context.setTokens(tokens - 1);
    }
    let successful = true;
    await answerProblemV5({ problem_data: text, is_pro, base64_image: image, force_api: forceAPI })
      .then(response => {
        const data = response.data;
        if (data.diagram_found) {
          setVistionFlowInitialState(data.cropped_diagram_image_urls!, data.request_id, forceAPI);
          return
        }
        handleAnswerFlow(data);
      })
      .catch((error: ErrorResponse) => {
        successful = handleAnswerError(error, tokens, forceAPI, is_pro);
      });
    if (!successful) {
      //retry with force api set to true
      console.log("retrying with force api set to true")
      await askQuestion(text, image, true);
    }
  }

  const getImage = async (media: { path: string }, fromGallery: boolean) => {
    try {
      var tempImagePath = media.path.startsWith("file://") ? media.path : "file://" + media.path;

      let rotation = 0;
      if (orientation === "LANDSCAPE-LEFT") {
        rotation = 90;
      } else if (orientation === "LANDSCAPE-RIGHT") {
        rotation = -90;
      }

      const reseizedImage = await ImageResizer.createResizedImage(tempImagePath, 1500, 1500, 'PNG', 100, rotation);
      let imagePath = reseizedImage.uri;
      let croppedImageToBoxPath;
      if (!fromGallery) {
        const croppedImageToRatioPath = await cropImageBasedOnRatio(imagePath);
        croppedImageToBoxPath = await cropImageBasedOnBox(croppedImageToRatioPath, dotsCordinates);
      }
      else {
        croppedImageToBoxPath = await cropGalleryImageBasedOnBox(imagePath, dotsCordinates);
      }
      const base64Data = await base64FromImageURI(croppedImageToBoxPath);
      const text = [] as string[];

      await askQuestion(text, base64Data);
    } catch (e) {
      console.log(e)
      retakePicture();
      const error = (e instanceof Error) ? e.message : null;
      switch (error) {
        // case QUESTION_ERRORS.NO_QUESTION_IN_IMAGE:
        //   setErrorState({ errorTitle: t('homeScreen.errorTitle_noQuestion'), errorDiscription: t('homeScreen.errorDescription_retry') });
        //   break;
        case QUESTION_ERRORS.TEXT_RECOGNITION_ERROR:
          setErrorState({ errorTitle: t('homeScreen.errorTitle_errorGettingQuestion'), errorDiscription: t('homeScreen.errorDescription_retry') });
          break;
        default:
          setErrorState({
            errorTitle: t('homeScreen.errorTitle_gettingImage'),
            errorDiscription: t('homeScreen.errorDescription_gettingImage') + e + " " + t('homeScreen.errorDescription_retry'),
          });
      }
    }
  }

  const onMediaCaptured = async (media: { path: string }, fromGallery: boolean = false) => {
    if (promptRetake && media && media.path) {
      //this means that we pressed the send button when we were in a "retake" state
      if (context.tokens <= 0 && context.pro == false) {
        setShowNoTokenModal(true)
        return;
      }
      setIsButtonDisabled(true);
      // send the picture 
      await getImage(media, fromGallery);
    }
    else {
      setIsButtonDisabled(false);
    }
  }

  const retakePicture = () => {
    hapticEffect();
    setPromptRetake(false);
    setIsCameraPaused(false);
    setIsButtonDisabled(false);
    setDotsCordinates(initialDotCordinates)
    setGalleryImg("");
  }

  useEffect(() => {
    (async () => {
      context.getProfileStatus();
      await inAppMessaging().setMessagesDisplaySuppressed(false).catch(err => console.log(err));
    })();
  }, []);

  // TODO: test this
  useFeedbackAlert();
  useDisplaySurvey(navigation);
  useFocusEffect(useCallback(() => connect(), []));

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        //To close the panel when we go to blocks screen
        closePanel();
        setIsFlashOn(false);
      };
    }, [])
  );

 
  const registerHomeViewSuperwalEvent = async () => {
    let cameraPermission = Camera.getCameraPermissionStatus(); 
    if(cameraPermission === "granted"){
      const userId = getUserId()
      const details = new Map()
      details.set("userId", userId)
      console.log("context.revenueCatMetadata.is_native_paywall", context.revenueCatMetadata.is_native_paywall)
      if (!shouldShowFeedbackAlert()) {
        if (context.revenueCatMetadata.is_native_paywall && !context.pro) {
          console.log("navigating to paywall")
          //timeout to make sure the paywall is loaded
          setTimeout(() => {
            navigation.navigate('PaywallV2')
          }, 1000)
        } else {
          console.log("registering homeview superwall event")
          Superwall.shared.register({placement: "homeview", params: details})
        }
      }
    }
  }

  useEffect(() => {
    registerHomeViewSuperwalEvent()
  }, [])


  let handleTypedQuestion = async () => {
    //close the keyboard
    setIsTypePanelActive(false);
    if (context.tokens <= 0 && !context.pro) {
      setShowNoTokenModal(true);
      return;
    }

    else {
      isMainPanelActive.current = true;

      await askQuestion([typedQuestion]);
    }
  }

  const onGallerySelection = (path: string) => {
    setGalleryImg(path);
    onButtonClicked();
  }

  const onGallerySend = () => {
    onButtonClicked();
    onMediaCaptured({ path: galleryImg }, true);
  }

  return (
    <View style={[styles.container, galleryImg ? styles.blackBackground : undefined, {marginBottom: isBottomTabVisible ? "18%" : undefined}]}>
      {!galleryImg &&
        <CameraView
          flashOn={isFlashOn}
          onMediaCaptured={onMediaCaptured}
          isCameraActive={!isCameraPaused}
          isButtonDisabled={isButtonDisabled}
          orientation={orientation}
          onButtonClicked={onButtonClicked} />
      }

      {!isCameraPaused &&
      <View style={[cameraMode === CameraModes.ALL_SUBJECTS ? {left: '35%'} : {left: 1}, styles.cameraSelectionContainer]}>

        <TouchableOpacity 
          testID="home-camera-mode-all-subjects"
          style={[cameraMode === CameraModes.ALL_SUBJECTS ? styles.cameraLabel : styles.deselectedCameraLabel, {marginRight: 20}]} 
          onPress={() => setCameraMode(CameraModes.ALL_SUBJECTS)}>
          <Text style={[cameraMode === CameraModes.ALL_SUBJECTS ? styles.cameraLabelText : styles.deselectedCameraLabelText]}>{t('homeScreen.allSubjects')}</Text>
        </TouchableOpacity>

      </View>}

      {isCameraPaused && cameraMode === CameraModes.ALL_SUBJECTS &&
          <Pressable testID="home-retake-button" style={styles.retakeButtonView} onPress={retakePicture}>
              <Image source={require('../../assets/exit.png')} style={styles.retakeButton} />
          </Pressable>
      }

      {galleryImg &&
        <GalleryImage image={galleryImg} onSend={onGallerySend} cameraSelection={cameraMode} />
      }


      {(isMainPanelActive.current || isCameraPaused) || cameraMode === CameraModes.READING_TASK
        ? null
        : <Text style={[
            styles.prompt,
            orientation === "LANDSCAPE-LEFT"? styles.rotatedLeftPrompt: undefined,
            orientation === "LANDSCAPE-RIGHT"? styles.rotatedRightPrompt: undefined,
            ]}>{t('homeScreen.prompt_takePicture')}</Text>}

      {
        !isCameraPaused && 
          <View style={[{position: 'absolute'},
            orientation === "LANDSCAPE-LEFT" || orientation === "LANDSCAPE-RIGHT" ? { right: '50%' } : { top: '41%' },
          ]}>
            <Svg width="31" height="32" viewBox="0 0 31 32" fill="none">
              <Path d="M15.4729 2.47266V29.3949M2.01178 15.9338H28.934" stroke="white" strokeWidth="3.84603" strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </View>
      }
      {
         <CropLayer
            dotsCordinates={dotsCordinates}
            setDotsCordinates={setDotsCordinates}
            promptRetake={promptRetake}
            orientation={orientation}
            onRetakePicture={retakePicture} />
      }

      {isCameraPaused && isButtonDisabled && <ScannerAnnimation dotsCordinates={dotsCordinates} />}
      {!isCameraPaused && <HeaderActions navigation={navigation} pro={context.pro} />}
      {!isCameraPaused &&
        <SecondaryActions
          flashOn={isFlashOn}
          onFlashToggle={() => setIsFlashOn(!isFlashOn)}
          onKeyboardPress={() => setIsTypePanelActive(true)}
          onGallerySelection={onGallerySelection} />
      }

      { Platform.OS === 'ios' && isCameraPaused &&
        <RNHoleView
        style={styles.OutOfFocusEffect}
        holes={[{
          x: dotsCordinates.topLeftDot.x,
          y: dotsCordinates.topLeftDot.y,
          width: dotsCordinates.topRightDot.x - dotsCordinates.topLeftDot.x,
          height: dotsCordinates.bottomLeftDot.y - dotsCordinates.topLeftDot.y,
          borderRadius: 10 }]} />
        }

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
        <ErrorScreen active={errorState.errorTitle != ""}
          onClose={() => {
            setErrorState({ errorTitle: "", errorDiscription: "" })
            context.getProfileStatus()
          }}
          onRetry={() => setErrorState({ errorTitle: "", errorDiscription: "" })}
          errorTitle={errorState.errorTitle}
          errorDiscription={errorState.errorDiscription} />
      </View>

      <LoadingPanel isActive={isMainPanelActive.current} onClose={closePanel} visionFlow={visionFlow} />

      <NoTokensModal
        navigation={navigation}
        isModalOpen={showNoTokenModal}
        onModalClose={() => setShowNoTokenModal(false)} />

      <NoVisionWarningModal
        navigation={navigation}
        isModalOpen={visionFlow.showWarningModal}
        onContinue={() => {
          visionFlow.onContinue();
        }
        }
      />
      <TokensClaimedModal
        pro={context.pro}
        isModalOpen={context.claimTokens}
        onModalClose={() => context.setClaimTokens(false)} />
        
      <TypedQuestionModal
        isModalOpen={isTypePanelActive}
        onSubmit={handleTypedQuestion}
        onModalClose={() => {
          setIsTypePanelActive(false)
          setTypedQuestion("")
        }}
        question={typedQuestion}
        onQuestionUpdate={setTypedQuestion} />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9ea5a8',
  
  },
  blackBackground: {
    backgroundColor: 'black',
  },
  maskOutter: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    //center 
    alignItems: 'center'
  },
  OutOfFocusEffect: {
    backgroundColor: '#353a3d7c',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  prompt: {
    zIndex: 1,
    position: 'absolute',
    top: "35%",
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: "600",
  },
  rotatedRightPrompt: {
    transform: [{ rotate: '-90deg' }],
    top: "50%",
    left: "-5%"
  },
  rotatedLeftPrompt: {
    transform: [{ rotate: '90deg' }],
    top: "50%",
    right: "-5%"
  },
  Camera: {
    width: "100%",
    height: "100%",
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    //rgb color that makes it looks like out of focus: 
  },
  TextStyle: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    marginTop: 10,
  },

  topLeftDot: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    zIndex: 1,
  },
  cameraLabel: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 50,
    zIndex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  deselectedCameraLabel: {
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  cameraLabelText: {
    color: 'white',
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  deselectedCameraLabelText: {
    color: 'rgba(255, 255, 255, 1)'
  },
  cameraSelectionContainer: {
    position: 'absolute',
    bottom: '18%',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 19,
  },
  retakeButtonView: {
    width: 35,
    height: 35,
    position: 'absolute',
    top: "5%",
    left: "5%",
    zIndex: 1,
  },
  retakeButton: {
      width: '100%',
      height: '100%',
}
});

export default HomeScreen
