import { StyleSheet, Text, View, Pressable } from "react-native";

const ActorHeader = ({
  actorName
}) => {

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
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
        style={{ fontSize: 20, fontWeight: "bold", maxWidth: "90%" }}
      >
        {actorName}
      </Text>
    </View>
  );
};

export default ActorHeader;

const styles = StyleSheet.create({});
