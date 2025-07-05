import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const index = () => {
  return (
    <View className=" p-12">
      <Link href="/(home)">
        <Text className="text-foreground">go to main</Text>
      </Link>

      <Link href="/(auth)/sign_in">
        <Text className="text-foreground">go to auth</Text>
      </Link>
    </View>
  );
};

export default index;
