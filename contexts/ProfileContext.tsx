import { Mixpanel } from 'mixpanel-react-native';
import { createContext } from 'react';

export type ProfileContextType = {
    pro: boolean;
    getProfileStatus: () => void;
    checkOnboarded: () => void;
    logout: () => void;
    tokens: number;
    setTokens: (number: number) => void;
    claimTokens: boolean;
    setClaimTokens: (boolean: boolean) => void;
    revenueCatMetadata: {
        is_native_paywall: boolean;
        rc_experiment_group?: string;
        prices: {
            id: string;
            trial_days: number;
        }[];
    };
    mixpanel: Mixpanel | null;
};

const ProfileContext = createContext<ProfileContextType>({
    pro: false,
    getProfileStatus: () => { },
    checkOnboarded: () => { },
    logout: () => { },
    tokens: 0,
    setTokens: (number) => { },
    claimTokens: false,
    setClaimTokens: (boolean: boolean) => { },
    revenueCatMetadata: {
        is_native_paywall: false,
        prices: [
            {
                "id": "price_1RKNpzCAPSSuKlSo1vmIf1TI",
                "trial_days": 3
              },
              {
                "id": "price_1RKONSCAPSSuKlSo06AIEDPp",
                "trial_days": 3
              }
        ],
        rc_experiment_group: undefined
    },
    mixpanel: null,
});

export default ProfileContext;
