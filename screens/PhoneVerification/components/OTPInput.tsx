import React, { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import { SingleDigitInput } from "./SingleDigitInput";

type Props = {
  onOTPChange: (otp: string) => void;
}

export const OTPInput = ({ onOTPChange }: Props) => {
  const inputRefs = [...Array(6)].map(i => React.createRef<TextInput>());

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  useEffect(() => {
    const otp = digits.join("");
    onOTPChange(otp.length === 6 ? otp : "");
  }, [digits]);
  const onChange = (i: number, d: string) => {
    if (d.length === 6) {
      setDigits([...d.split("")]);
    }
    else {
      digits[i] = d;
      setDigits([...digits]);
    }
  }

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      {[...Array(6)].map((_, i) =>
        <SingleDigitInput key={i} onChange={d => onChange(i, d)} inputRef={inputRefs[i]} prevRef={i > 0 ? inputRefs[i - 1] : undefined} nextRef={i < 5 ? inputRefs[i + 1] : undefined} digit={digits[i]} />
      )}
    </View>
  );
};
