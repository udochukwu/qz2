import { StyleSheet } from "react-native";

export const dynamicSurveyStyles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 12,
  },
  innerContent: {
    padding: 24,
  }
});

export const openEndendStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    height: 150,
    justifyContent: 'flex-start',
  }
});

export const selectStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerContent: {
    display: 'flex',
    gap: 12,
  },
  option: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  radioButton: {
    width: 20,
    height: 20,
  }
});
