import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text } from "react-native";
import Button from "../../../components/Button";
import TextInputAnimated from "../../TextInputAnimated";
import { useTranslation } from "react-i18next";

type Props = {
  isModalOpen: boolean;
  onModalClose: () => void;
  question: string;
  onQuestionUpdate: (question: string) => void;
  onSubmit: () => void;
}

export const TypedQuestionModal = ({ isModalOpen, onModalClose, question, onSubmit, onQuestionUpdate }: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalOpen}
      onRequestClose={onModalClose}>
        <Pressable style={styles.centeredView} onPress={onModalClose}>
          <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.centeredView} >
              <Pressable style={styles.modalView} >
                <TextInputAnimated typedQuestion={question} setTypedQuestion={onQuestionUpdate} />
                <Button
                  style={styles.button}
                  onPress={onSubmit}
                  disabled={question.length < 1}>
                  <Text style={styles.buttonText}>{t('homeScreen.buttonText_askQuestion')}</Text>
                </Button>
              </Pressable>
          </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    width: "100%",
    minHeight: 150,
    backgroundColor: "white",
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 5,
    shadowColor: "white",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignContent: "center",
  },
  button: {
    width: "90%",
    height: 40,
    backgroundColor: '#6D56FA',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    position: 'absolute',
    bottom: 20,
  },
  buttonText: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
    color: '#FFFFFF',
  },
});
