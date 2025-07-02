import { Dimensions } from 'react-native';
import ImageSize from 'react-native-image-size'
import ImageEditor from '@react-native-community/image-editor';
import { BoxCoordinates } from './constants';

export enum QUESTION_ERRORS {
  TEXT_RECOGNITION_ERROR = "TEXT_RECOGNITION_ERROR",
}

// interface CropResultWithoutBase64 {
//   height: number;
//   name: string;
//   path: string;
//   size: number;
//   type: string;
//   uri: string;
//   width: number;
// }

const blobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () => {
    resolve(reader.result);
  };
  reader.readAsDataURL(blob);
});

export const base64FromImageURI = async (uri: string): Promise<string> => {
  // For local files on Android, prepend file:// to the path
  const fullUri = uri.startsWith('/')
    ? `file://${uri}`
    : uri;

  try {
    const response = await fetch(fullUri);
    const blob = await response.blob();
    const base64Data = await blobToBase64(blob);
    return base64Data as string;
  } catch (error) {
    // Consider using React Native's built-in APIs for local files
    // if fetch doesn't work reliably
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

export const cropImageBasedOnRatio = async (path: string): Promise<string> => {
  const { width, height } = await ImageSize.getSize(path);

  const screenRatio = Dimensions.get('window').width / Dimensions.get('window').height;
  const widthFromScreenRatio = height * screenRatio;

  const cropData = {
    offset: { x: (width - widthFromScreenRatio) / 2, y: 0 },
    size: { width: widthFromScreenRatio, height },
  }
  const r = await ImageEditor.cropImage(path, cropData);
  return r.path;
}

export const cropImageBasedOnBox = async (path: string, boxCoordinates: BoxCoordinates): Promise<string> => {
  const fullUri = path.startsWith('/')
  ? `file://${path}`
  : path;

  const { width, height } = await ImageSize.getSize(fullUri);
  const screenRatio = Dimensions.get('window').width / Dimensions.get('window').height;
  const widthFromScreenRatio = height * screenRatio;

  const xPercentage = boxCoordinates.topLeftDot.x / Dimensions.get('window').width;
  const yPercentage = boxCoordinates.topLeftDot.y / Dimensions.get('window').height;
  const widthPercentage = (boxCoordinates.bottomRightDot.x - boxCoordinates.topLeftDot.x) / Dimensions.get('window').width;
  const heightPercentage = (boxCoordinates.bottomRightDot.y - boxCoordinates.topLeftDot.y) / Dimensions.get('window').height;

  const cropData = {
    offset: { x: xPercentage * widthFromScreenRatio, y: yPercentage * height },
    size: { width: widthPercentage * widthFromScreenRatio, height: heightPercentage * height },
  }

  const r = await ImageEditor.cropImage(fullUri, cropData);
  return  r.path;
}
/**
 * cropGalleryImageBasedOnBox takes an image path and a set of box coordinates, along with the screen's width and height,
 * to crop the image as it would appear on the screen. It calculates the visible dimensions of the image when scaled to fit
 * the screen while maintaining its aspect ratio. It then determines the crop area by calculating the relative position and size
 * of the box coordinates with respect to the scaled image displayed on the screen. These percentages are then applied to the
 * original dimensions of the image to obtain the exact offset and size for cropping. The function returns a URI of the cropped image.

 */
export const cropGalleryImageBasedOnBox = async (path: string, BoxCoordinates: BoxCoordinates): Promise<string> => {
  const { width: imageWidth, height: imageHeight } = await ImageSize.getSize(path);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  // Determine how the image is scaled to the screen
  const imageAspectRatio = imageWidth / imageHeight;
  const screenAspectRatio = screenWidth / screenHeight;

  let visibleWidth, visibleHeight, offsetX, offsetY;

  if (imageAspectRatio > screenAspectRatio) {
    // Image is wider than screen
    visibleWidth = screenWidth;
    visibleHeight = screenWidth / imageAspectRatio;
    offsetX = 0;
    offsetY = (screenHeight - visibleHeight) / 2; // Centered vertically
  } else {
    // Image is taller than screen
    visibleHeight = screenHeight;
    visibleWidth = screenHeight * imageAspectRatio;
    offsetY = 0;
    offsetX = (screenWidth - visibleWidth) / 2; // Centered horizontally
  }

  // Calculate the percentage of the visible image the BoxCoordinates cover
  const xPercentage = (BoxCoordinates.topLeftDot.x - offsetX) / visibleWidth;
  const yPercentage = (BoxCoordinates.topLeftDot.y - offsetY) / visibleHeight;
  const widthPercentage = (BoxCoordinates.bottomRightDot.x - BoxCoordinates.topLeftDot.x) / visibleWidth;
  const heightPercentage = (BoxCoordinates.bottomRightDot.y - BoxCoordinates.topLeftDot.y) / visibleHeight;

  // Apply these percentages to the original image's dimensions to get the cropData
  const cropData = {
    offset: {
      x: imageWidth * xPercentage,
      y: imageHeight * yPercentage,
    },
    size: {
      width: imageWidth * widthPercentage,
      height: imageHeight * heightPercentage,
    }
  };

  const r = await ImageEditor.cropImage(path, cropData);
  return r.path
};
