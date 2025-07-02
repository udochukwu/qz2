import { Dimensions } from "react-native";

const CAMERA_BOX_X_PERCENTAGE = 0.05;
const CAMERA_BOX_Y_PERCENTAGE = 0.3;
const CAMERA_BOX_HEIGHT_PERCENTAGE = 0.2;
const CAMERA_BOX_WIDTH_PERCENTAGE = 0.9;
const CAMERA_BOX_WIDTH = Dimensions.get('window').width * CAMERA_BOX_WIDTH_PERCENTAGE
const CAMERA_BOX_HEIGHT = Dimensions.get('window').height * CAMERA_BOX_HEIGHT_PERCENTAGE
const CAMERA_BOX_X = Dimensions.get('window').width * CAMERA_BOX_X_PERCENTAGE
const CAMERA_BOX_Y = Dimensions.get('window').height * CAMERA_BOX_Y_PERCENTAGE

type BoxCoordinates = {
  topLeftDot: { x: number, y: number },
  topRightDot: { x: number, y: number },
  bottomLeftDot: { x: number, y: number },
  bottomRightDot: { x: number, y: number },
}

const initialDotCordinates: BoxCoordinates = {
  topLeftDot: { x: CAMERA_BOX_X, y: CAMERA_BOX_Y },
  topRightDot: { x: CAMERA_BOX_X + CAMERA_BOX_WIDTH, y: CAMERA_BOX_Y },
  bottomLeftDot: { x: CAMERA_BOX_X, y: CAMERA_BOX_Y + CAMERA_BOX_HEIGHT },
  bottomRightDot: { x: CAMERA_BOX_X + CAMERA_BOX_WIDTH, y: CAMERA_BOX_Y + CAMERA_BOX_HEIGHT }
}

const getRotatedCoordinates = (): BoxCoordinates => {
  const CAMERA_BOX_X_PERCENTAGE = 0.3;
  const CAMERA_BOX_Y_PERCENTAGE = 0.2;
  const CAMERA_BOX_HEIGHT_PERCENTAGE = 0.6;
  const CAMERA_BOX_WIDTH_PERCENTAGE = 0.4;
  const CAMERA_BOX_WIDTH = Dimensions.get('window').width * CAMERA_BOX_WIDTH_PERCENTAGE
  const CAMERA_BOX_HEIGHT = Dimensions.get('window').height * CAMERA_BOX_HEIGHT_PERCENTAGE
  const CAMERA_BOX_X = Dimensions.get('window').width * CAMERA_BOX_X_PERCENTAGE
  const CAMERA_BOX_Y = Dimensions.get('window').height * CAMERA_BOX_Y_PERCENTAGE

  return {
    topLeftDot: { x: CAMERA_BOX_X, y: CAMERA_BOX_Y },
    topRightDot: { x: CAMERA_BOX_X + CAMERA_BOX_WIDTH, y: CAMERA_BOX_Y },
    bottomLeftDot: { x: CAMERA_BOX_X, y: CAMERA_BOX_Y + CAMERA_BOX_HEIGHT },
    bottomRightDot: { x: CAMERA_BOX_X + CAMERA_BOX_WIDTH, y: CAMERA_BOX_Y + CAMERA_BOX_HEIGHT }
  }
}


export { initialDotCordinates, getRotatedCoordinates };

export type { BoxCoordinates };
