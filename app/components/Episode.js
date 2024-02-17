import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import Modal from "react-native-modal";
import api from "../utils/api";
import token from "../utils/token";
import EpisodeInfo from "./EpisodeInfo";
import tvMazeApi from "../utils/tvMazeApi";

const Episode = ({
  episode,
  showInfo,
  showLibrary,
  setShowLibrary,
  loading,
  setLoading,
}) => {
  const [showInLibrary, setShowInLibrary] = useState(false);
  const [watchedEpisodes, setWatchedEpisodes] = useState([]);
  const [watched, setWatched] = useState(false);
  const [hasAired, setHasAired] = useState(false);
  const [episodeAirdate, setEpisodeAirdate] = useState(null);
  const [episodeMongoId, setEpisodeMongoId] = useState(null);
  const [previousEpisodeIds, setPreviousEpisodeIds] = useState([]);
  const [previousUnseen, setPreviousUnseen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [guestCast, setGuestCast] = useState([]);
  const [infoLoading, setInfoLoading] = useState(false);

  useEffect(() => {
    if (showLibrary) {
      const isInLibrary = showLibrary.some((show) => {
        return show.showId === showInfo.id;
      });
      setShowInLibrary(isInLibrary);
      setWatchedEpisodes(
        showLibrary
          .filter((show) => show.showId === showInfo.id)[0]
          ?.episodes.filter((ep) => ep.watched)
      );
      let epAirTime = episode.airtime;
      if (epAirTime == "" || epAirTime == null) {
        epAirTime = "00:00";
      }
      // const epTime = episode.airdate + "T" + episode.airtime;
      const epTime = episode.airTime;
      const now = new Date().toISOString();
      setHasAired(now > epTime);
      setEpisodeAirdate(epTime);
    }
    let previousSeason = showLibrary
      .filter((show) => show.showId == showInfo.id)[0]
      ?.episodes.filter((ep) => ep.season < episode.season);
    let previousEps = showLibrary
      .filter((show) => show.showId == showInfo.id)[0]
      ?.episodes.filter(
        (ep) => ep.season == episode.season && ep.number <= episode.number
      );
    let allPrevious;
    if (previousEps) {
      allPrevious = [...previousEps, ...previousSeason];
      setPreviousEpisodeIds(
        allPrevious.filter((ep) => !ep.watched).map((ep) => ep._id)
      );
    }
  }, [showLibrary]);

  useEffect(() => {
    if (watchedEpisodes && watchedEpisodes.length > 0) {
      const isWatched = watchedEpisodes.some((showEpisode) => {
        return showEpisode.episodeId === episode.id;
      });
      setWatched(isWatched);
    } else {
      setWatched(false);
    }
  }, [watchedEpisodes]);

  useEffect(() => {
    if (showInLibrary) {
      let mongoEpisode = showLibrary
        .filter((show) => show.showId === showInfo.id)[0]
        .episodes.filter((ep) => ep.episodeId === episode.id)[0]?._id;
      setEpisodeMongoId(mongoEpisode);
    }
  }, [showInLibrary]);

  useEffect(() => {
    setPreviousUnseen(previousEpisodeIds.length > 1);
  }, [previousEpisodeIds]);

  const handleWatchEpisode = async () => {
    setLoading(true);
    const userId = await token.getId();
    const episodeData = {
      episodeId: episodeMongoId,
      userId,
    };
    if (!watched) {
      api.watchEpisode(episodeData).then((res) => {
        setShowLibrary(res.data.showLibrary);
        setLoading(false);
      });
    } else {
      api.unwatchEpisode(episodeData).then((res) => {
        setShowLibrary(res.data.showLibrary);
        setLoading(false);
      });
    }
  };

  const handleWatchEpisodeAndPrevious = async () => {
    setLoading(true);
    const userId = await token.getId();
    api.watchSeason({ episodeIds: previousEpisodeIds, userId }).then((res) => {
      setShowLibrary(res.data.showLibrary);
      setLoading(false);
    });
  };

  const openModal = () => {
    if (!watched && previousUnseen) {
      setShowModal(true);
    } else {
      handleWatchEpisode();
    }
  };

  const openInfoModal = () => {
    setShowInfoModal(true);
    getEpisodeInfo();
  };

  const getEpisodeInfo = async () => {
    setInfoLoading(true);
    const res = await tvMazeApi.getGuestCast(episode.id);
    setGuestCast(res.data);
    setInfoLoading(false);
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
            <Text
              style={{ fontSize: 16, marginBottom: 20, textAlign: "center" }}
            >
              Mark previous episodes as watched?
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
                  handleWatchEpisodeAndPrevious();
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
                  handleWatchEpisode();
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
      <EpisodeInfo
        showInfoModal={showInfoModal}
        setShowInfoModal={setShowInfoModal}
        episode={episode}
        showInLibrary={showInLibrary}
        watched={watched}
        hasAired={hasAired}
        openModal={openModal}
        loading={loading}
        infoLoading={infoLoading}
        showModal={showModal}
        setShowModal={setShowModal}
        handleWatchEpisode={handleWatchEpisode}
        handleWatchEpisodeAndPrevious={handleWatchEpisodeAndPrevious}
        guestCast={guestCast}
      />
      <Pressable
        onPress={openInfoModal}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: "#dfdfdf",
          paddingRight: 10,
          width: 340,
          height: 75,
          justifyContent: "space-between",
          borderWidth: 0.5,
          borderColor: "gray",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Image
            style={{
              // resizeMode: "contain",
              height: 75,
              width: 75,
            }}
            source={
              episode.image?.medium
                ? {
                    uri: episode.image.medium,
                  }
                : require("../assets/images/colorcard.jpeg")
            }
          />
          <View style={{ maxWidth: 200 }}>
            <Text style={{ fontSize: 20 }}>
              S{episode.season}|E{episode.number}
            </Text>
            <Text numberOfLines={2} style={{ fontSize: 16 }}>
              {episode.name}
            </Text>
          </View>
        </View>
        <Pressable
          style={{
            display: showInLibrary ? "flex" : "none",
            opacity: hasAired ? 1 : 0.25,
          }}
          disabled={!hasAired}
          onPress={() => openModal()}
        >
          <AntDesign
            name={watched ? "checkcircle" : "checkcircleo"}
            size={25}
            color="black"
          />
        </Pressable>
      </Pressable>
    </View>
  );
};

export default Episode;

const styles = StyleSheet.create({});
