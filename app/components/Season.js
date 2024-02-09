import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import Episode from "./Episode";
import Modal from "react-native-modal";
import api from "../utils/api";
import token from "../utils/token";

const Season = ({
  season,
  seasonNumber,
  showInfo,
  showLibrary,
  setShowLibrary,
  loading,
  setLoading,
}) => {
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [numWatched, setNumWatched] = useState(0);
  const [hasUnwatched, setHasUnwatched] = useState(false);
  const [mongoAiredEpIds, setMongoAiredEpIds] = useState([]);
  const [mongoAiredEpIdsAndPrevious, setMongoAiredEpIdsAndPrevious] = useState(
    []
  );
  const [showMongoId, setShowMongoId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [previousSeasonHasUnwatched, setPreviousSeasonHasUnwatched] =
    useState(false);

  useEffect(() => {
    setShowMongoId(
      showLibrary.find(({ showId }) => showId === showInfo.id)?._id
    );
    setTotalEpisodes(season.length);
    let epsWatched = showLibrary
      .filter((show) => show.showId === showInfo.id)[0]
      ?.episodes.filter((ep) => ep.watched && ep.season == seasonNumber).length;
    if (!epsWatched) epsWatched = 0;
    setNumWatched(epsWatched);
    setMongoAiredEpIds(
      showLibrary
        .filter((show) => show.showId == showInfo.id)[0]
        ?.episodes.filter(
          (ep) =>
            ep.season == seasonNumber && new Date().toISOString() > ep.airTime
        )
        .map((ep) => ep._id)
    );
  }, [showLibrary]);

  useEffect(() => {
    setHasUnwatched(numWatched < mongoAiredEpIds?.length);
    const previous = showLibrary
      .filter((show) => show.showId == showInfo.id)[0]
      ?.episodes.filter((ep) => ep.season < seasonNumber)
      .map((ep) => ep._id);
    if (previous)
      setMongoAiredEpIdsAndPrevious([...previous, ...mongoAiredEpIds]);
  }, [numWatched, mongoAiredEpIds]);

  useEffect(() => {
    const previousSeasonEps = showLibrary
      .filter((show) => show.showId == showInfo.id)[0]
      ?.episodes.filter((ep) => ep.season < seasonNumber && !ep.watched);
    if (previousSeasonEps)
      setPreviousSeasonHasUnwatched(previousSeasonEps.length > 0);
  }, [mongoAiredEpIdsAndPrevious]);

  let color = numWatched === totalEpisodes ? "green" : "#316CF4";

  const handleWatchSeason = async () => {
    setLoading(true);
    const userId = await token.getId();
    const seasonData = {
      episodeIds: mongoAiredEpIds,
      userId,
    };
    if (hasUnwatched) {
      await api.watchSeason(seasonData).then((res) => {
        setShowLibrary(res.data.showLibrary);
      });
    } else {
      await api.unwatchSeason(seasonData).then((res) => {
        setShowLibrary(res.data.showLibrary);
      });
    }
    setLoading(false);
  };

  const handleWatchSeasonAndPrevious = async () => {
    setLoading(true);
    const userId = await token.getId();
    await api
      .watchSeason({ episodeIds: mongoAiredEpIdsAndPrevious, userId })
      .then((res) => {
        setShowLibrary(res.data.showLibrary);
      });
    setLoading(false);
  };

  const openModal = () => {
    if (hasUnwatched && seasonNumber > 1 && previousSeasonHasUnwatched) {
      setShowModal(true);
    } else {
      handleWatchSeason();
    }
  };

  return (
    <View>
      <Modal
        isVisible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
        hasBackdrop={true}
        backdropOpacity={0.5}
        backdropColor="white"
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <View
            style={{
              paddingHorizontal: 60,
              paddingVertical: 30,
              backgroundColor: "white",
              borderWidth: 0.5,
              borderRadius: 5,
              borderColor: "gray",
            }}
          >
            <Text style={{ fontSize: 16, marginBottom: 20 }}>
              Mark previous seasons as watched?
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 20,
                justifyContent: "center",
              }}
            >
              <Pressable
                onPress={() => {
                  setShowModal(false);
                  handleWatchSeasonAndPrevious();
                }}
                style={{
                  backgroundColor: "blue",
                  padding: 15,
                  borderRadius: 5,
                  width: 80,
                }}
              >
                <Text
                  style={{ color: "white", textAlign: "center", fontSize: 16 }}
                >
                  Yes
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowModal(false);
                  handleWatchSeason();
                }}
                style={{
                  backgroundColor: "gray",
                  padding: 15,
                  borderRadius: 5,
                  width: 80,
                }}
              >
                <Text
                  style={{ color: "white", textAlign: "center", fontSize: 16 }}
                >
                  No
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View
        style={{
          flexDirection: "row",
          gap: 15,
          alignItems: "center",
          marginBottom: showEpisodes ? 10 : 20,
        }}
      >
        <Pressable
          onPress={() => setShowEpisodes(!showEpisodes)}
          style={{
            backgroundColor: showEpisodes ? "white" : color,
            width: 180,
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
            flexDirection: "row",
            borderWidth: 0.5,
            borderColor: color,
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: showEpisodes ? color : "white",
              fontSize: 16,
            }}
          >
            Season {seasonNumber} ({numWatched}/{totalEpisodes})
          </Text>
          <FontAwesome5
            name={showEpisodes ? "caret-up" : "caret-down"}
            size={24}
            color={showEpisodes ? color : "white"}
          />
        </Pressable>
        <Pressable onPress={openModal}>
          <AntDesign
            name={hasUnwatched ? "checkcircleo" : "checkcircle"}
            size={35}
            color="black"
            style={{
              marginBottom: 10,
              display:
                showMongoId && mongoAiredEpIds.length > 0 ? "flex" : "none",
            }}
          />
        </Pressable>
      </View>
      {showEpisodes && (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {season.map((episode) => {
            return (
              <View key={episode.id} style={{ paddingRight: 10, marginBottom:20 }}>
                <Episode
                  episode={episode}
                  showInfo={showInfo}
                  showLibrary={showLibrary}
                  setShowLibrary={setShowLibrary}
                  loading={loading}
                  setLoading={setLoading}
                />
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

export default Season;

const styles = StyleSheet.create({});
