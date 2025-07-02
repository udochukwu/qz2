import { useEffect, useState } from 'react';
import { Modal, Pressable, View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTranslation } from "react-i18next";
import { TextInput } from 'react-native-gesture-handler';
import { getProReferral, setProReferral } from '../services/storage';
import { checkReferralCode } from '../services/api/referral';

type Props = {
  isModalOpen: boolean;
  onModalClose: () => void;
};

export const EnterReferralModal = ({onModalClose, isModalOpen}: Props) => {
  const { t } = useTranslation();
  const [referralCode, setReferralCode] = useState<string>(getProReferral() ?? '');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setError('');
  }, [referralCode])

  const onSave = async () => {
    Keyboard.dismiss();
    try {
      const referralStatus = await checkReferralCode(referralCode);
      if (referralStatus.data.ok) {
        setProReferral(referralCode);
        onModalClose();
      }
    } catch(error) {
      if (error.status && error.status === 400) {
        setError(t('enterReferralModal.wrongCode'))
      } else {
        setError(t('enterReferralModal.tryAgain'))
      }
    }
  }

  return (
    <Modal animationType="fade" visible={isModalOpen} transparent={true} onRequestClose={onModalClose}>
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 500 })}
      style={{flex: 1}}>
        <Pressable style={styles.overlay} onPress={onModalClose}>
          <Pressable style={styles.topModalContainer} onPress={() => {}}>
            <FastImage source={require('../assets/celebrating-quizard.png')} style={styles.giftImage} />
             <View style={styles.inviteStatus}>
                <Text style={styles.inviteStatusText}>
                  🎁 Claim your gift
                </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={styles.title}>{t('enterReferralModal.title')}</Text>
                <Text style={styles.subtitle}>{t('enterReferralModal.subtitle')}</Text>
                <TextInput
                    autoCapitalize = {"characters"}
                    placeholderTextColor={'#A0A0A0'}
                    style={styles.input}
                    onChangeText={text => setReferralCode(text)}
                    value={referralCode}
                    multiline={true}
                    editable={true}
                    textAlignVertical="center"
                />
                {error && <Text style={styles.errorText}>{error}</Text>}
                <Pressable style={styles.bottomModalContainer}>
                  <TouchableOpacity style={styles.shareButton} onPress={onSave} disabled={referralCode == ''}>
                    <Text style={styles.saveButtonText}>{t('enterReferralModal.save')}</Text>
                  </TouchableOpacity>
                </Pressable>
              </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  topModalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    gap: 20,
  },
  bottomModalContainer: {
    width: '100%',
    backgroundColor: '#633CEF',
    borderRadius: 10,
    paddingTop: 0,
    marginBottom: 10,
    alignItems: 'center',
    zIndex: 2,
  },
  giftImage: {
    width: 100,
    height: 100,
    marginTop: -80,
  },
  subtitleContainer: {
    width: '70%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '400',
    color: 'rgba(109, 109, 109, 1)',
    marginTop: 10,
    marginBottom: 40,
  },
  inviteStatus: {
    backgroundColor: 'rgba(99, 60, 239, 0.15)',
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  inviteStatusText: {
    fontSize: 14,
    color: 'rgba(99, 60, 239, 1)',
  },
  shareButton: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'inter',
  },
  input: {
    flex: 1,
    minHeight: 40,
    minWidth: '90%',
    borderWidth: 1,
    borderColor: '#CECECE',
    backgroundColor: 'white',
    borderRadius: 14,
    color: '#606060',
    fontWeight: '400',
    fontFamily: 'Inter',
    textAlign: 'center',
    textAlignVertical:  'center',
    lineHeight: 30,
    fontSize: 30,
    marginBottom: 30,
  },
  errorText: {
    marginTop: -25,
    marginBottom: 30,
    color: 'red'
  }
});
