import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Block from '../components/Blocks/Block';
import ChatInput from '../components/Blocks/components/ChatInput';
import ProfileContext from '../contexts/ProfileContext';
import {
  canSendFollowupQuestion,
  createShortQuestionBlock,
} from '../services/BlockServices';
import TryAgainContainer from '../components/Blocks/components/TryAgainContainer';
import BarWithGesture from '../components/BarWithGesture';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { postFollowupQuestionV2 } from '../services/api/followup';
import {
  offAnswerStreamError,
  onAnswerStreamError,
  useSocketContext,
} from '../services/socket/';
import { ErrorResponse } from '../services/api/common';
import {
  emitAnswerStream,
  offAnswerStreamResponse,
  onAnswerStreamResponse,
} from '../services/socket/answer';
import {
  emitFollowupStream,
  offFollowupResponse,
  offSuggestedFollowupResponse,
  onFollowupResponse,
  onSuggestedFollowupResponse,
  SuggestedFollowups,
} from '../services/socket/followup';
import ErrorScreen from '../components/ErrorScreen';
import StickyFollowUpsContainer from '../components/Blocks/StickyFollowUpsContainer';
import Superwall from '@superwall/react-native-superwall';
import { SubmitReportModal } from './HomeScreen/components/SubmitReportModal';
import ViewShot from "react-native-view-shot";

export const BlocksContext = createContext({
  shake: false,
  pressUnlock: (refferer: string) => { },
});

function BlocksScreen({ navigation, route }: { navigation: any; route: any }) {
  const { t } = useTranslation();
  const context = useContext(ProfileContext);
  const params = route.params;
  const templates = params.templates;
  const max_chars_per_follow_up = params.max_chars_per_follow_up;
  const [data, setData] = useState([...params.blocks]);
  const [suggestedFollowUps, setSuggestedFollowUps] = useState(params.suggestedFollowUps || []);
  const [loading, setLoading] = useState(false);
  const request_id = params.request_id;
  const is_pro = context.pro;
  const flatListRef = useRef<FlatList>(null);
  const [canSend, setCanSend] = useState(true);
  const [shakeToggle, setShakeToggle] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [retryText, setRetryText] = useState(''); // State to hold the text that failed previously
  const { connect, socket, disconnect } = useSocketContext();
  const autoScroll = useRef<{ enabled: boolean; lastTimeouts: number[] }>({
    enabled: false,
    lastTimeouts: [],
  });
  const [errorState, setErrorState] = useState({
    errorTitle: '',
    errorDiscription: '',
    onRetryFunction: () => { },
  });
  const [followUpVisible, setFollowUpVisible] = useState(false);
  const {revenueCatMetadata} = useContext(ProfileContext)
  const [showSubmitReportModal, setShowSubmitReportModal] = useState(false);
  const [screenShotURI, setScreenShotURI] = useState('')
  const ref = useRef();

  useFocusEffect(
    useCallback(() => {
      if (socket.connected && route.params.stream === true) {
        emitAnswerStream(socket, route.params.request_id);
      }
      connect();

      return () => disconnect();
    }, []),
  );

  const scrollDown = () => {
    if (autoScroll.current.enabled) {
      autoScroll.current.lastTimeouts.push(
        ScrollDown(flatListRef, 1000, false),
      );
    } else {
      autoScroll.current.lastTimeouts.forEach(lastTimeout =>
        clearTimeout(lastTimeout),
      );
      autoScroll.current.lastTimeouts = [];
    }
  };
  const hundleStreamError = (data: any) => {
    setErrorState({
      errorTitle: t('blockScreen.errorTitle'),
      errorDiscription: t('blockScreen.errorDiscription'),
      onRetryFunction: () => { },
    });
  };

  const handleSuggestedFollowupStream = (data: SuggestedFollowups) => {
    setSuggestedFollowUps(data.suggested_follow_ups || []);
  }

  useEffect(() => {
    onFollowupResponse(socket, scrollDown);
    onAnswerStreamResponse(socket, scrollDown);
    onAnswerStreamError(socket, hundleStreamError);
    onSuggestedFollowupResponse(socket, handleSuggestedFollowupStream)
    return () => {
      offFollowupResponse(socket, scrollDown);
      offAnswerStreamResponse(socket, scrollDown);
      offAnswerStreamError(socket, hundleStreamError);
      offSuggestedFollowupResponse(socket, handleSuggestedFollowupStream)
    };
  }, []);

  const toggleRetry = (text: string) => {
    setLoading(false);
    setFetchError(true);
    setRetryText(text);
  };

  const onSend = async (text: string) => {
    Keyboard.dismiss();
    if (!canSend) {
      setShakeToggle(!shakeToggle);
      return;
    }
    if (fetchError && retryText) {
      // If there is an error and a new message is sent, clear the error
      setFetchError(false);
      setData(prevData => {
        // Remove the last block where the error occurred
        let newData = [...prevData];
        newData.pop();
        return newData;
      });
    }
    const follow_up = createShortQuestionBlock({ templates, text });
    setLoading(true);
    setData(prevData => [
      ...prevData,
      { block_type: 'short_question', block_data: follow_up },
    ]);
    ScrollDown(flatListRef, 200);
    setSuggestedFollowUps([]);

    await postFollowupQuestionV2({ request_id, is_pro, follow_up_question: text })
      .then(response => {
        let followup = response.data;
        setLoading(false);
        if (followup.stream && response.data.followup_id) {
          followup.blocks[0].block_data.answer_id = response.data.followup_id;
        }

        setData(prevData => [...prevData, ...followup.blocks]);
        ScrollDown(flatListRef, 200);
        setFetchError(false);
        setRetryText('');
        if (!canSendFollowupQuestion(followup.blocks)) {
          setCanSend(false);
          setShakeToggle(prev => !prev);
          return;
        }

        if (followup.stream && response.data.followup_id) {
          emitFollowupStream(socket, response.data.followup_id);
        } else if (followup.suggested_follow_ups) {
          setSuggestedFollowUps(followup.suggested_follow_ups);
        }
      })
      .catch((error: ErrorResponse) => {
        toggleRetry(text);
      });
  };

  const retryFunction = () => {
    if (retryText) {
      onSend(retryText); // Retry the request if there was an error
    }
  };

  const toggleAutoScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    autoScroll.current.enabled =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 10;
  };

  const onFollowupSelection = (followUp: string) => {
    onSend(followUp);
  }

  const getBlocks = useCallback(() => {
    if (data.at(-1).block_type === 'follow_up' || loading || suggestedFollowUps.length === 0) {
      return data;
    }
    return [...data,
      { 
        block_type: 'follow_up', 
        block_data: { 
          suggestedFollowUps, 
          onSelected: onFollowupSelection,
        }
      }
    ];
  }, [data, suggestedFollowUps]);
  
  const onVisibleItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const lastItem = viewableItems.at(-1)?.item.block_type;
    if (lastItem === 'follow_up' && followUpVisible) {
      return;
    }
    if (lastItem === 'follow_up') {
      setFollowUpVisible(true);
    } else {
      setFollowUpVisible(false);
    }
  }, [setFollowUpVisible]);

  return (
    <ViewShot ref={ref} style={styles.container} options={{ fileName: "Your-File-Name", format: "jpg", quality: 0.9 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
        keyboardVerticalOffset={80}>
        <SafeAreaView style={styles.container}>
          <SubmitReportModal
              request_id={request_id}
              screenshotURI={screenShotURI}
              isModalOpen={showSubmitReportModal}
              onModalClose={() => setShowSubmitReportModal(false)} />
          <BarWithGesture onSwipeDown={() => navigation.navigate('Home')} />
          <BlocksContext.Provider
            value={{
              shake: shakeToggle,
              pressUnlock: (refferer: string) => {
                if (revenueCatMetadata.is_native_paywall) {
                  navigation.navigate('PaywallV2')
                } else {
                  Superwall.shared.register({ placement: `trigger_pro_${refferer}` });
                }
              },
            }}>
            <FlatList
              ref={flatListRef}
              style={styles.scroll}
              data={getBlocks()}
              renderItem={({ item }) => (
                <Block
                  openReportModal={() => {
                    ref.current.capture().then(uri => {
                      setScreenShotURI(uri)
                    });

                    setShowSubmitReportModal(true)}}
                  request_id={request_id}
                  block_type={item.block_type}
                  block_data={item.block_data}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={
                fetchError ? (
                  <TryAgainContainer
                    text={t('errorMessageRetry')}
                    onClick={() => retryFunction()}
                  />
                ) : null
              }
              onScroll={toggleAutoScroll}
              onViewableItemsChanged={onVisibleItemsChanged}
            />
          </BlocksContext.Provider>
          <View>
            {suggestedFollowUps && suggestedFollowUps.length > 0 &&
              <StickyFollowUpsContainer
                visible={suggestedFollowUps.length > 0 && !followUpVisible && !loading && canSend}
                explainItText={suggestedFollowUps[0]}
                onExplainPress={() => onSend(suggestedFollowUps[0])}
                onRecommendedPress={() => flatListRef.current?.scrollToEnd({ animated: true })}
              />
            }
            <View style={{ ...styles.chatInputContainer, marginTop: loading ? 30 : 0 }}>
              <ChatInput
                onSend={onSend}
                loading={loading}
                placeholder={t('AskFollowUp')}
                max_chars_per_follow_up={max_chars_per_follow_up}
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
            }}>
            <ErrorScreen
              active={errorState.errorTitle != ''}
              onClose={() => {
                context.setTokens(context.tokens + 1);
                navigation.goBack();
              }}
              onRetry={errorState.onRetryFunction}
              errorTitle={errorState.errorTitle}
              errorDiscription={errorState.errorDiscription}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ViewShot>
  );
}

function ScrollDown(ref: any, time: number, animated: boolean = true): number {
  return setTimeout(() => {
    ref.current?.scrollToEnd({ animated });
  }, time);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    width: '100%',
  },
  scroll: {
    width: '100%',
  },
  chatInputContainer: {
    width: '100%',
    backgroundColor: 'transparent',
  },
});

export default BlocksScreen;
