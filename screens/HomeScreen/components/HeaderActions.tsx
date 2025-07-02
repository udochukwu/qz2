import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { hapticEffect } from "../../../services/common";
import { useContext } from "react";
import ProfileContext from "../../../contexts/ProfileContext";
import Superwall from "@superwall/react-native-superwall";
import { useGetUserId } from "../../../hooks/useGetUserId";
import FastImage from "react-native-fast-image";

type Props = {
  navigation: NavigationProp<ParamListBase>;
  pro: boolean;
};

export const HeaderActions = ({ navigation, pro }: Props) => {
  const {userId} = useGetUserId()
  const {revenueCatMetadata} = useContext(ProfileContext)
  const onConinbookPress = () => {
    hapticEffect();
    let details = new Map()
    details.set("userId", userId)
    //navigate to paywall
    if (revenueCatMetadata.is_native_paywall) {
      navigation.navigate('PaywallV2')
    } else {
      Superwall.shared.register({placement: "trigger_pro_badge", params: details})
    }
  }

  const onHistoryPress = () => {
    hapticEffect();
    navigation.navigate('History');
  }

  return (
    <View style={styles.headerActionsView}>
        <View style={styles.leftSettingsView}> 
            <TouchableOpacity onPress={onHistoryPress} style={{...styles.coinsButtonView }} >
            <FastImage tintColor="#FFF" source={require("../../../assets/history.png")} resizeMode="contain" style={{
                      width: 22,
                      height: 22
                    }} />
            </TouchableOpacity>
        </View>
        {!pro && <View style={styles.rightSettingsView}>
          <TouchableOpacity testID="pro-button" style={{...styles.coinsButtonView}} onPress={onConinbookPress} >
            <Image source={require("../../../assets/probook.png")} style={{ width: 16, height: 20}} />
            <Text style={styles.coinsText}>Pro</Text> 
          </TouchableOpacity>
          </View>
        }
    </View>
  );
}


const styles = StyleSheet.create({
  settingButton: {
    width: 22,
    height: 22,
    tintColor: "white",
  },
  coinsButtonView: {
    zIndex: 1,
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  coinsText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: "700",
    paddingLeft: 10,
  },

  rightSettingsView: {
    flexDirection: 'row',
    zIndex: 1,
    columnGap: 10,
  },
  leftSettingsView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActionsView: {
    position: 'absolute',
    top: "7%",
    width: '90%',
    marginHorizontal: "5%",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})

