import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import { hapticEffect } from "../../../services/common";
import { launchImageLibrary } from 'react-native-image-picker';
import * as Sentry from '@sentry/react-native';

type Props = {
  flashOn: boolean;
  onFlashToggle: () => void;
  onKeyboardPress: () => void;
  onGallerySelection: (path: string) => void;
};

export const SecondaryActions = ({ onKeyboardPress, onGallerySelection, flashOn, onFlashToggle }: Props) => {

  const flashIcon = flashOn ? require('../../../assets/flash.png') : require('../../../assets/no-flash.png');

  const onInputPress = () => {
    hapticEffect();
    onKeyboardPress();
  }

  const onGalleryPress = async () => {
    hapticEffect();
    try {
      const result = await launchImageLibrary({ mediaType: "photo" });
      if (!result.didCancel && result.assets) {
        if (result.assets[0].uri) {
          onGallerySelection(result.assets[0].uri);
        } else {
          throw new Error("Gallery image URI was not available");
        }
      }
    } catch (e) {
      Sentry.captureException(`Failed to select image from gallery due to: ${e}`);
      console.error(e);
    }
  }

  return (
    <>
      <View style={styles.typeQuestionView}>
        <TouchableOpacity style={styles.recentResponsesButtonView} onPress={onInputPress} >
        <Image tintColor="#FFF" source={require('../../../assets/messenger.png')} style={styles.chat} />

        </TouchableOpacity>
      </View>
      <View style={styles.galleryView}>
        <TouchableOpacity style={styles.recentResponsesButtonView} onPress={onGalleryPress} >
          <Image source={require('../../../assets/gallery.png')} style={styles.galleryImg} />
        </TouchableOpacity>
      </View>
      <View style={styles.flashView}>
        <TouchableOpacity style={styles.recentResponsesButtonView} onPress={onFlashToggle} >
          <Image source={flashIcon} style={styles.flashImg} />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({

  recentResponsesButtonView: {
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 3,
  },
  typeQuestionView: {
    position: 'absolute',
    bottom: "5%",
    marginBottom: 15,
    zIndex: 1,
    right: "5%",
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 50
  },
  galleryView: {
    position: 'absolute',
    bottom: "5%",
    marginBottom: 15,
    zIndex: 1,
    right: "22%",
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 50
  },
  galleryImg: {
    width: 17,
    height: 17,
  },
  chat: {
    width: 20,
    height: 20,
    resizeMode: "contain"
  },
  flashView: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.32)',
    bottom: "5%",
    marginBottom: 15,
    zIndex: 1,
    left: "5%",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    borderRadius: 50
 },
  flashImg: {
    width: 13,
    height: 16
  },
});
