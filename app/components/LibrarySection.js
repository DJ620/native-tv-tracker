import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  useWindowDimensions,
} from "react-native";
import { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ImageLoader from "./ImageLoader";
import LibraryCard from "./LibraryCard";

const LibrarySection = ({ episodes, title }) => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [show, setShow] = useState(true);
  return (
    <View style={{ paddingBottom: 20, borderBottomColor: "#dfdfdf", borderBottomWidth:1, marginBottom: 20 }}>
      {episodes.length > 0 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingBottom: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#dfdfdf",
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 20,
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 16 }}>
              {title} ({episodes.length})
            </Text>
          </View>
          <Pressable
            style={{ position: "absolute", right: width * 0.055 }}
            onPress={() => setShow(!show)}
          >
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
            gap: width * 0.01,
            flexWrap: "wrap",
            paddingHorizontal: width * 0.055,
          }}
        >
          {episodes.map((show) => (
            <LibraryCard show={show} width={width} key={show.showId} title={title} />
          ))}
        </View>
      )}
    </View>
  );
};

export default LibrarySection;

const styles = StyleSheet.create({});
