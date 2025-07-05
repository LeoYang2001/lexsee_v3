import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Screen = () => {
  return (
    <View className="p-12">
      <Link href="/(about)">
        <Text className="text-foreground">go to about</Text>
      </Link>
    </View>
  );
};

export default Screen;
