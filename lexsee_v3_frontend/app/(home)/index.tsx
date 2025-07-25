import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  LayoutChangeEvent,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "expo-router";
import Logo from "~/components/common/Logo";
import Colors from "~/constants"; // Adjust the import path as necessary
import { ChevronDown, Triangle } from "lucide-react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native"; // Add this import
import InputBox from "~/components/home/InputBox";
import Dashboard from "~/components/home/Dashboard";
import { mockWordList } from "~/data/wordslist_mock";
import FlexCard from "~/components/common/FlexCard";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const Screen = () => {
  const navigation = useNavigation(); // Add this line

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer()); // Add this function
  };

  const [ifHideTop, setIfHideTop] = useState(false);

  useEffect(() => {
    console.log(ifHideTop, "ifHideTop");
  }, [ifHideTop]);

  const scrollYRef = useRef(0);
  const lastToggleTimeRef = useRef(Date.now());

  const top = useSharedValue(0);
  const topHeight = useRef(0);

  // threshold values
  const SCROLL_THRESHOLD = 15; // Minimum deltaY to consider it fast enough
  const TIME_THRESHOLD = 150; // Min ms between toggles to avoid jitter

  const handleScroll = (event: any) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const deltaY = currentY - scrollYRef.current;

    const now = Date.now();
    const timeDiff = now - lastToggleTimeRef.current;

    if (Math.abs(deltaY) > SCROLL_THRESHOLD && timeDiff > TIME_THRESHOLD) {
      if (deltaY > 0) {
        // scrolling up (content moving up)
        setIfHideTop(true);
      } else {
        // scrolling down (content moving down)
        setIfHideTop(false);
      }
      lastToggleTimeRef.current = now;
    }

    scrollYRef.current = currentY;
  };

  // Animate based on state
  useEffect(() => {
    top.value = withTiming(ifHideTop ? -topHeight.current : 0, {
      duration: 300,
    });
  }, [ifHideTop]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: -100,
    };
  });

  const onTopLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    topHeight.current = height;
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
          top: 0,
        }}
        className="flex-1  flex flex-col justify-start "
      >
        <View onLayout={onTopLayout} style={[animatedStyle]}>
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
        <ScrollView
          scrollEventThrottle={16}
          onScroll={handleScroll}
          className="mt-4 flex-1  border border-white"
        >
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
