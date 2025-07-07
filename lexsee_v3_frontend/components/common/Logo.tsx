import { View, Image } from "react-native";
import React from "react";

interface LogoProps {
  width?: number;
  opacity?: number;
}

const Logo = ({ width = 60, opacity = 1 }: LogoProps) => {
  const widthHeightRatio = 60 / 24; // Width to height ratio of the logo
  const height = width / widthHeightRatio;

  return (
    <View className="p-1">
      <Image
        source={require("~/assets/images/logo.png")}
        style={{ width, height, opacity }}
      />
    </View>
  );
};

export default Logo;
