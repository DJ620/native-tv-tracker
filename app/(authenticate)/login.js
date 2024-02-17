import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { Feather, AntDesign, Entypo } from "@expo/vector-icons";
import api from "../utils/api";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validation, setValidation] = useState(false);
  const [revealPassword, setRevealPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      api.login({ username, password }).then(async (res) => {
        if (res.data.success) {
          const userToken = res.data.token;
          await AsyncStorage.setItem("token", userToken);
          setUsername("");
          setPassword("");
          setLoading(false);
          router.push("/(tabs)/library");
        } else {
          setLoading(false);
          Alert.alert("Login failed", res.data.message);
        }
      });
    } catch (error) {
      setLoading(false);
      console.log("error", error);
      Alert.alert(
        "Login failed",
        "An error occurred while trying to log you in"
      );
    }
  };

  useEffect(() => {
    if (username === "" || password === "") {
      setValidation(false);
    } else {
      setValidation(true);
    }
  }, [username, password]);

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text style={{ fontSize: 30 }}>TV Tracker</Text>
        <Text style={{ marginTop: 80, fontSize: 16 }}>
          Sign in to your account
        </Text>
      </View>
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ marginTop: 30, paddingHorizontal: 40 }}>
            <Text>Username</Text>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                backgroundColor: "#E0E0E0",
                paddingVertical: 10,
                marginTop: 5,
              }}
            >
              <Feather
                name="user"
                size={24}
                color="gray"
                style={{ marginLeft: 8 }}
              />
              <TextInput
                autoCapitalize="none"
                value={username}
                onChangeText={(text) => setUsername(text)}
                style={{ width: 200 }}
                placeholder="Enter your Username"
              />
            </View>

            <Text style={{ marginTop: 20 }}>Password</Text>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                backgroundColor: "#E0E0E0",
                paddingVertical: 10,
                marginTop: 5,
                justifyContent:"space-between"
              }}
            >
              <View style={{flexDirection:"row"}}>
              <AntDesign
                name="lock1"
                size={24}
                color="gray"
                style={{ marginLeft: 8 }}
              />
              <TextInput
                autoCapitalize="none"
                secureTextEntry={revealPassword ? false : true}
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={{ width: 200,marginLeft:9 }}
                placeholder="Enter your Password"
              />
              </View>
              <Pressable
                onPress={() => setRevealPassword(!revealPassword)}
                style={{ alignSelf: "center", marginRight: 20 }}
              >
                <Entypo
                  name={revealPassword ? "eye-with-line" : "eye"}
                  size={20}
                  color="gray"
                />
              </Pressable>
            </View>

            <Pressable
              onPress={validation ? handleLogin : null}
              style={[styles.loginBtn, !validation && styles.loginBtnDisabled]}
            >
              <Text
                style={{ color: "white", textAlign: "center", fontSize: 16 }}
              >
                Login
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(authenticate)/register")}
              style={{ marginTop: 10 }}
            >
              <Text style={{ textAlign: "center" }}>
                Don't have an account? Register here
              </Text>
            </Pressable>
            {loading && (
              <ActivityIndicator
                size={"large"}
                color={"black"}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default login;

const styles = StyleSheet.create({
  loginBtn: {
    marginTop: 80,
    backgroundColor: "black",
    width: 200,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 15,
    borderRadius: 5,
  },
  loginBtnDisabled: {
    opacity: 0.5,
  },
});
