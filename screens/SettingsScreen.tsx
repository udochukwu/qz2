import React from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert, Platform, SafeAreaView } from 'react-native';
import { VERSION } from '../constants';
import ProfileContext from '../contexts/ProfileContext';
import { getUserId } from '../services/storage';
import Purchases from "react-native-purchases"
import { useTranslation } from 'react-i18next';
import { ClipPath, Defs, Ellipse, G, Path, Rect, Svg } from 'react-native-svg';
import { getUniqueId } from 'react-native-device-info';
import Superwall from '@superwall/react-native-superwall';

function SettingButton({ svg, text, isLast = false, link = "https://google.com" }) {
    const { t } = useTranslation();

    const onPress = () => {
        if (typeof link === "function") {
            link()
        } else {
            Linking.openURL(link)
        }
    }

    return (
        <TouchableOpacity style={{ ...styles.buttonContainer, borderBottomWidth: isLast ? 0 : 1 }} onPress={onPress}>
            <View style={styles.emojiTextContainer}>
                {svg}
                <Text style={styles.text}>{t(text)}</Text>
            </View>


            <Image source={require('../assets/arrow.png')} style={styles.arrow} />
        </TouchableOpacity>
    )
}

function SettingsScreen({ navigation }) {
    const { t } = useTranslation();
    const userAgent = Platform.OS === "ios" ? "IOS" : "Android"
    const context = React.useContext(ProfileContext)
    const feedbackLink = "https://quizard.ai/feedback?userId=" + getUserId() + "&userAgent=" + userAgent
    const userId = getUserId()
    const details = new Map()
    details.set("userId", userId)


    const handleQuizardProPress = () => {
        if (context.revenueCatMetadata.is_native_paywall && !context.pro) {
            console.log("navigating to paywall")
            //timeout to make sure the paywall is loaded
            setTimeout(() => {
              navigation.navigate('PaywallV2')
            }, 1000)
        } else {
            Superwall.shared.register({placement: 'trigger_pro_button', params: details})
        }
    }
    let getDeviceId = async () => {
        try {
            const deviceId = getUserId() || await getUniqueId();
            setDeviceId(deviceId)
            return deviceId
        } catch (e) {
            console.log(e)
        }
    }
    const [deviceId, setDeviceId] = React.useState("")
    React.useEffect(() => {
        getDeviceId()
    }, [])
    let hundleRestore = async () => {
        try {
            const restore = await Purchases.restorePurchases();
            if (typeof restore.entitlements.active.pro !== "undefined") {
                Alert.alert(t("settingsScreen.success"), t("settingsScreen.restoreSuccess"))
                context.getProfileStatus()
            } else {
                Alert.alert(t("settingsScreen.error"), t("settingsScreen.restoreError"))
            }
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ width: "100%", marginBottom: 20 }} contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
                {!context.pro && <TouchableOpacity style={styles.proVersionContainer}
                    onPress={handleQuizardProPress}
                >
                    <View style={styles.plusContainer}><Text style={styles.plusText}>{t("settingsScreen.buttons.plus")}</Text></View>
                    <View style={{width: '80%'}}>
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10,}}>
                            <Image source={require('../assets/quizard.png')} style={{width: 26, height: 31}} />
                            <Text style={styles.quizardProText}>{t("settingsScreen.quizardPro")}</Text>
                        </View>

                        <Text style={styles.proVersioDescriptionText}>
                            {t("settingsScreen.superchargeQuizard")}
                        </Text>
                    </View>

                    <View style={{width: '20%', alignItems: 'flex-end', justifyContent: 'center'}}>
                        <Image source={require('../assets/arrow.png')} style={{...styles.arrow, width: 24, height: 24}} />
                    </View>
                </TouchableOpacity>}

                <View style={styles.subtitleContainer}>
                    <Text style={styles.subtitle}>{t("settingsScreen.quickAccess")}</Text>
                </View>
                <View style={styles.categoryContainer}>
                    <SettingButton svg={<Chrome />} text={"settingsScreen.buttons.chromeExtension"} link={() => navigation.navigate("Chrome")} />
                    <SettingButton svg={<Rate />} text={"settingsScreen.buttons.freeQuestions"} link={() => navigation.navigate("Earn")} />
                    <SettingButton svg={<History />} text={"settingsScreen.buttons.history"} link={() => navigation.navigate("History")} />
                </View>
                <View style={styles.subtitleContainer}>
                    <Text style={styles.subtitle}>{t("settingsScreen.quizard")}</Text>
                </View>
                <View style={styles.categoryContainer}>
                    <SettingButton svg={<FAQ />} text={"settingsScreen.buttons.faq"} link={"https://lovely-vault-f15.notion.site/FAQ-528972a4fe334c0e9f16e99ee7ef2825"} />
                    <SettingButton svg={<Rate />} text={"settingsScreen.buttons.freeQuestions"} link={() => navigation.navigate("Earn")} />
                    <SettingButton svg={<Terms />} text={"settingsScreen.buttons.termsOfUse"} link={"https://lovely-vault-f15.notion.site/Terms-of-Use-18a469738fd74c9bb7c919981de4bbcd"} />
                    <SettingButton text={"settingsScreen.buttons.chromeExtention"} svg={<Chrome />} link={() =>  navigation.navigate('Chrome')} />
                    <SettingButton svg={<Privacy />} isLast={true} text={"settingsScreen.buttons.privacyPolicy"} link={"https://lovely-vault-f15.notion.site/Privacy-Policy-4fe9e56db4a04d88af6e1b78f2874a7d"} />
                </View>
                <View style={styles.subtitleContainer}>
                    <Text style={styles.subtitle}>{t("settingsScreen.community")}</Text>
                </View>
                <View style={styles.categoryContainer}>
                    {Platform.OS === "ios" ?
                        <SettingButton svg={<Rate />} text={"settingsScreen.buttons.rateAppStore"} link={"https://apps.apple.com/us/app/quizard-ai/id1667996582"} />
                        :
                        <SettingButton svg={<Rate />} text={"settingsScreen.buttons.ratePlayStore"} link={"https://play.google.com/store/apps/details?id=com.aihomework"} />
                    }
                    <SettingButton svg={<Discord />} text={"settingsScreen.buttons.joinDiscord"} link={"https://discord.gg/wQWvW5bbeb"} />
                    <SettingButton svg={<TikTok />} text={"settingsScreen.buttons.followTikTok"} link={"https://www.tiktok.com/@quizard.ai"} />
                    <SettingButton svg={<Instagram />} isLast={true} text={"settingsScreen.buttons.followInstagram"} link={"https://www.instagram.com/quizard.ai/"} />
                </View>
                <View style={styles.subtitleContainer}>
                    <Text style={styles.subtitle}>{t("settingsScreen.about")}</Text>
                </View>
                <View style={styles.categoryContainer}>
                    <SettingButton svg={<Contact />} isLast={false} text={"settingsScreen.buttons.contactUs"} link={"mailto:support@quizard.ai?body=%0A%0AUser%20ID%3A%20" + deviceId} />
                    {context.pro && <SettingButton svg={<FAQ />} isLast={false} text={"settingsScreen.buttons.unsubscribe"} link={() => navigation.navigate("ExitSurvey")} />}
                    <SettingButton svg={<Feedback />} isLast={false} text={"settingsScreen.buttons.giveFeedback"} link={feedbackLink} />
                    <SettingButton svg={<Logout />} isLast={true} text={"settingsScreen.buttons.logout"} link={context.logout} />
                </View>
                <Text style={styles.version}> {`Quizard ${VERSION}`} </Text>

                <TouchableOpacity onPress={hundleRestore} style={{ marginTop: 20, paddingBottom: 10 }}>
                    <Text style={{ color: "#0000FF" }}>{t("settingsScreen.restorePurchases")}</Text>
                </TouchableOpacity>
                <Text style={{ ...styles.version, fontSize: 12 }}>{deviceId}</Text>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SettingsScreen;

//SVGs 

const FAQ = () => {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
                d="M17.633 6.33075C16.1282 4.84963 14.1014 4.01953 11.9901 4.01953C9.87878 4.01953 7.85207 4.84963 6.34724 6.33075V6.33075C5.16251 7.51094 4.37863 9.03368 4.10641 10.6837C3.83419 12.3338 4.08739 14.0276 4.83022 15.5259L4.47395 18.4683C4.45504 18.6102 4.46905 18.7544 4.51492 18.89C4.56079 19.0255 4.63726 19.1486 4.73842 19.2498C4.83958 19.3509 4.9627 19.4274 5.09821 19.4733C5.23372 19.5192 5.37796 19.5332 5.51977 19.5143L8.46187 19.158C9.95997 19.9009 11.6537 20.1541 13.3035 19.8819C14.9534 19.6096 16.4759 18.8256 17.656 17.6408V17.6408C18.4008 16.8988 18.9915 16.0167 19.3938 15.0453C19.7961 14.0739 20.0021 13.0324 20 11.981C19.9978 10.9295 19.7876 9.88894 19.3813 8.91918C18.9751 7.94942 18.3809 7.0697 17.633 6.33075V6.33075Z"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M9.08384 10.2814V10.0116C9.08384 8.58132 10.2433 7.42188 11.6735 7.42188H11.8011C13.1609 7.42188 14.2632 8.52419 14.2632 9.88397V10.2187C14.2632 11.0616 13.7319 11.8129 12.9372 12.0938V12.0938C12.1425 12.3747 11.6111 13.126 11.6111 13.9689V14.0418"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
            />
            <Ellipse
                cx="11.6735"
                cy="16.2986"
                rx="0.685275"
                ry="0.685353"
                fill="black"
            />
        </Svg>
    );
};

const Terms = () => {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
                d="M5.43393 5.93728C5.43393 4.83499 6.32751 3.94141 7.4298 3.94141H14.0408C14.5674 3.94141 15.0726 4.14948 15.4464 4.52031L17.5791 6.63581C17.9568 7.01056 18.1693 7.52065 18.1693 8.05278V18.505C18.1693 19.6073 17.2757 20.5009 16.1735 20.5009H7.4298C6.32751 20.5009 5.43393 19.6073 5.43393 18.505V5.93728Z"
                stroke="black"
                strokeWidth={1.4}
            />
            <Path
                d="M8.45097 10.6289H15.1523"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
            />
            <Path
                d="M8.45097 13.6641H15.1523"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
            />
            <Path
                d="M11.8948 17.3828H15.1523"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
            />
            <Path
                d="M13.8999 3.5V6.96159C13.8999 7.51274 14.3467 7.95953 14.8978 7.95953H18.5661"
                stroke="black"
                strokeWidth={1.4}
            />
        </Svg>
    );
};

// Privacy
const Privacy = () => {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
                d="M4.00368 5.07231L12 2.9375L19.9963 5.07231V11.4681V11.4681C19.9963 15.331 17.6445 18.8047 14.0579 20.2393L12.2738 20.953C12.098 21.0233 11.902 21.0233 11.7262 20.953L9.94206 20.2393C6.35548 18.8047 4.00368 15.331 4.00368 11.4681V11.4681V5.07231Z"
                stroke="black"
                strokeWidth={1.4}
                strokeLinejoin="round"
            />
            <Rect
                x="8.64466"
                y="10.375"
                width="6.71067"
                height="5.39476"
                rx="1"
                stroke="black"
                strokeWidth={1.3}
            />
            <Path
                d="M10.2201 10.5547L10.2201 8.71545C10.2201 7.73246 11.017 6.93558 12 6.93558V6.93558C12.983 6.93558 13.7799 7.73246 13.7799 8.71545L13.7799 10.5547"
                stroke="black"
                strokeWidth={1.3}
            />
        </Svg>
    );
};

// Rate
const Rate = () => {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
                d="M11.2818 5.62909C11.648 5.1283 12.3955 5.1283 12.7617 5.62909L14.2544 7.67042C14.3675 7.82515 14.5263 7.94052 14.7084 8.0003L17.1112 8.78898C17.7007 8.98248 17.9317 9.69347 17.5685 10.1965L16.0883 12.2467C15.9761 12.4021 15.9154 12.5888 15.9148 12.7805L15.9072 15.3091C15.9053 15.9295 15.3006 16.3689 14.7099 16.179L12.3023 15.4049C12.1198 15.3462 11.9236 15.3462 11.7411 15.4049L9.33351 16.179C8.74287 16.3689 8.13812 15.9295 8.13624 15.3091L8.12858 12.7805C8.128 12.5888 8.06734 12.4021 7.95512 12.2467L6.47494 10.1965C6.11175 9.69347 6.34276 8.98248 6.93226 8.78898L9.33501 8.0003C9.51713 7.94052 9.67592 7.82515 9.78907 7.67042L11.2818 5.62909Z"
                stroke="black"
                strokeWidth={1.4}
            />
            <Path
                d="M12 20.171V18.0859"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
            />
            <Path
                d="M3 14.6581L4.91459 13.832"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
            />
            <Path
                d="M21 14.6581L19.0854 13.832"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
            />
            <Path
                d="M18.0352 3.82655L16.6696 5.40234"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
            />
            <Path
                d="M5.96482 3.82264L7.33035 5.39844"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
            />
        </Svg>
    );
};

// Instagram  
const Instagram = () => {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Rect
                x="3.24142"
                y="3.24219"
                width="17.5172"
                height="17.5172"
                rx="4"
                stroke="black"
                strokeWidth={1.4}
            />
            <Rect
                x="7.89767"
                y="7.89844"
                width="8.20465"
                height="8.20465"
                rx="4"
                stroke="black"
                strokeWidth={1.4}
            />
            <Rect
                x="16.1023"
                y="5.67188"
                width="1.89215"
                height="1.89215"
                rx="0.946075"
                fill="black"
            />
        </Svg>
    );
};

// Contact
const Contact = () => {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
                d="M2.33398 13.3125C2.33398 11.6556 3.67713 10.3125 5.33398 10.3125H6.88545C7.43774 10.3125 7.88545 10.7602 7.88545 11.3125V16.7145C7.88545 17.2667 7.43774 17.7145 6.88545 17.7145H5.33398C3.67713 17.7145 2.33398 16.3713 2.33398 14.7145V13.3125Z"
                stroke="black"
                strokeWidth={1.4}
            />
            <Path
                d="M21.4415 13.3125C21.4415 11.6556 20.0984 10.3125 18.4415 10.3125H16.89C16.3378 10.3125 15.89 10.7602 15.89 11.3125V16.7145C15.89 17.2667 16.3378 17.7145 16.89 17.7145H18.4415C20.0984 17.7145 21.4415 16.3713 21.4415 14.7145V13.3125Z"
                stroke="black"
                strokeWidth={1.4}
            />
            <Path
                d="M13.6983 20.3376C13.6983 19.8146 13.2744 19.3906 12.7514 19.3906H10.6829C10.1599 19.3906 9.73596 19.8146 9.73596 20.3376V20.3376C9.73596 20.8605 10.1599 21.2845 10.6829 21.2845H12.7514C13.2744 21.2845 13.6983 20.8605 13.6983 20.3376V20.3376Z"
                stroke="black"
                strokeWidth={1.4}
            />
            <Path
                d="M18.2202 17.7148V18.3388C18.2202 19.4434 17.3248 20.3388 16.2202 20.3388H13.9537"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
            />
            <Path
                d="M17.9602 10.3123V9.27561C17.9602 5.92187 15.2415 3.20312 11.8877 3.20312V3.20312C8.534 3.20312 5.81526 5.92187 5.81526 9.27561V10.3123"
                stroke="black"
                strokeWidth={1.4}
            />
        </Svg>
    );
};

// Feedback
const Feedback = () => {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
                d="M15.9544 5.54688H4.50825C3.40369 5.54688 2.50826 6.44231 2.50826 7.54688V15.5469C2.50826 16.6514 3.40369 17.5469 4.50825 17.5469H7.58856C8.31111 17.5469 8.97747 17.9366 9.33171 18.5664L10.1367 19.9974C10.519 20.6771 11.4975 20.6771 11.8798 19.9974L12.6848 18.5664C13.039 17.9366 13.7054 17.5469 14.4279 17.5469H17.5083C18.6128 17.5469 19.5083 16.6514 19.5083 15.5469V6.67439"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
            />
            <Path
                d="M5.394 8.25781H10.3045"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
            />
            <Path
                d="M5.394 11.2695H10.3045"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
            />
            <Path
                d="M5.394 14.2539H16.5843"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
            />
            <Path
                d="M18.3098 3.51379C18.8956 2.928 19.8453 2.928 20.4311 3.51379V3.51379C21.0169 4.09957 21.0169 5.04932 20.4311 5.63511L15.596 10.4702L13.0571 10.8878L13.4747 8.34887L18.3098 3.51379Z"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

// Logout
const Logout = () => {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
                d="M15.6848 6.72807C14.3398 5.38968 12.4857 4.5625 10.4383 4.5625C6.33026 4.5625 3 7.89294 3 12.0012C3 16.1095 6.33026 19.44 10.4383 19.44C12.4857 19.44 14.3398 18.6128 15.6848 17.2744"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M18.4246 9.42188L21 11.9895L18.4246 14.565"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M21 11.9961L10.4383 11.9961"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};
// Discord
const Discord = () => {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
                d="M6.24365 8.49696C7.27861 7.68643 8.48892 7.25618 9.58131 7.03095M5.56811 15.3705C6.53289 16.1706 7.77605 16.626 8.96122 16.8813M9.58131 7.03095C10.5474 6.83176 11.4213 6.79292 12 6.79319C12.5787 6.79292 13.4526 6.83176 14.4187 7.03095M9.58131 7.03095V5.91771C9.58131 5.39714 9.08612 5.02199 8.5921 5.18614C7.48742 5.55319 6.03878 6.12236 5.21266 6.72997C5.15536 6.77212 5.10597 6.82236 5.06675 6.88171C4.51129 7.72235 3.3377 10.6074 2.55519 15.5613C2.51884 15.7914 2.58561 16.0277 2.75314 16.1896C3.51854 16.9292 5.17279 18.1399 7.42752 18.7611C7.71659 18.8407 8.02428 18.735 8.19303 18.4871C8.4865 18.0561 8.84054 17.4364 8.96122 16.8813M8.96122 16.8813C10.1429 17.1359 11.267 17.1915 12 17.1915C12.733 17.1915 13.8571 17.1359 15.0388 16.8813M17.7564 8.49696C16.7214 7.68643 15.5111 7.25618 14.4187 7.03095M18.4319 15.3705C17.4671 16.1706 16.224 16.626 15.0388 16.8813M14.4187 7.03095V5.91771C14.4187 5.39714 14.9139 5.02199 15.4079 5.18614C16.5126 5.55319 17.9612 6.12236 18.7873 6.72997C18.8446 6.77212 18.894 6.82236 18.9332 6.88171C19.4887 7.72235 20.6623 10.6074 21.4448 15.5613C21.4812 15.7914 21.4144 16.0277 21.2469 16.1896C20.4815 16.9292 18.8272 18.1399 16.5725 18.7611C16.2834 18.8407 15.9757 18.735 15.807 18.4871C15.5135 18.0561 15.1595 17.4364 15.0388 16.8813"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
            />

            <Ellipse
                cx="9.16963"
                cy="12.9399"
                rx="1.3878"
                ry="1.58834"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
            />

            <Ellipse
                cx="14.8304"
                cy="12.9399"
                rx="1.3878"
                ry="1.58834"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
            />
        </Svg>
    );
};

// TikTok
const TikTok = () => {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
                d="M12.3526 15.1487V3.4375H15.2787C15.2787 6.89847 18.4219 7.66198 19.9935 7.61111V10.7986C17.5614 10.7986 16.2636 10.1458 15.2787 9.13843L15.2787 15.3665C15.2787 18.3938 12.8247 20.8479 9.79741 20.8479C6.77016 20.8479 4.31609 18.3732 4.31609 15.3459C4.31608 12.2958 6.78868 9.80248 9.83878 9.80248H10.3739V13.3219H9.53392C8.34243 13.3219 7.37653 14.2878 7.37653 15.4793C7.37653 16.6708 8.34243 17.6367 9.53392 17.6367H9.86455C11.2386 17.6367 12.3526 16.5228 12.3526 15.1487Z"
                stroke="black"
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

// Chrome
const Chrome = () => {
    return (
        <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <G clipPath="url(#clip0_14_9560)">
                <Path d="M12.9464 8.91086C12.9464 11.0904 11.1796 12.8573 9 12.8573C6.82045 12.8573 5.05357 11.0904 5.05357 8.91086C5.05357 6.73131 6.82045 4.96443 9 4.96443C11.1796 4.96443 12.9464 6.73131 12.9464 8.91086Z" stroke="black" strokeWidth="0.607143"/>
                <Path d="M5.37483 16.2638C3.92091 15.5468 2.71226 14.4147 1.90171 13.0108C0.814792 11.1282 0.520252 8.89097 1.08288 6.79121C1.64551 4.69145 3.01921 2.9012 4.9018 1.81429C6.30572 1.00374 7.91846 0.627698 9.53609 0.733722C11.1537 0.839746 12.7036 1.42307 13.9897 2.40994C15.2758 3.3968 16.2404 4.74287 16.7615 6.27794C17.2826 7.81301 17.3367 9.46813 16.9172 11.034C16.4976 12.5999 15.6231 14.0061 14.4043 15.075C13.1855 16.1439 11.6771 16.8273 10.0699 17.0389C8.46264 17.2505 6.82875 16.9807 5.37483 16.2638ZM13.5438 9.21042C13.6027 8.31173 13.3938 7.41577 12.9435 6.63581C12.3397 5.58993 11.3451 4.82676 10.1786 4.51419C9.01204 4.20162 7.76912 4.36525 6.72323 4.96909C5.94328 5.4194 5.31437 6.09087 4.91604 6.89861C4.51771 7.70634 4.36785 8.61406 4.4854 9.50696C4.60296 10.3999 4.98265 11.2379 5.57646 11.915C6.17028 12.5921 6.95154 13.0779 7.82147 13.311C8.69139 13.5441 9.6109 13.514 10.4637 13.2245C11.3165 12.935 12.0644 12.3991 12.6126 11.6846C13.1609 10.9701 13.4849 10.1091 13.5438 9.21042Z" stroke="black" strokeWidth="0.894737"/>
                <Path d="M13.0258 15.8867C12.033 16.4598 10.9319 16.8128 9.79724 16.9256L13.0667 11.2627C13.0668 11.2626 13.0669 11.2625 13.0669 11.2623C13.4801 10.5486 13.6979 9.73847 13.6983 8.9137C13.6987 8.08881 13.4816 7.27839 13.0689 6.56415C12.7379 5.9914 12.2906 5.49672 11.7577 5.11094H16.096C16.7222 6.27909 17.051 7.5851 17.0512 8.91316C17.0515 10.3266 16.6796 11.7152 15.973 12.9393C15.2663 14.1635 14.2499 15.18 13.0258 15.8867Z" stroke="black" strokeWidth="0.894737"/>
                <Path d="M8.99939 13.6128C9.66088 13.6126 10.3129 13.4725 10.9135 13.2039L8.74431 16.9611C7.41954 16.9193 6.12411 16.551 4.97386 15.8872C3.74965 15.1807 2.73302 14.1643 2.02621 12.9403C1.3194 11.7163 0.947316 10.3277 0.947368 8.91425C0.947411 7.76787 1.19225 6.63788 1.66191 5.59878L4.93141 11.2617C4.93145 11.2618 4.93148 11.2619 4.93152 11.2619C5.34308 11.9767 5.93579 12.5704 6.64992 12.9831C7.36411 13.3959 8.1745 13.6131 8.99939 13.6128Z" stroke="black" strokeWidth="0.894737"/>
            </G>
            <Defs>
                <ClipPath id="clip0_14_9560">
                <Rect width="17" height="17" fill="white" transform="translate(0.5 0.412598)"/>
                </ClipPath>
            </Defs>
        </Svg>
    )
}

// History
const History = () => {
    return (
        <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <Path d="M2.21717 6.42291C2.83175 4.70362 4.04053 3.26056 5.62545 2.35407C7.21037 1.44758 9.06706 1.13734 10.8606 1.47932C12.6541 1.8213 14.2664 2.79298 15.4065 4.21907C16.5467 5.64517 17.1397 7.43177 17.0785 9.25658C17.0173 11.0814 16.306 12.8243 15.0728 14.1708C13.8397 15.5173 12.166 16.3788 10.3536 16.5999C8.54118 16.8209 6.70944 16.387 5.1888 15.3764C3.66817 14.3658 2.55877 12.845 2.06073 11.0884" stroke="black" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M4.90832 5.7981L2.17374 6.47183L1.5 3.74518" stroke="black" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M10.7386 4.33829L9.04395 9.15342L11.9934 10.5922" stroke="black" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
    )
}

const styles = StyleSheet.create({
    appIcon: {
        width: 101,
        height: 29
    },
    headerTitle: {
        fontFamily: 'Inter',
        fontWeight: '600',
        fontSize: 26
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F8F8',
        marginBottom: '18%'
    },
    subtitleContainer: {
        width: '90%',
        alignItems: 'flex-start',
    },
    subtitle: {

        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 22,
        textAlign: 'center',
        color: '#000',
        marginBottom: 5,
        marginTop: 20,
    },

    categoryContainer: {
        backgroundColor: '#fff',
        width: '90%',
        borderRadius: 12,
        borderColor: '#E2E2E2',
        paddingHorizontal: 14,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#F6F6F6',
    },
    text: {
        fontFamily: 'Inter',
        fontStyle: 'normal',
        color: '#000',
        fontWeight: '400',
        fontSize: 14,
    },
    emojiTextContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    arrow: {
        width: 20,
        height: 20,
        transform: [{ rotate: '-90deg' }]
    },
    version: {
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: '300',
        fontSize: 15,
        marginTop: 20,
        color: '#606060',
    },
    proVersionContainer: {
        display: 'flex',
        flexDirection: 'row',
        borderColor: 'rgba(109, 86, 250, 1)',
        borderWidth: 2,
        borderRadius: 16,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        padding: 15
    },
    proVersioDescriptionText: {
        fontFamily: 'Inter',
        fontWeight: '400',
        fontSize: 12,
        marginTop: 10,
        lineHeight: 18,
        letterSpacing: 0.4,
        color: 'rgba(59, 59, 60, 0.8)'
    },
    quizardProText: {
        fontFamily: 'Inter',
        fontWeight: '600',
        fontSize: 18.9,
        verticalAlign: 'middle',
    },
    plusContainer: {
        backgroundColor: 'rgba(109, 86, 250, 1)',
        top: -10,
        right: '10%',
        borderRadius: 6,
        position: 'absolute',
        justifyContent: 'center',
        paddingHorizontal: 4.5,
        paddingVertical: 3.5
    },
    plusText: {
        fontFamily: 'Inter',
        fontWeight: '600',
        fontStyle: 'italic',
        fontSize: 12.54,
        verticalAlign: 'middle',
        alignSelf: 'center',
        color: 'white'
    }
})
