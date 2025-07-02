import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Modal, Pressable } from "react-native";
import ClaimedTokens from "../../../components/ClaimedTokens";

type Props = {
  pro: boolean;
  isModalOpen: boolean;
  onModalClose: () => void;
}

export const TokensClaimedModal = ({ pro, onModalClose, isModalOpen }: Props) => {
  return (
    <Modal
        animationType="slide"
        visible={!pro && isModalOpen === true}
        transparent={true}
        onRequestClose={onModalClose}
    >
      <Pressable style={{ flex: 1, justifyContent: "center", padding: 10 }} onPress={onModalClose}>
        <Pressable style={{ justifyContent: "center" }}>
          <ClaimedTokens onPress={onModalClose} />
        </Pressable>
      </Pressable>
    </Modal>

  );
}
