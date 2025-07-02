import { StyleSheet, TouchableOpacity } from "react-native"

type Props = {
  onPress: () => void;
  testID?: string;
}

export const CameraButton = ({ onPress, testID }: Props) => {
  return (
    <TouchableOpacity testID={testID} style={[styles.TakePictureButton]} onPress={onPress} >
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
  },
})
