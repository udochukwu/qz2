import { NavigationProp, ParamListBase, useFocusEffect } from "@react-navigation/native";
import React, { useContext } from "react"
import { SafeAreaView, StyleSheet } from "react-native"
import { LoadingAnimation } from "../components/LoadingBar"
import ProfileContext from "../contexts/ProfileContext";
import { onboardingStackRouting } from "../services/common";
import { hasSessionId } from "../services/storage";

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

export const LoadingScreen = ({ navigation }: Props) => {
  const context = useContext(ProfileContext)
  useFocusEffect(() => {
    (async () => {
      if (!hasSessionId()) {
        navigation.navigate("Intro");
        return;
      }

      const redirect = await onboardingStackRouting(navigation);
      if (!redirect) {
        context.checkOnboarded();
      }
    })();
  });

  return (
    <SafeAreaView style={styles.container}>
      <LoadingAnimation style={{ flex: 1 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
