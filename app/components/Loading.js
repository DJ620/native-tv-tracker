import { StyleSheet, ActivityIndicator, View } from "react-native";
import React from "react";

const Loading = () => {
  return (
    <View
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        marginTop: 30,
        backgroundColor: "white",
        opacity: 0.5,
      }}
    >
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
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
