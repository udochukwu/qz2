import { useState, useEffect } from 'react';
import { Share } from 'react-native';
import branch, { BranchEvent } from 'react-native-branch';
import { FetchGenerateReferral } from '../services/backendCalls';

const useReferral = (message:string, include_referral_code:boolean = false) => {
    const [referralCode, setReferralCode] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchReferralCode = async () => {
            const response = await FetchGenerateReferral()
            console.log(response)
            if (response) {
                setReferralCode(response.referral_code);
            }
        };

        fetchReferralCode();
    }, []);

    const shareReferral = async () => {
        let buo = await branch.createBranchUniversalObject('referral', {
            title: 'Get Quizard',
            contentDescription: 'Solve and Scan',
            contentMetadata: {
                customMetadata: {
                    referral: referralCode ?? ""
                }
            }
        });

        let { url } = await buo.generateShortUrl();
        try {
            let sentMessage = include_referral_code ? `${message} with my referral code: ${referralCode}` : message;

            const result = await Share.share({
                message:sentMessage,
                url
            });

            if (result.action === Share.sharedAction) {
                let event = new BranchEvent(BranchEvent.Invite);
                event.logEvent();
            }
        } catch (error) {
            console.error('Sharing failed', error);
        }
    };

    return { referralCode, shareReferral };
};

export default useReferral;


