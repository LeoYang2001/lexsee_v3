import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Search } from "lucide-react-native";

const InputBox = () => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#30343a",
        height: 49,
        borderRadius: 12,
      }}
      className="flex flex-row items-center px-4"
    >
      <Search size={22} color={"#fff"} opacity={0.6} />
    </TouchableOpacity>
  );
};

export default InputBox;
