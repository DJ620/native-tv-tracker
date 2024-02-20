import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";

const Cast = ({ showCast, setShowInfoModal }) => {
  const router = useRouter();

//   showCast?.sort((a, b) => {
//     return a.person.name.localeCompare(b.person.name);
//   });

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <TouchableOpacity
        activeOpacity={0.99}
        style={{ flexDirection: "row", gap: 1 }}
      >
        {showCast?.map((cast, index) => {
          return (
            <View
              key={index}
              style={{
                width: 105,
                paddingHorizontal: 5,
                alignItems: "center",
              }}
            >
              <Pressable
                onPress={() => {
                  setShowInfoModal && setShowInfoModal(false);
                  router.push({
                    pathname: "/(tabs)/actor",
                    params: {
                      actorId: cast?.person?.id,
                      actorName: cast?.person?.name,
                      actorBirthday: cast?.person?.birthday,
                      actorCountry: cast?.person?.country?.name,
                      actorPicture:
                        cast.person?.image?.medium ||
                        cast.character?.image?.medium ||
                        "https://i0.wp.com/www.ms915brooklyn.org/wp-content/uploads/2021/08/placeholder-240x300-1.jpg?resize=240%2C300&ssl=1",
                    },
                  });
                }}
              >
                <Image
                  style={{
                    resizeMode: "cover",
                    height: 140,
                    width: 100,
                    marginTop: 10,
                  }}
                  source={{
                    uri:
                      cast.character?.image?.medium ||
                      cast.person?.image?.medium ||
                      "https://i0.wp.com/www.ms915brooklyn.org/wp-content/uploads/2021/08/placeholder-240x300-1.jpg?resize=240%2C300&ssl=1",
                  }}
                />
              </Pressable>
              <Text numberOfLines={1}>{cast.person.name}</Text>
              <Text numberOfLines={1} style={{ fontStyle: "italic" }}>
                {cast.character.name}
              </Text>
            </View>
          );
        })}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Cast;

const styles = StyleSheet.create({});
