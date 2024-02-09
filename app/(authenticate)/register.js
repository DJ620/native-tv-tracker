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
import { Feather, AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import api from "../utils/api";
import { useRouter } from "expo-router";

const register = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validation, setValidation] = useState(false);
  const [revealPassword, setRevealPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (email === "" || password === "" || username === "") {
      setValidation(false);
    } else {
      setValidation(true);
    }
  }, [email, username, password]);

  const handleRegister = () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      api.createUser({ email, username, password }).then((res) => {
        console.log("res", res.data);
        if (res.data.success) {
          setLoading(false);
          Alert.alert(
            "Registration successful",
            "You have been registed successfully"
          );
          setUsername("");
          setPassword("");
          setEmail("");
        } else {
          setLoading(false);
          Alert.alert("Registration failed", res.data.err.message);
        }
      });
    } catch (error) {
      setLoading(false);
      console.log("error", error);
      Alert.alert(
        "Registration failed",
        "An error occurred during registration"
      );
    }
  };
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text style={{ fontSize: 30 }}>TV Tracker</Text>
        <Text style={{ marginTop: 80, fontSize: 16 }}>Create account</Text>
      </View>
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ marginTop: 30, paddingHorizontal: 40 }}>
            <Text>Email Address</Text>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                backgroundColor: "#E0E0E0",
                paddingVertical: 10,
                marginTop: 5,
              }}
            >
              <MaterialIcons
                name="email"
                size={24}
                color="gray"
                style={{ marginLeft: 8 }}
              />
              <TextInput
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={{ width: 200 }}
                placeholder="Enter your email address"
              />
            </View>

            <Text style={{ marginTop: 20 }}>Username</Text>
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
              }}
            >
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
                style={{ width: 200 }}
                placeholder="Enter your Password"
              />
              <Pressable
                onPress={() => setRevealPassword(!revealPassword)}
                style={{ alignSelf: "center", marginLeft: 15 }}
              >
                <Entypo
                  name={revealPassword ? "eye-with-line" : "eye"}
                  size={20}
                  color="gray"
                />
              </Pressable>
            </View>

            <Pressable
              onPress={validation ? handleRegister : null}
              style={[
                styles.registerBtn,
                !validation && styles.registerBtnDisabled,
              ]}
            >
              <Text
                style={{ color: "white", textAlign: "center", fontSize: 16 }}
              >
                Register
              </Text>
            </Pressable>

            <Pressable
              style={{ marginTop: 10 }}
              onPress={() => router.push("/(authenticate)/login")}
            >
              <Text style={{ textAlign: "center" }}>
                Already have an account? Sign in here
              </Text>
            </Pressable>
            {loading ? (
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
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default register;

const styles = StyleSheet.create({
  registerBtn: {
    marginTop: 80,
    width: 200,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 15,
    borderRadius: 5,
    backgroundColor: "black",
  },
  registerBtnDisabled: {
    opacity: 0.5,
  },
});
