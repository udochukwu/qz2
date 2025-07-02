import React from "react";
import { TouchableOpacity } from "react-native";
import FastImage from 'react-native-fast-image'

type Props = {
  onClick?: () => void;
}

export const BackArrow = ({ onClick }: Props) => {
  return (
    <TouchableOpacity onPress={onClick} style={{ padding: 10 }}>
      <FastImage source={require("../assets/back.png")} style={{ width: 17, height: 17 }} tintColor={"#5D5D5D"} />
    </TouchableOpacity>
  );
};
