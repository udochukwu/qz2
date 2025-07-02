import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Dimensions, StyleSheet, PanResponder } from 'react-native';
import { OrientationType } from 'react-native-orientation-locker';

export interface DotCoordinates {
    topLeftDot: { x: number, y: number },
    topRightDot: { x: number, y: number },
    bottomLeftDot: { x: number, y: number },
    bottomRightDot: { x: number, y: number },
}

interface CropLayerProps {
    dotsCordinates: DotCoordinates,
    setDotsCordinates: (coordinates: DotCoordinates) => void,
    promptRetake: boolean,
    onRetakePicture: () => void,
    orientation: OrientationType
}

function CropLayer({
    dotsCordinates,
    setDotsCordinates,
    promptRetake,
    orientation
}: CropLayerProps) {
    const isLandscape = orientation === "LANDSCAPE-LEFT" || orientation === "LANDSCAPE-RIGHT"
    const { t } = useTranslation()
    const {width, height} = Dimensions.get('window');
    const box_width = (dotsCordinates.bottomRightDot.x - dotsCordinates.topLeftDot.x);
    const box_height = dotsCordinates.bottomRightDot.y - dotsCordinates.topLeftDot.y;

    const textOpacity = box_width > width / 2 ? 1 : 0;

    //create a pan responder to move the camera box for every dot
    const panResponderTopLeft =
        PanResponder.create({
            onPanResponderMove: (e, gestureState) => {

                // as long as the top left dot stays as the top left dot

                if ((gestureState.moveX + 30) < dotsCordinates.topRightDot.x && (gestureState.moveY + 30) < dotsCordinates.bottomLeftDot.y && (gestureState.moveY) > Dimensions.get('window').height * 0.1) {
                    setDotsCordinates({
                        topLeftDot: { x: gestureState.moveX, y: gestureState.moveY },
                        topRightDot: { x: dotsCordinates.topRightDot.x, y: gestureState.moveY },
                        bottomLeftDot: { x: gestureState.moveX, y: dotsCordinates.bottomLeftDot.y },
                        bottomRightDot: { x: dotsCordinates.bottomRightDot.x, y: dotsCordinates.bottomRightDot.y }

                    })
                }
            },
            onMoveShouldSetPanResponder: (e, gestureState) => {
                return true;
            }
        })

    const panResponderTopRight =
        PanResponder.create({
            onPanResponderMove: (e, gestureState) => {
                if ((gestureState.moveX - 30) > dotsCordinates.topLeftDot.x && (gestureState.moveY + 30) < dotsCordinates.bottomRightDot.y && (gestureState.moveY) > Dimensions.get('window').height * 0.1) {

                    setDotsCordinates({
                        topLeftDot: { x: dotsCordinates.topLeftDot.x, y: gestureState.moveY },
                        topRightDot: { x: gestureState.moveX, y: gestureState.moveY },
                        bottomRightDot: { x: gestureState.moveX, y: dotsCordinates.bottomRightDot.y },
                        bottomLeftDot: { x: dotsCordinates.bottomLeftDot.x, y: dotsCordinates.bottomLeftDot.y }
                    })
                }
            },
            onMoveShouldSetPanResponder: (e, gestureState) => {
                return true;
            }
        })

    const panResponderBottomLeft =
        PanResponder.create({
            onPanResponderMove: (e, gestureState) => {
                if ((gestureState.moveX + 30) < dotsCordinates.bottomRightDot.x && (gestureState.moveY - 30) > dotsCordinates.topLeftDot.y && (gestureState.moveY) < Dimensions.get('window').height * 0.85) {
                    setDotsCordinates({
                        bottomLeftDot: { x: gestureState.moveX, y: gestureState.moveY },
                        bottomRightDot: { x: dotsCordinates.bottomRightDot.x, y: gestureState.moveY },
                        topLeftDot: { x: gestureState.moveX, y: dotsCordinates.topLeftDot.y },
                        topRightDot: { x: dotsCordinates.topRightDot.x, y: dotsCordinates.topRightDot.y }
                    })
                }
            },
            onMoveShouldSetPanResponder: (e, gestureState) => {
                return true;
            }
        })

    const panResponderBottomRight =
        PanResponder.create({
            onPanResponderMove: (e, gestureState) => {
                if ((gestureState.moveX - 30) > dotsCordinates.bottomLeftDot.x && (gestureState.moveY - 30) > dotsCordinates.topRightDot.y && (gestureState.moveY) < Dimensions.get('window').height * 0.85) {
                    setDotsCordinates({
                        bottomRightDot: { x: gestureState.moveX, y: gestureState.moveY },
                        bottomLeftDot: { x: dotsCordinates.bottomLeftDot.x, y: gestureState.moveY },
                        topRightDot: { x: gestureState.moveX, y: dotsCordinates.topRightDot.y },
                        topLeftDot: { x: dotsCordinates.topLeftDot.x, y: dotsCordinates.topLeftDot.y }
                    })
                }
            },
            onMoveShouldSetPanResponder: (e, gestureState) => {
                return true;
            }
        })

    const cropTextConfig = orientation === "LANDSCAPE-LEFT" ? {
        textLeft: dotsCordinates.topRightDot.x - 160,
        textRotation: '90deg',
        opacity: (width - dotsCordinates.topRightDot.x) < 50 || box_height < height/3
    } : {
        textLeft: (dotsCordinates.topRightDot.x - box_width - 220),
        textRotation: '-90deg',
        opacity: ((width - dotsCordinates.topLeftDot.x) + 50) > width || box_height < height/3
    }

    return (
        <>
            {promptRetake &&
                <>
                    <Text style={[styles.instructionText, 
                        { 
                            opacity: isLandscape ? cropTextConfig.opacity ? 0 : 1 : textOpacity, 
                            top: isLandscape ? width  : dotsCordinates.topLeftDot.y - 50, 
                            left: isLandscape ? cropTextConfig.textLeft : dotsCordinates.topLeftDot.x, 
                            width: isLandscape ? height  : box_width ,
                            position: isLandscape ? "static" : "absolute",
                            transform: isLandscape ? [{ rotate: cropTextConfig.textRotation }]: []
                            }
                            ]}>
                        {t('cropLayer.instruction')}
                    </Text>

                    <View style={[styles.dot, { top: dotsCordinates.topLeftDot.y - 60 + 30, left: dotsCordinates.topLeftDot.x - 60 + 30 }]} {...panResponderTopLeft.panHandlers}>
                        <View style={styles.topLeftCorner} />
                    </View>

                    <View style={[styles.dot, { top: dotsCordinates.topRightDot.y - 60 + 30, left: dotsCordinates.topRightDot.x - 30 }]} {...panResponderTopRight.panHandlers}>
                        <View style={styles.topRightCorner} />
                    </View>

                    <View style={[styles.dot, { top: dotsCordinates.bottomLeftDot.y - 30, left: dotsCordinates.bottomLeftDot.x - 60 + 30 }]} {...panResponderBottomLeft.panHandlers}>
                        <View style={styles.bottomLeftCorner} />
                    </View>

                    <View style={[styles.dot, { top: dotsCordinates.bottomRightDot.y - 30, left: dotsCordinates.bottomRightDot.x - 30 }]} {...panResponderBottomRight.panHandlers}>
                        <View style={styles.bottomRightCorner} />
                    </View>
                </>
            }
        </>
    );
}

const styles = StyleSheet.create({
    borderView: {
        position: 'absolute',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'red',
    },
    instructionText: {
        position: 'absolute',
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        fontFamily: 'Nunito',
        fontWeight: "700",
        zIndex: 10,
    },
    dot: {
        position: 'absolute',
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2
    },
    topLeftCorner: {
        width: 30,
        height: 30,
        marginLeft: 30,
        marginTop: 30,
        backgroundColor: 'transparent',
        borderWidth: 4,
        borderLeftColor: '#6D56FA',
        borderTopColor: '#6D56FA',
        borderBottomColor: 'transparent',
        borderRightColor: 'transparent',
        //this should be 6 but due to a bug, this a workaround: https://github.com/facebook/react-native/issues/34722
        //  borderRadius: 6,
        zIndex: 1,
    },
    topRightCorner: {
        width: 30,
        height: 30,
        marginRight: 30,
        marginTop: 30,
        backgroundColor: 'transparent',
        borderWidth: 4,
        borderRightColor: '#6D56FA',
        borderTopColor: '#6D56FA',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        zIndex: 1,
    },
    bottomLeftCorner: {
        width: 30,
        height: 30,
        marginLeft: 30,
        marginBottom: 30,
        backgroundColor: 'transparent',
        borderWidth: 4,
        borderLeftColor: '#6D56FA',
        borderBottomColor: '#6D56FA',
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        zIndex: 1,
    },
    bottomRightCorner: {
        width: 30,
        height: 30,
        marginRight: 30,
        marginBottom: 30,
        backgroundColor: 'transparent',
        borderWidth: 4,
        borderBottomColor: '#6D56FA',
        borderRightColor: '#6D56FA',
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
        zIndex: 1,
    }
});

export default CropLayer;
