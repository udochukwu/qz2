import { StyleSheet } from "react-native";
import { inputStyles } from "../../components/styles";


export const viewStyles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputSection: {
    flex: 1,
    width: "100%",
    justifyContent: 'center',
    gap: 18,
  },
});

export const phoneStyles = StyleSheet.create({
 phoneWrapper: {
   display: 'flex',
   flexDirection: 'row',
   alignItems: 'center',
  },
  phoneInput: {
    ...inputStyles.numberInput,
    flex: 1,
    borderLeftWidth: 2,
    paddingLeft: 12,
    marginLeft: 12,
    borderColor: "#CECECE",
  },
});

export const otpStyles = StyleSheet.create({
  singleDigit: {
    width: 45,
    height: 45,
    alignItems: "center",
    borderRadius: 10
  },
  otpInput: {
    ...inputStyles.numberInput,
    height: 45,
    width: 45,
    textAlign: "center"
  }
});
