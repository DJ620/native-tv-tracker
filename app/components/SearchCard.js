import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

const SearchCard = ({ tvShow, showLibrary }) => {
  const router = useRouter();
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [network, setNetwork] = useState(null);
  const [genres, setGenres] = useState("");

  useEffect(() => {
    const inLibrary = showLibrary.some((show) => {
      return show.showId == tvShow.show.id;
    });
    setIsInLibrary(inLibrary);
    let whereToWatch =
      tvShow.show.network?.name || tvShow.show.webChannel?.name;
    setNetwork(whereToWatch);
    const showGenres = tvShow.show.genres?.join(", ") || tvShow.show.type;
    setGenres(showGenres);
  }, [tvShow]);

  return (
    <View>
      <Pressable
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
          backgroundColor: "#E0E0E0",
          height: 100,
        }}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/show",
            params: {
              showId: tvShow.show.id,
            },
          })
        }
      >
        <View style={{ flexDirection: "row", gap: 30 }}>
          <Image
            style={{
              resizeMode: "contain",
              height: "100%",
              width: 75,
            }}
            source={
              tvShow.show.image?.medium
                ? {
                    uri: tvShow.show.image?.medium,
                  }
                : require("../assets/images/poster-placeholder.png")
            }
          />
          <View style={{ maxWidth: 230 }}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={{
                fontSize: 20,
                paddingTop: 5,
                paddingBottom: 5,
              }}
            >
              {tvShow.show.name}
            </Text>
            <Text style={{ paddingBottom: 8 }}>
              {tvShow.show.premiered && new Date(tvShow.show.premiered).getFullYear()}{" "}
              {tvShow.show.ended && tvShow.show.ended !== tvShow.show.premiered
                ? "- " + new Date(tvShow.show.ended).getFullYear()
                : !tvShow.show.ended
                ? "-"
                : null}
            </Text>
            <Text style={{ fontSize: 16 }}>{network}</Text>
            <Text style={{ fontStyle: "italic" }}>{genres}</Text>
          </View>
        </View>
        {isInLibrary && (
          <View style={{ alignSelf: "center", paddingRight: 20 }}>
            <FontAwesome5 name="check" size={24} color="green" />
          </View>
        )}
      </Pressable>
    </View>
  );
};

export default SearchCard;

const styles = StyleSheet.create({});
