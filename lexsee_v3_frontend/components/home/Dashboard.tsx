import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const Dashboard = () => {
  return (
    <LinearGradient
      // Button Linear Gradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        height: 100,
        borderRadius: 12,
      }}
      colors={["#f73d02", "#fe511a"]}
      className="relative flex flex-row items-center justify-between px-4"
    >
      <Image
        className="absolute right-0"
        style={{ width: 140, height: 110 }}
        source={require("../../assets/images/dashboardBg.png")}
      />
      <View className="flex w-full h-full flex-row items-center gap-4 px-4">
        <TouchableOpacity
          className=" flex-1 flex h-full flex-col items-start   justify-center gap-1"
          style={{ zIndex: 1 }}
        >
          <Text style={{ fontSize: 28 }} className="text-white font-semibold">
            3
          </Text>
          <Text className="text-white opacity-80">Word</Text>
        </TouchableOpacity>
        <View
          style={{
            width: 1,
            height: 12,
            opacity: 0.2,
            backgroundColor: "#fff",
            borderRadius: 1,
          }}
        />
        <TouchableOpacity
          className=" flex-1 flex h-full flex-col items-start   justify-center gap-1"
          style={{ zIndex: 1 }}
        >
          <Text style={{ fontSize: 28 }} className="text-white font-semibold">
            6
          </Text>
          <Text className="text-white opacity-80">Story</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default Dashboard;
