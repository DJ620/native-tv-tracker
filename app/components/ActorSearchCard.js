import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import ImageLoader from "./ImageLoader";

const ActorSearchCard = ({ actor }) => {
  const router = useRouter();

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
        onPress={() => {
          router.push({
            pathname: "/(tabs)/actor",
            params: {
              actorId: actor.person.id,
              actorName: actor.person.name,
              actorBirthday: actor.person.birthday,
              actorCountry: actor.person.country.name,
              actorPicture: actor.person.image?.medium,
            },
          });
        }}
      >
        <View style={{ flexDirection: "row", gap: 30, alignItems:"center" }}>
          <ImageLoader
            style={{
              resizeMode: "cover",
              height: "100%",
              width: 75,
            }}
            source={
              actor.person.image?.medium
                ? {
                    uri: actor.person.image.medium,
                  }
                : {
                    uri: "https://i0.wp.com/www.ms915brooklyn.org/wp-content/uploads/2021/08/placeholder-240x300-1.jpg?resize=240%2C300&ssl=1",
                  }
            }
          />
          <Text style={{fontSize:20}}>{actor.person.name}</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default ActorSearchCard;

const styles = StyleSheet.create({});
