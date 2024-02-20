import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { FontAwesome5 } from "@expo/vector-icons";

const ActorCredit = ({ item, index }) => {
  const router = useRouter();
  const showLibrary = useSelector((state) => state.showLibrary);
  const premiere = item.premiered && new Date(item?.premiered).getFullYear();
  const end = item.ended && new Date(item?.ended).getFullYear();
  const [isInLibrary, setIsInLibrary] = useState(false);

  useEffect(() => {
    setIsInLibrary(
      showLibrary.some((show) => {
        return show.showId === item.id;
      })
    );
  }, [item]);

  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/(tabs)/show",
          params: {
            showId: item.id,
          },
        });
      }}
      style={{
        flexDirection: "row",
        gap: 30,
        alignItems: "center",
        alignContent: "center",
        backgroundColor: "#dfdfdf",
        marginVertical: 5,
      }}
    >
      <Image
        source={
          item?.image?.medium
            ? { uri: item?.image?.medium }
            : require("../assets/images/poster-placeholder.png")
        }
        style={{
          resizeMode: "cover",
          height: 125,
          width: 80,
        }}
      />
      <View>
        <View style={{flexDirection:"row", justifyContent: "space-between", width: 250}}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{ fontSize: 20, paddingBottom: 5, maxWidth: 200 }}
          >
            {item?.name}
          </Text>
          {isInLibrary && <FontAwesome5 name="check" size={24} color="green" />}
        </View>
        <Text style={{ paddingBottom: 5 }}>
          {premiere} {end && end !== premiere ? "- " + end : !end ? "-" : null}
        </Text>
        <Text style={{ fontSize: 16, paddingBottom: 5 }}>
          {item?.network?.name || item?.webChannel?.name}
        </Text>
        <View style={{ maxWidth: 250 }}>
          <Text
            numberOfLines={2}
            style={{
              fontSize: 16,
              fontStyle: "italic",
            }}
          >
            {item.characterName.join(" / ")}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ActorCredit;

const styles = StyleSheet.create({});
