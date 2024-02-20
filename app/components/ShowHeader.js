import { Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

const ShowHeader = ({
  showName,
  handleShowLibrary,
  inLibrary,
  showHeaderButton,
}) => {
  useEffect(() => {
    console.log(showHeaderButton);
  }, [showHeaderButton]);
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingBottom: 5,
        borderTopColor: "white",
        borderLeftColor: "white",
        borderRightColor: "white",
        borderBottomColor: "#f3f3f3",
        borderWidth: 1,
      }}
    >
      <Text
        numberOfLines={1}
        style={{ fontSize: 16, fontWeight: "bold", maxWidth: "90%" }}
      >
        {showName}
      </Text>
      {showName && (
        <Pressable onPress={() => handleShowLibrary()} style={{}}>
          {inLibrary ? (
            <MaterialIcons name="highlight-remove" size={36} color="red" />
          ) : (
            <AntDesign name="pluscircleo" size={30} color="black" />
          )}
        </Pressable>
      )}
    </View>
  );
};

export default ShowHeader;

const styles = StyleSheet.create({});
