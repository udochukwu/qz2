import { Text, TouchableOpacity, PressableProps, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle } from "react-native";
import { PrimaryButton } from "./PrimaryButton";
import { TextButton } from "./TextButton";
import React from "react";

function Button({ disabledColor = "rgba(109, 86, 250, 0.46)", color = 'primary', ...props }) {
    return (
        <TouchableOpacity {...props} style={[styles.button,
        {
            backgroundColor: props.disabled ? disabledColor : color == 'secondary' ? "#FFFFFF" : "#6D56FA",
            borderColor: color == 'secondary' ? "#6D56FA" : "transparent",
            borderWidth: color == 'secondary' ? 2 : 0,

        }, props.style]} />
    );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Button;

export {
  PrimaryButton,
  TextButton,
};
