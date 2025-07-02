import React from 'react';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

export default function ReferralDivider(
{ isRedeemable }: { isRedeemable: boolean; 
}) {
    return (
        <View style={ isRedeemable ? styles.redeemableImage : styles.container}>
            <FastImage 
                source={ isRedeemable ? require("../../../../assets/inverted-border-redeemable.png") : require("../../../../assets/inverted-border.png")} 
                style={styles.image}
                resizeMode={FastImage.resizeMode.stretch}  // Adjusts the image to fill the width
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%', // Ensures the divider stretches across the full width of its parent
        height: 70, // Set a fixed height for the divider
        overflow: 'hidden', // Ensures nothing extends beyond the bounds of the view
    },
    redeemableImage: {
        width: '100%', // Ensures the divider stretches across the full width of its parent
        height: 85, // Set a fixed height for the divider
        overflow: 'hidden', // Ensures nothing extends beyond the bounds of the view     
    },
    image: {
        width: '100%', // Stretch the image to fill the container width
        height: '100%', // Match the container's height to maintain the aspect ratio
    },

});
