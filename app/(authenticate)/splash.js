import { StyleSheet, Text, View, StatusBar, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import api from "../utils/api";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import token from "../utils/token";

const splash = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      handleVerify();
    }, 1000);
  }, []);

  const handleVerify = async () => {
    const userToken = await token.getToken();
    await api.verify(userToken).then((res) => {
      if (res.data.success) {
        router.push("/(tabs)/library");
      } else {
        router.push("/(authenticate)/login");
        AsyncStorage.removeItem("token");
      }
    });
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "white", justifyContent: "center" }}
    >
      <StatusBar />
      <Text style={{ textAlign: "center", fontSize: 50, marginBottom:100 }}>TV Tracker</Text>
      <ActivityIndicator size={"large"}/>
    </View>
  );
};

export default splash;

const styles = StyleSheet.create({});
