import { useCallback, useContext, useEffect, useState } from "react";
import { FetchClaimTokens, FetchGetBalance } from "../../services/backendCalls";
import { Image, Linking, StyleSheet, Text, View } from "react-native";
import { ClaimBox } from "./ClaimBox";
import React from "react";
import { useTranslation } from "react-i18next";
import ProfileContext from "../../contexts/ProfileContext";
import QSpinner from "../QSpinner";
import { getTokensNumber, giveFeedback, hasFeedback } from "../../services/storage";
import { useFocusEffect } from "@react-navigation/native";
import { inAppReviewHandler } from "../Blocks/components/FeedbackButtons";
import { BackArrow } from "../BackArrow";



type tokenProfile = {
    tokens: number,
    seconds_till_next_refresh: number,
    daily_checkin_tokens: number,
    referral_tokens: number,
    can_claim_daily_tokens: boolean,
    can_claim_instagram_tokens?: boolean,
    can_claim_tiktok_tokens?: boolean,
    can_claim_discord_tokens?: boolean,
    can_claim_youtube_tokens?: boolean,
    can_claim_chrome_reward_tokens?: boolean,
    can_claim_app_review_tokens?: boolean,
    discord_invite_tokens?: number,
    instagram_follow_tokens?: number,
    tiktok_follow_tokens?: number,
    youtube_subscribe_tokens?: number,
    chrome_reward_tokens?: number,
    app_review_reward_tokens?: number,
    instagram_url?: string,
    tiktok_url?: string,
    discord_url?: string,
    youtube_url?: string,
}
const getTokensProfile = async (): Promise<tokenProfile | undefined> => {
    const tokens_profile = await FetchGetBalance()
    if (tokens_profile) {
        return tokens_profile
    }
    return undefined
}

function EarnTokensBlock({ navigation, asAscreen = false }: { navigation: any, asAscreen?: boolean }) {
    const { t } = useTranslation();
    const [tokensProfile, setTokensProfile] = useState<tokenProfile | undefined>(undefined)
    const [timeUntilNextClaim, setTimeUntilNextClaim] = useState(0);
    const [dailyRefreshClaimed, setDailyRefreshClaimed] = useState(false);
    const [socialMediaClaimed, setSocialMediaClaimed] = useState({ instagram: false, tiktok: false, discord: false, youtube: false });
    const [reviewClaimed, setReviewClaimed] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false); // New state to track claim button status

    // State to prevent rapid button presses 
    // See https://www.npmjs.com/package/react-native-in-app-review#when-to-request-an-in-app-review-1
    const [appReviewDisabled, setAppReviewDisabled] = useState(false);

    const context = useContext(ProfileContext);
    useFocusEffect(useCallback(() => {
        const fetchTokensProfile = async () => {
            const fetchedTokensProfile = await getTokensProfile();
            console.log(fetchedTokensProfile)
            setTokensProfile(fetchedTokensProfile);
            context.setTokens(fetchedTokensProfile?.tokens || getTokensNumber())

            if (fetchedTokensProfile?.seconds_till_next_refresh !== timeUntilNextClaim) {
                setTimeUntilNextClaim(fetchedTokensProfile?.seconds_till_next_refresh || 0);
            }

            // Set this only on the initial fetch
            if (!dailyRefreshClaimed && !fetchedTokensProfile?.can_claim_daily_tokens) {
                setDailyRefreshClaimed(true);
            }
        }

        fetchTokensProfile();
    }, []));

    useEffect(() => {
        if (timeUntilNextClaim > 0) {
            const timer = setInterval(() => {
                setTimeUntilNextClaim((prevTime) => {
                    if (prevTime <= 1) {
                        setDailyRefreshClaimed(false);
                        clearInterval(timer);
                        return prevTime;
                    } else {
                        return prevTime - 1;
                    }
                });
            }, 1000);

            return () => {
                clearInterval(timer);
            };
        }
    }, [timeUntilNextClaim]);
    const onClaimPress = async (claim_type: string) => {
        if (isClaiming) return; // Prevent further execution if already claiming
        setIsClaiming(true); // Disable claim button
        const response = await FetchClaimTokens(claim_type)
        if (response && response.tokens) {
            setTokensProfile({ ...tokensProfile!, tokens: response.tokens })
            context.setTokens(response.tokens)
            if (claim_type === "daily_checkin")
                setDailyRefreshClaimed(true);
        }
        setIsClaiming(false);
    }

    const secondsToHms = (seconds: number) => {
        if (!seconds) return "";

        if (seconds <= 0)
            setDailyRefreshClaimed(false);
        let duration = seconds;
        let hours = Math.floor(duration / 3600);
        duration = duration % 3600;

        let min = Math.floor(duration / 60);
        duration = duration % 60;

        let sec = Math.floor(duration);

        // Convert variables to string with leading 0 if necessary
        let hoursStr = hours !== 0 ? (hours < 10 ? '0' + hours : hours.toString()) + " : " : '';
        let minStr = min !== 0 ? (min < 10 ? '0' + min : min.toString()) + " : " : '';
        let secStr = sec < 10 ? '0' + sec : sec.toString();

        return hoursStr + minStr + secStr;
    }

    const hasClaimableItems = (profile: tokenProfile, asAscreen: boolean, reviewClaimed: boolean) => {
        return (
            (!asAscreen && profile.can_claim_daily_tokens) ||
            profile.referral_tokens > 0 ||
            ((!reviewClaimed && hasFeedback()) && profile.can_claim_app_review_tokens) ||
            profile.can_claim_chrome_reward_tokens ||
            profile.can_claim_instagram_tokens ||
            profile.can_claim_tiktok_tokens ||
            profile.can_claim_discord_tokens ||
            profile.can_claim_youtube_tokens
        );
    };

    if (!tokensProfile) return (
        <View style={{ backgroundColor: "#F7F7F7", flex: 1, paddingVertical: 25, paddingBottom: 80, paddingHorizontal: 20, justifyContent: "center", alignItems: "center" }}>
            <QSpinner />
        </View>
    )

    return (
        <View style={{ backgroundColor: "#F7F7F7", flex: 1, paddingVertical: 25, paddingBottom: 80, paddingHorizontal: 20 }}>
            <View style={{ ...styles.earnContainer, justifyContent: asAscreen ? "center" : "space-between", marginBottom: asAscreen ? 20 : 10 }}>

                {
                    asAscreen &&
                    <View style={{ position: "absolute", left: 10 }} >
                        <BackArrow onClick={() => navigation.goBack()} />
                    </View>
                }
                <Text style={styles.earnText}>
                    {t('purchaseScreen.earn')}
                </Text>
                {!asAscreen &&
                    <View style={styles.earnBoxContainer}>
                        <View style={styles.CoinBoxContainer}>
                            <Image source={require("../../assets/coinbook.png")} style={{ width: 20, height: 20 }} />
                        </View>
                        <Text style={styles.CoinBoxText}>
                            {tokensProfile?.tokens || 0}
                        </Text>
                    </View>}
            </View>
            {

                !hasClaimableItems(tokensProfile, asAscreen, reviewClaimed) &&
                <View style={{ backgroundColor: "#F7F7F7", flex: 1, paddingVertical: 25, paddingBottom: 80, paddingHorizontal: 20, justifyContent: "center", alignItems: "center" }}>
                    <Text style={styles.emptyStateText}>{t('purchaseScreen.noClaimableItems')}</Text>
                </View>
            }
            {!asAscreen && <ClaimBox
                title={t('purchaseScreen.dailyRefresher')}
                coinCount={`+ ${tokensProfile?.daily_checkin_tokens || 0}`}
                claimed={dailyRefreshClaimed}
                countdown={secondsToHms(timeUntilNextClaim)}
                onPress={() => onClaimPress("daily_checkin")}
            />}
            {tokensProfile?.referral_tokens > 0 &&
                <ClaimBox
                    title={t('purchaseScreen.inviteFriends')}
                    coinCount={`+ ${tokensProfile?.referral_tokens || 0}`}
                    onPress={() => navigation.navigate("Referral", { number_of_tokens: tokensProfile?.referral_tokens || 0 })}
                    claimed={undefined} countdown={undefined} />
            }
            {
                (reviewClaimed || !hasFeedback()) && tokensProfile?.can_claim_app_review_tokens &&
                <ClaimBox
                    title={t('leaveReview')}
                    coinCount={`+ ${tokensProfile?.app_review_reward_tokens || 0}`}
                    claimed={reviewClaimed}
                    countdown={undefined}
                    disabled={appReviewDisabled}
                    loading={appReviewDisabled}
                    onPress={async () => {
                        setAppReviewDisabled(true)
                        const success = await inAppReviewHandler()
                        if (success) {
                            setTimeout(async () => {
                                await onClaimPress("app_review")
                                setReviewClaimed(true)
                                giveFeedback()
                                setAppReviewDisabled(false)
                            }, 12 * 1000)
                        } else {
                            setTimeout(() => {
                                setAppReviewDisabled(false)
                            }, 2500)
                        }
                    }}
                />
            }
            {tokensProfile?.can_claim_chrome_reward_tokens &&
                <ClaimBox
                    title={t('purchaseScreen.chromeExtension')}
                    coinCount={`+ ${tokensProfile?.chrome_reward_tokens || 0}`}
                    onPress={() => {
                        navigation.navigate("Chrome")
                    }}
                    claimed={undefined} countdown={undefined} />

            }
            {
                tokensProfile?.can_claim_instagram_tokens &&
                <ClaimBox
                    title={t('purchaseScreen.instagramFollow')}
                    coinCount={`+ ${tokensProfile?.instagram_follow_tokens || 0}`}
                    claimed={socialMediaClaimed.instagram}
                    countdown={undefined}
                    onPress={() => {
                        Linking.openURL(tokensProfile.instagram_url!)
                        setTimeout(() => {
                            setSocialMediaClaimed({ ...socialMediaClaimed, instagram: true })
                        }, 2000);
                        onClaimPress("instagram_follow")

                    }
                    }
                />
            }
            {
                tokensProfile?.can_claim_tiktok_tokens &&
                <ClaimBox
                    title={t('purchaseScreen.tiktokFollow')}
                    coinCount={`+ ${tokensProfile?.tiktok_follow_tokens || 0}`}
                    claimed={socialMediaClaimed.tiktok}
                    countdown={undefined}
                    onPress={() => {
                        Linking.openURL(tokensProfile.tiktok_url!)
                        setTimeout(() => {
                            setSocialMediaClaimed({ ...socialMediaClaimed, tiktok: true })
                        }, 2000);
                        onClaimPress("tiktok_follow")
                    }}
                />
            }
            {
                tokensProfile?.can_claim_discord_tokens &&
                <ClaimBox
                    title={t('purchaseScreen.discordJoin')}
                    coinCount={`+ ${tokensProfile?.discord_invite_tokens || 0}`}
                    claimed={socialMediaClaimed.discord}
                    countdown={undefined}
                    onPress={() => {
                        Linking.openURL(tokensProfile.discord_url!)
                        setTimeout(() => {
                            setSocialMediaClaimed({ ...socialMediaClaimed, discord: true })
                        }, 2000);
                        onClaimPress("discord_invite")
                    }}
                />
            }
            {
                tokensProfile?.can_claim_youtube_tokens &&
                <ClaimBox
                    title={t('purchaseScreen.youtubeSubscribe')}
                    coinCount={`+ ${tokensProfile?.youtube_subscribe_tokens || 0}`}
                    claimed={socialMediaClaimed.youtube}
                    countdown={undefined}
                    onPress={() => {
                        Linking.openURL(tokensProfile.youtube_url!)
                        setTimeout(() => {
                            setSocialMediaClaimed({ ...socialMediaClaimed, youtube: true })
                        }, 2000);
                        onClaimPress("youtube_subscribe")
                    }}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    earnContainer: {
        flexDirection: "row",
        alignItems: "center",

    },
    earnText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "600",
        fontSize: 18,
        color: "#000",

    },
    earnBoxContainer: {
        flexDirection: "row",
        paddingVertical: 5,
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center",
        marginLeft: 10,
        backgroundColor: "white",
        paddingLeft: 4,
        paddingRight: 10,
        borderRadius: 30,
        //box-shadow: 0px 1.5px 1px 0px rgba(0, 0, 0, 0.05);
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1.5,
        },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,

    },
    timeUntilnextClaim: {
        color: "white",
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "600",
        fontSize: 16,
    },
    CoinBoxText: {
        color: "#633CEF",
        fontFamily: "Nunito",
        fontStyle: "normal",
        fontWeight: "700",
        fontSize: 17,
        marginLeft: 5,
    },
    CoinBoxContainer: {
        padding: 4,
        borderRadius: 30,
        backgroundColor: "#DEE1FF",
    },
    emptyStateText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "600",
        fontSize: 18,
        color: "#000",
        textAlign: "center",
    },

})
export default EarnTokensBlock;