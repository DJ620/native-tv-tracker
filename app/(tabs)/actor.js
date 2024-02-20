import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import tvMazeApi from "../utils/tvMazeApi";
import ActorHeader from "../components/ActorHeader";
import ActorCredit from "../components/ActorCredit";
import Loading from "../components/Loading";

const actor = () => {
  const router = useRouter();
  const { actorId, actorName, actorBirthday, actorCountry, actorPicture } =
    useLocalSearchParams();
  const [credits, setCredits] = useState([]);
  const [actorAge, setActorAge] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCredits([]);
    getActorCredits();
    actorBirthday && setActorAge(exactAge(actorBirthday));
  }, [actorId]);

  const getActorCredits = async () => {
    setLoading(true);
    const actorInfo = await tvMazeApi.getActorCredits(actorId);
    // const actorGuestCredits = await tvMazeApi.getActorGuestCredits(actorId);
    // let guestCredits = actorGuestCredits.data.map((record) => record._embedded);
    // let noGuestRepeats = [];
    // guestCredits.forEach((record) => {
    //   const index = noGuestRepeats.findIndex(
    //     (show) =>
    //       show.episode._links.show.href === record.episode._links.show.href
    //   );
    //   if (index === -1) {
    //     noGuestRepeats.push(record);
    //   }
    // });
    //   let guestShows = [];
    //   for await (const record of noGuestRepeats) {
    //     const res = await tvMazeApi.getGuestCreditShow(
    //       record.episode._links.show.href
    //     );
    //     const guestShowRecord = {
    //       show: res.data,
    //       character: record.character,
    //     };
    //     guestShows.push(guestShowRecord);
    //   }

    // let actorCredits = actorInfo.data.map((record) => record._embedded).concat(guestShows);
    let actorCredits = actorInfo.data.map((record) => record._embedded);
    actorCredits.sort((a, b) => {
      return b.show.premiered.localeCompare(a.show.premiered);
    });
    let showOnly = actorCredits.map((record) => {
      let show = record.show;
      show.characterName = [record.character.name];
      return show;
    });
    let noShowRepeats = [];
    showOnly.forEach((record) => {
      const index = noShowRepeats.findIndex((show) => record.id === show.id);
      if (index === -1) {
        noShowRepeats.push(record);
      } else {
        noShowRepeats[index].characterName.push(...record.characterName);
      }
    });
    setCredits(noShowRepeats);
    setLoading(false);
  };

  const exactAge = (birthdate) => {
    let startDate = new Date(new Date(birthdate).toISOString().substr(0, 10));
    const endingDate = new Date().toISOString().substr(0, 10); // YYYY-MM-DD
    let endDate = new Date(endingDate);
    if (startDate > endDate) {
      const swap = startDate;
      startDate = endDate;
      endDate = swap;
    }
    const startYear = startDate.getFullYear();

    // Leap years
    const february =
      (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0
        ? 29
        : 28;
    const daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let yearDiff = endDate.getFullYear() - startYear;
    let monthDiff = endDate.getMonth() - startDate.getMonth();
    let dayDiff = endDate.getDate() - startDate.getDate();

    if (monthDiff < 0) {
      yearDiff--;
      monthDiff += 12;
    }

    if (dayDiff < 0) {
      if (monthDiff > 0) {
        monthDiff--;
      } else {
        yearDiff--;
        monthDiff = 11;
      }
      dayDiff += daysInMonth[startDate.getMonth()];
    }
    return yearDiff;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ActorHeader actorName={actorName} />
      {credits.length > 0 && (
        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={{ fontSize: 18, paddingBottom: 10 }}>
                Age: {actorAge || "unavailable"}
              </Text>
              <Text style={{ fontSize: 18, paddingBottom: 10 }}>
                Birthday:{" "}
                {actorBirthday
                  ? new Date(actorBirthday).toLocaleDateString("en-US", {
                      timeZone: "UTC",
                    })
                  : "unavailable"}
              </Text>
              <Text style={{ fontSize: 18, paddingBottom: 10 }}>
                Born in: {actorCountry || "unavailable"}
              </Text>
            </View>
            <Image
              source={{ uri: actorPicture }}
              style={{
                resizeMode: "contain",
                height: 200,
                width: 150,
                marginTop: 10,
              }}
            />
          </View>
          <FlatList
            style={{ marginTop: 5 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 250 }}
            keyExtractor={(item) => item.id}
            data={credits}
            renderItem={({ item, index }) => {
              return <ActorCredit item={item} />;
            }}
          />
        </View>
      )}
      {loading && <Loading />}
    </View>
  );
};

export default actor;

const styles = StyleSheet.create({});
