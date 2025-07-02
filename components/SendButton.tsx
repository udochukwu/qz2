import { Image, StyleSheet, TouchableOpacity } from "react-native"
import { CameraModes } from "../screens/HomeScreen";

type Props = {
  disabled: boolean;
  onPress: () => void;
  cameraSelection: CameraModes;
  testID?: string;
}

export const SendButton = ({ disabled, onPress, cameraSelection, testID }: Props) => {
  return (
    <TouchableOpacity
      testID={testID}
      style={[styles.TakePictureButton, { backgroundColor: (!disabled) ? '#6D56FA' : 'grey' }]}
      onPress={onPress}
      disabled={disabled} >
        {
          cameraSelection === 'All Subjects'
            ? <Image source={require('../assets/focus.png')} style={styles.sendButton} />
            : <Image source={require('../assets/focus-1.png')} style={styles.sendButton} />
        }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  TakePictureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: "#f0f0f0",
    borderWidth: 4,
    position: 'absolute',
    bottom: "5%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    marginBottom: 15
  },
  sendButton: {
    width: '40%',
    height: '40%',
    tintColor: "white",
    transform: [{ rotate: '-180deg' }],
  }
})