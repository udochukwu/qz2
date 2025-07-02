import { NativeSyntheticEvent, TextInput, TextInputKeyPressEventData } from "react-native";
import { TouchableWrapper } from "../../../components/TouchableWrapper";
import { otpStyles } from "../styles";

type Props = {
  inputRef: React.RefObject<TextInput>;
  prevRef?: React.RefObject<TextInput>;
  nextRef?: React.RefObject<TextInput>;
  onChange: (d: string) => void;
  digit: string;
  disabled?: boolean;
}

export const SingleDigitInput = ({ inputRef, digit, prevRef, nextRef, onChange, disabled = false }: Props) => {

  const focus = (direction: "next" | "prev") => {
    if (direction === "next" && nextRef) {
      nextRef.current?.focus();
    }
    if (direction === "prev" && prevRef) {
      prevRef.current?.focus();
    }
  }

  const onKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === "Backspace") {
      onChange("");
      focus("prev");
    } else {
      // setDigit(e.nativeEvent.key);
      onChange(e.nativeEvent.key);
      focus("next");
    }
  }

  const onChangeText = (d: string) => {
    if (d.length === 6) {
      onChange(d);
    }
  }
  return (
    <TouchableWrapper focused={digit !== ""} style={otpStyles.singleDigit}>
      <TextInput
        ref={inputRef}
        textContentType="oneTimeCode"
        style={otpStyles.otpInput}
        value={digit}
        keyboardType="number-pad"
        maxLength={6}
        onKeyPress={onKeyPress}
        onChangeText={onChangeText}
        editable={!disabled}
      />
    </TouchableWrapper>
  )
};
