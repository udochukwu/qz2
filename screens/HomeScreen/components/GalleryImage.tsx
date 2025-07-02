import { Image, StyleSheet } from "react-native";
import { SendButton } from "../../../components/SendButton";
import { CameraModes } from "..";

type Props = {
  image: string;
  onSend: () => void;
  cameraSelection: CameraModes;
}

export const GalleryImage = ({ image, onSend, cameraSelection }: Props) => {
  return (
    <>
      <Image style={[StyleSheet.absoluteFill, styles.selectedGalleryImage]}
        source={{ uri: image }} />
      <SendButton cameraSelection={cameraSelection} disabled={false} onPress={onSend} />
    </>
  );
}

const styles = StyleSheet.create({
  selectedGalleryImage: {
    alignSelf: 'center',
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain'
  },
});
