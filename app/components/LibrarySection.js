import { StyleSheet, Text, View, Pressable, Image, useWindowDimensions } from "react-native";
import { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const LibrarySection = ({ episodes, title }) => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [show, setShow] = useState(true);
  return (
    <View style={{ paddingBottom: 20 }}>
      {episodes.length > 0 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingBottom: 20,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 16 }}>
            {title} ({episodes.length})
          </Text>
          <Pressable onPress={() => setShow(!show)}>
            <FontAwesome5
              name={show ? "caret-up" : "caret-down"}
              size={24}
              color="black"
              style={{ paddingLeft: 30 }}
            />
          </Pressable>
        </View>
      )}
      {episodes.length > 0 && show && (
        <View
          style={{
            flexDirection: "row",
            gap: 5,
            flexWrap: "wrap",
            paddingHorizontal: 20,
          }}
        >
          {episodes.map((show) => (
            <View key={show.showId}>
              <Pressable
                onPress={() => router.push({
                  pathname: "/(tabs)/show",
                  params: {
                    showId: show.showId,
                  },
                })}
              >
                <Image
                  style={{
                    resizeMode: "contain",
                    height: 175,
                    width: width * .29
                  }}
                  source={{
                    uri: show.image,
                  }} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default LibrarySection;

const styles = StyleSheet.create({});
