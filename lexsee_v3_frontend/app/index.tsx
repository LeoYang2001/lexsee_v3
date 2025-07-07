import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const index = () => {
  return (
    <View className=" p-12">
      <Link href="/(about)">
        <Text className="text-foreground">go to about</Text>
      </Link>

      <Link href="/(auth)/sign_in">
        <Text className="text-foreground">go to auth</Text>
      </Link>
      <Link href="/(home)">
        <Text className="text-foreground">go to main</Text>
      </Link>
    </View>
  );
};

export default index;
