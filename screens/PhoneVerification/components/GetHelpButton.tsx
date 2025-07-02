import React from "react"
import { Button, Linking, StyleSheet, Text, TouchableOpacity } from "react-native"
import { textStyles } from "../../../components/styles";
import { useTranslation } from "react-i18next";

export const GetHelpButton = () => {
  const { t } = useTranslation();
  const onPress = () => {
    Linking.openURL("mailto:support@quizard.ai");
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.textStyle}>{t("phoneVerificationScreen.getHelp")}</Text>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  textStyle: {
    ...textStyles.nunitoFont,
    fontWeight: '500',
    fontSize: 16,
    color: "#3D3D3D"
  },
});
