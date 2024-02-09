import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Suspense } from "react";

const Cast = ({ showCast }) => {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <TouchableOpacity activeOpacity={0.99} style={{ flexDirection: "row" }}>
        {showCast?.map((cast, index) => {
          return (
            <View
              key={index}
              style={{
                width: "auto",
                paddingHorizontal: 10,
                alignItems: "center",
              }}
            >
              <Suspense fallback={<Text>Loading...</Text>}>
                <Image
                  style={{
                    resizeMode: "contain",
                    height: 100,
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
              </Suspense>
              <Text>{cast.person.name}</Text>
              <Text style={{ fontStyle: "italic" }}>{cast.character.name}</Text>
            </View>
          );
        })}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Cast;

const styles = StyleSheet.create({});
