import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface DashboardProps {
  ifReviewInfo?: boolean;
}

interface ReviewInfoProps {
  ifReviewInfo: {
    toBeReviewed: number;
    reviewed: number;
  };
}
const ReviewInfoComponent = ({ ifReviewInfo }: ReviewInfoProps) => {
  return (
    <View className="flex-1 flex-col items-center justify-center">
      <View>
        <View>
          <Text className="text-white">
            To Be Reviewed: {ifReviewInfo.toBeReviewed}
          </Text>
          <Text className="text-white">Reviewed: {ifReviewInfo.reviewed}</Text>
        </View>
        <Text>to review today</Text>
      </View>
    </View>
  );
};

const Dashboard = () => {
  const [ifReviewInfo, setIfReviewInfo] = useState(true);

  const toggleReviewInfo = () => {
    setIfReviewInfo((prev) => !prev);
  };

  const height = useSharedValue(100);
  const opacity = useSharedValue(0);

  const mockReviewInfo = {
    toBeReviewed: 15,
    reviewed: 17,
  };

  const duration = 250; // Duration for the animations
  useEffect(() => {
    if (ifReviewInfo) {
      height.value = withTiming(200, { duration: duration });
      opacity.value = withTiming(1, { duration: duration });
    } else {
      height.value = withTiming(100, { duration: duration });
      opacity.value = withTiming(0, { duration: duration });
    }
  }, [ifReviewInfo]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  const bottomViewStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        containerStyle,
        {
          overflow: "hidden",
          position: "relative",
          justifyContent: "flex-start",
        },
      ]}
    >
      <TouchableOpacity
        onPress={toggleReviewInfo}
        style={{
          zIndex: 10,
        }}
      >
        <LinearGradient
          // Button Linear Gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["#f73d02", "#fe511a"]}
          style={{
            height: 100,
            borderRadius: 12,
          }}
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
              <Text
                style={{ fontSize: 28 }}
                className="text-white font-semibold"
              >
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
              <Text
                style={{ fontSize: 28 }}
                className="text-white font-semibold"
              >
                6
              </Text>
              <Text className="text-white opacity-80">Story</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
      <Animated.View
        style={[
          bottomViewStyle,
          {
            top: -10,
            zIndex: 0,
          },
        ]}
        className="  flex-1"
      >
        <LinearGradient
          // Button Linear Gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["#292526", "#572e24", "#292526"]}
          style={{
            height: "100%",
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            zIndex: 10,
          }}
          className="relative flex flex-row items-center justify-between px-4"
        >
          <ReviewInfoComponent ifReviewInfo={mockReviewInfo} />
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
};

export default Dashboard;
