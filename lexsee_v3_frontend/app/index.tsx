import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const index = () => {
  return (
    <View>
      <Link href="/(main)/home">
        <Text>go to auth</Text>
      </Link>
      <Link href="/(auth)/sign_in">
        <Text>go to main</Text>
      </Link>
    </View>
  );
};

export default index;
