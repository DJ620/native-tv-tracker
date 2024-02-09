import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    AsyncStorage.removeItem("token");
    router.push("/(authenticate)/login");
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
        borderTopColor: "white",
        borderLeftColor: "white",
        borderRightColor: "white",
        borderBottomColor: "#f3f3f3",
        borderWidth: 1,
        marginBottom: 10,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>TV Tracker</Text>
      <Pressable onPress={handleLogout}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
