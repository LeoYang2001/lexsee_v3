import {
  View,
  Text,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { signIn as amplifySignIn } from "aws-amplify/auth";
import { H1 } from "~/components/ui/typography";
import { Button } from "~/components/ui/button";
import { useDispatch } from "react-redux";
import { BlurView } from "expo-blur";

const signIn = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogIn = async () => {
    try {
      const result = await amplifySignIn({
        username: email,
        password,
      });
      if (result.nextStep.signInStep === "CONFIRM_SIGN_UP") {
        // router.navigate("ConfirmEmail", { email });
      } else if (result.nextStep.signInStep === "DONE") {
        return;
      } else {
        console.log("Problem with LogInScreen");
      }
    } catch (e) {
      console.error("Error logging in:", e);
      // dispatch(
      //   showToast({
      //     title: "Error logging in",
      //     context: e instanceof Error ? e.message : String(e),
      //     type: ToastType.Error,
      //   })
      // );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="bg-white h-full w-full">
        {/* <Toast /> */}
        {/* background */}
        {/* <ImageBackground
          style={{ height: "100%" }}
          source={require("../../assets/background.png")}
          resizeMode="cover"
          className="flex flex-col justify-center opacity-20"
        ></ImageBackground> */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="justify-around w-full h-full absolute px-4"
        >
          {/* Title */}
          <View className="h-40" />
          <View className="gap-3">
            <H1>Log In</H1>
          </View>
          {/* Form */}
          <View>
            <Text className="text-lg opacity-50">Email</Text>
            <View className="flex-row items-center rounded-2xl relative">
              <View
                style={{ borderRadius: 16, overflow: "hidden" }}
                className="w-full bg-black/10"
              >
                <BlurView intensity={20} className="py-4 px-4 bg-white/10">
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="oneTimeCode"
                  />
                </BlurView>
              </View>
            </View>
            <Text className="text-lg opacity-50">Password</Text>
            <View className="flex-row items-center relative">
              <View
                style={{ borderRadius: 16, overflow: "hidden" }}
                className="w-full bg-black/10"
              >
                <BlurView intensity={20} className="py-4 px-4">
                  <TextInput
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </BlurView>
              </View>
            </View>
          </View>
          {/* Submit */}
          <View className="gap-1">
            <Button onPress={handleLogIn} className="bg-theme">
              <Text className="text-white font-semibold">LogIn</Text>
            </Button>
            <TouchableOpacity
              onPress={() => {
                router.navigate("/signUp");
              }}
              className="flex-row justify-center gap-1"
            >
              <Text className="opacity-50">Already have an account?</Text>
              <Text className="font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default signIn;
