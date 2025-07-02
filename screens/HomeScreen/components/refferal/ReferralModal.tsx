import React, { useContext, useState } from 'react';
import { Modal, Pressable, View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Purchases from 'react-native-purchases';
import { useTranslation } from 'react-i18next';

import ReferralDivider from './ReferralDivider';
import CheckMarkCircle from './CheckMarkCircle';
import useReferral from '../../../../hooks/useReferral';
import { getReferralStatus, redeemReferralOffer } from '../../../../services/api/referral';
import ProfileContext from '../../../../contexts/ProfileContext';
import { setIsProLocally } from '../../../../services/storage';

type Props = {
  isModalOpen: boolean;
  onModalClose: () => void;
};

export const ReferralModal = ({ onModalClose, isModalOpen }: Props) => {
  const [referralsNeeded, setReferralsNeeded] = useState(0);
  const [referralsCompleted, setReferralsCompleted] = useState(0);
  const [freeDuration, setFreeDuration] = useState(0);
  const userContext = useContext(ProfileContext);
  const { t } = useTranslation();

  const getDurationUnit = (count: number) => t('referralModal.monthUnit', { count });

  const customMessage = t('referralModal.shareMessage', { freeDuration });

  const { referralCode, shareReferral } = useReferral(customMessage, true);

  useFocusEffect(() => {
    getReferralStatus().then(response => {
      setReferralsNeeded(response.data.required_pro);
      setReferralsCompleted(response.data.pro_referrals);
      setFreeDuration(response.data.free_months);
    });
  });

  const redeemOffer = async () => {
    const response = await redeemReferralOffer();
    console.log(response);
    if (response.data.code) {
      const url = `https://apps.apple.com/redeem?ctx=offercodes&id=1667996582&code=${response.data.code}`;
      Purchases.invalidateCustomerInfoCache();
      Linking.openURL(url);
      setIsProLocally(true);
    } else if (response.data.ok) {
      Purchases.invalidateCustomerInfoCache();
      setIsProLocally(true);
      userContext.getProfileStatus();
      onModalClose();
      Alert.alert(t('referralModal.successTitle'), t('referralModal.successMessage'));
    }
  };

  const isRedeemable = referralsCompleted >= referralsNeeded;

  return (
    <Modal animationType="fade" visible={isModalOpen} transparent={true} onRequestClose={onModalClose}>
      <Pressable style={styles.overlay} onPress={onModalClose}>
        <Pressable style={styles.topModalContainer} onPress={() => {}}>
          <FastImage source={require('../../../../assets/gift.png')} style={styles.giftImage} />
          {isRedeemable && (
            <View style={styles.inviteStatus}>
              <Text style={styles.inviteStatusText}>{t('referralModal.claimGift')}</Text>
            </View>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {isRedeemable 
                ? t('referralModal.openGiftNow') 
                : t('referralModal.getFreeMonths', { 
                    freeDuration, 
                    additional: userContext.pro ? t('referralModal.additional') : '',
                    monthUnit: getDurationUnit(freeDuration)
                  })}
            </Text>
            <Text style={styles.subtitle}>
              {isRedeemable
                ? t('referralModal.earnedGiftMessage', { referralsNeeded })
                : t('referralModal.whenNewUsersSubscribe', { referralsNeeded })}
            </Text>
          </View>
          <View style={styles.progressContainer}>
            {Array.from({ length: referralsNeeded }).map((_, index) => (
              <CheckMarkCircle key={index} isChecked={index < referralsCompleted} />
            ))}
          </View>
          {!isRedeemable && (
            <View style={styles.inviteStatus}>
              <Text style={styles.inviteStatusText}>
                {t('referralModal.invitesLeft', { count: referralsNeeded - referralsCompleted })}
              </Text>
            </View>
          )}
        </Pressable>
        <Pressable style={styles.dividerContainer}>
          <ReferralDivider isRedeemable={isRedeemable} />
        </Pressable>

        {isRedeemable ? (
          <Pressable style={styles.bottomModalContainerRedeemable} onPress={() => {}}>
            <FastImage
              source={require('../../../../assets/gift-feats.png')}
              style={styles.giftFeatsImage}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.redeemButton} onPress={redeemOffer} disabled={!referralCode}>
              <Text style={styles.redeemButtonText}>{t('referralModal.redeemOffer')}</Text>
            </TouchableOpacity>
          </Pressable>
        ) : (
          <Pressable style={styles.bottomModalContainer} onPress={() => {}}>
            <Text style={styles.inviteCode}>{typeof referralCode === 'string' ? referralCode.toUpperCase() : ''}</Text>
            <TouchableOpacity style={styles.shareButton} onPress={shareReferral} disabled={!referralCode}>
              <Text style={styles.shareButtonText}>{t('referralModal.shareCode')}</Text>
            </TouchableOpacity>
          </Pressable>
        )}
      </Pressable>
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
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 20,
    paddingBottom: 0,
    alignItems: 'center',
    gap: 20,
  },
  bottomModalContainer: {
    width: '80%',
    backgroundColor: '#633CEF',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingTop: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  bottomModalContainerRedeemable: {
    width: '80%',
    backgroundColor: 'white',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingTop: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  giftImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    marginTop: -80,
  },
  giftFeatsImage: {
    width: '80%',
    height: 100,
    alignSelf: 'center',
    marginTop: -70,
    zIndex: 2,
  },
  titleContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '400',
    color: 'rgba(109, 109, 109, 1)',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  inviteStatus: {
    backgroundColor: 'rgba(99, 60, 239, 0.15)',
    padding: 10,
    borderRadius: 20,
  },
  inviteStatusText: {
    fontSize: 14,
    color: 'rgba(99, 60, 239, 1)',
  },
  inviteCode: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.69)',
    marginBottom: 35,
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
  redeemButton: {
    width: '70%',
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#633CEF',
  },
  redeemButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'inter',
  },
  shareButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'inter',
  },
  dividerContainer: {
    width: '80%',
    zIndex: -1,
  },
});

export default ReferralModal;