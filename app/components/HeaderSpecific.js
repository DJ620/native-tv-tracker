import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

const HeaderSpecific = ({pageName}) => {

  return (
    <View
      style={{
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingBottom:10,
        borderTopColor: "white",
        borderLeftColor: "white",
        borderRightColor: "white",
        borderBottomColor: "#f3f3f3",
        borderWidth: 1
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign:"center" }}>{pageName}</Text>
    </View>
  );
};

export default HeaderSpecific;

const styles = StyleSheet.create({});
