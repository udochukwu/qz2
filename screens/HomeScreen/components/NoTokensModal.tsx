import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Modal, Platform, Pressable } from "react-native";
import OutOfTokens from "../../../components/OutOfTokens";
import { useContext, useEffect } from "react";
import ProfileContext from "../../../contexts/ProfileContext";
import Superwall from "@superwall/react-native-superwall";
import { useGetUserId } from "../../../hooks/useGetUserId";

type Props = {
  navigation: NavigationProp<ParamListBase>;
  isModalOpen: boolean;
  onModalClose: () => void;
}

export const NoTokensModal = ({ navigation, isModalOpen, onModalClose  }: Props) => {
  const {userId} = useGetUserId()
  const context = useContext(ProfileContext);

  const onOutOfTokensPress = () => {
    onModalClose();
    let details = new Map()
    details.set("userId", userId)
    if (context.revenueCatMetadata.is_native_paywall) {
      navigation.navigate('PaywallV2')
    } else {
      Superwall.shared.register({placement: "trigger_no_tokens", params: details})
    }
    
  }
  useEffect(() => {
    if (isModalOpen) {
      context.mixpanel?.track("Page View", 
      { 
        'Page Title': 'No Tokens Modal',
        'Device Type': Platform.OS
      });
    }
      
  }, [isModalOpen])

  return (
    <Modal
        animationType="slide"
        visible={isModalOpen}
        transparent={true}
        onRequestClose={onModalClose}
    >
      <Pressable style={{ flex: 1, justifyContent: "center", padding: 10 }} onPress={onModalClose}>
        <Pressable style={{ justifyContent: "center" }}>
          <OutOfTokens onPress={onOutOfTokensPress} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
