import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { Link } from "expo-router";
import Logo from "~/components/common/Logo";
import Colors from "~/constants"; // Adjust the import path as necessary
import { ChevronDown, Triangle } from "lucide-react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native"; // Add this import
import InputBox from "~/components/home/InputBox";
import Dashboard from "~/components/home/Dashboard";
import { mockWordList } from "~/data/wordslist_mock";
import FlexCard from "~/components/common/FlexCard";

const Screen = () => {
  const navigation = useNavigation(); // Add this line

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer()); // Add this function
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.homeBackground,
      }}
      className="container-column  "
    >
      <View
        style={{
          paddingHorizontal: 18,
        }}
        className="flex-1  flex flex-col justify-start "
      >
        <View className=" w-full flex flex-row justify-between items-center">
          <Logo />
          <View className=" flex flex-row gap-4 ">
            <View className=" flex flex-row items-center gap-1">
              <Text style={{ color: "#fff", opacity: 0.7 }}>English</Text>
              <ChevronDown size={18} color={"#fff"} opacity={0.7} />
            </View>
            <TouchableOpacity onPress={openDrawer} className="  p-1">
              <Image
                style={{
                  width: 22,
                  height: 22,
                }}
                source={require("~/assets/images/menuIcon.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View className="mt-7">
          <InputBox />
        </View>
        <View className="mt-7">
          <Dashboard />
        </View>
        <View className="mt-7">
          <Text
            style={{
              fontSize: 12,
            }}
            className="text-white opacity-70"
          >
            Recently Pinned
          </Text>
        </View>
        <ScrollView className="mt-4 flex-1 ">
          <View className="flex-col flex-wrap gap-2">
            {mockWordList.map((word) => (
              <FlexCard
                key={word.id}
                word={word}
                ifDetail={false}
                ifGraphic={false}
              />
            ))}
          </View>
        </ScrollView>
        <Link href="/(about)" className="text-blue-500 mt-4">
          Go to About
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Screen;

