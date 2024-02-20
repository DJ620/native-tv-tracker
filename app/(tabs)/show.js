import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import tvMazeApi from "../utils/tvMazeApi";
import api from "../utils/api";
import token from "../utils/token";
import RenderHtml from "react-native-render-html";
import Season from "../components/Season";
import Cast from "../components/Cast";
import ScrollEpisodes from "../components/ScrollEpisodes";
import { FontAwesome } from "@expo/vector-icons";
import ShowHeader from "../components/ShowHeader";
import Loading from "../components/Loading";

const show = () => {
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [showLibrary, setShowLibrary] = useState([]);
  const [showInfo, setShowInfo] = useState({});
  const [showSeasons, setShowSeasons] = useState([]);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [episodesData, setEpisodesData] = useState([]);
  const [inLibrary, setInLibrary] = useState(false);
  const [mongoId, setMongoId] = useState(null);
  const [mongoEpisodeIds, setMongoEpisodeIds] = useState([]);
  const [handlingLibrary, setHandlingLibrary] = useState(false);
  const [showCast, setShowCast] = useState([]);
  const [showImages, setShowImages] = useState([]);
  const [libraryEpisodes, setLibraryEpisodes] = useState([]);
  const [episodeWithImages, setEpisodeWithImages] = useState([]);
  const [fullEpisodeData, setFullEpisodeData] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [poster, setPoster] = useState(null);
  const [network, setNetwork] = useState("");
  const [genres, setGenres] = useState("");
  const [showHeaderButton, setShowHeaderButton] = useState(false);

  useEffect(() => {
    setShowHeaderButton(false);
    getShowInfo(params.showId);
    getLibrary();
  }, [params]);

  useEffect(() => {
    const isInLibrary = showLibrary.some((show) => {
      return show.showId === showInfo.id;
    });
    setMongoId(showLibrary.find(({ showId }) => showId === showInfo.id)?._id);
    setMongoEpisodeIds(
      showLibrary
        .filter((show) => show.showId == showInfo.id)[0]
        ?.episodes.map((ep) => ep._id)
    );
    setInLibrary(isInLibrary);
    const showInLibrary = showLibrary.find((show) => {
      return show.showId === showInfo.id;
    });
    setLibraryEpisodes(showInLibrary?.episodes);
  }, [showLibrary, showInfo]);

  useEffect(() => {
    if (libraryEpisodes?.length > 0 && episodesData?.length > 0) {
      let allEpisodeData = fullEpisodeData;
      allEpisodeData.forEach((ep) => {
        let epInfo = libraryEpisodes.find((dataEp) => {
          return ep.id === dataEp.episodeId;
        });
        ep.watched = epInfo?.watched;
        ep.airTime = epInfo?.airTime;
        ep.inLibrary = true;
      });
      setEpisodeWithImages(allEpisodeData);
    }
  }, [libraryEpisodes, episodesData]);

  useEffect(() => {
    if (episodeWithImages.length > 0) {
      let groupedSeasons = {};
      episodeWithImages.forEach((ep) => {
        groupedSeasons[ep.season]
          ? groupedSeasons[ep.season].push(ep)
          : (groupedSeasons[ep.season] = [ep]);
      });
      setShowSeasons(groupedSeasons);
    }
  }, [episodeWithImages]);

  useEffect(() => {
    if (showImages.length > 0) {
      let posterImage = showImages.find((img) => {
        return img.type === "poster";
      });
      setPoster(posterImage.resolutions.original.url);
      let image = null;
      image = showImages.find((img) => {
        return img.type === "background";
      });
      if (!image) {
        image = showImages.find((img) => {
          return img.type === "banner";
        });
      }
      if (!image) {
        image = showImages.find((img) => {
          return img.type === "typography";
        });
      }
      if (!image) {
        image = showImages.find((img) => {
          return img.type === "poster";
        });
      }
      setMainImage(image.resolutions.original.url);
    }
  }, [showImages]);

  useEffect(() => {
    setShowHeaderButton(true);
  }, [inLibrary]);

  const getShowInfo = async (showId) => {
    setLoading(true);
    setEpisodeWithImages([]);
    setMainImage("");
    setNetwork("");
    setShowInfo([]);
    try {
      const response = await tvMazeApi.getShowInfo(showId);
      setShowInfo(response.data);
      let whereToWatch =
        response.data.network?.name || response.data.webChannel?.name;
      setNetwork(whereToWatch);
      const showGenres = response.data.genres?.join(", ") || response.data.type;
      setGenres(showGenres);
      const episodes = response.data._embedded.episodes;
      setFullEpisodeData(episodes);
      setShowCast(response.data._embedded.cast);
      setShowImages(response.data._embedded.images);
      setShowEpisodes(!showEpisodes);
      setLoading(false);
      const allEpisodes = response.data._embedded.episodes.map((ep) => {
        let epTime = ep.airtime;
        if (ep.airtime == "" || ep.airtime == null) {
          epTime = "00:00";
        }
        return {
          episodeId: ep.id,
          season: ep.season,
          number: ep.number,
          name: ep.name,
          airTime: `${ep.airdate}T${epTime}`,
          watched: false,
          image: ep.image,
          inLibrary: false,
        };
      });
      let groupedSeasons = {};
      episodes.forEach((ep) => {
        groupedSeasons[ep.season]
          ? groupedSeasons[ep.season].push(ep)
          : (groupedSeasons[ep.season] = [ep]);
      });
      setShowSeasons(groupedSeasons);
      setEpisodesData(allEpisodes);
    } catch (error) {
      Alert.alert("Error getting show info", error);
    }
  };

  const getLibrary = async () => {
    const userId = await token.getId();
    const response = await api.getShowLibrary(userId);
    setShowLibrary(response.data.showLibrary);
  };

  const handleShowLibrary = async () => {
    setHandlingLibrary(true);
    let userId = await token.getId();
    if (!inLibrary) {
      const showData = {
        showId: showInfo.id,
        name: showInfo.name,
        image: showInfo.image?.original,
        updated: showInfo.updated,
      };
      await api.addShow({ showData, episodesData, userId }).then((res) => {
        setShowLibrary(res.data.showLibrary);
      });
    } else {
      await api.deleteShow(mongoId, mongoEpisodeIds, userId).then((res) => {
        setShowLibrary(res.data.showLibrary);
      });
    }
    setHandlingLibrary(false);
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <ShowHeader
        showName={showInfo.name}
        handleShowLibrary={handleShowLibrary}
        inLibrary={inLibrary}
        showHeaderButton={showHeaderButton}
      />
      {showInfo && !loading && (
        <View>
          <ImageBackground
            style={{
              resizeMode: "contain",
              height: 150,
              width: "100%",
              backgroundColor: "#dfdfdf",
              borderBottomColor: "#dfdfdf",
            }}
            source={
              mainImage
                ? {
                    uri: mainImage,
                  }
                : require("../assets/images/colorcard.jpeg")
            }
          >
            <View
              style={{
                backgroundColor: "rgba(0, 0, 0, .5)",
                height: 150,
                alignContent: "center",
                paddingTop: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ paddingLeft: 10, maxWidth: "70%" }}>
                  {showInfo?.premiered && (
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        paddingBottom: 10,
                        fontWeight: 600,
                      }}
                    >
                      {new Date(showInfo.premiered).getFullYear()}{" "}
                      {showInfo.ended && showInfo.ended !== showInfo.premiered
                        ? "- " + new Date(showInfo.ended).getFullYear()
                        : !showInfo.ended
                        ? "-"
                        : null}
                    </Text>
                  )}
                  {showInfo?.status && (
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        paddingBottom: 10,
                        fontWeight: 600,
                      }}
                    >
                      Status: {showInfo.status}
                    </Text>
                  )}
                  <View
                    style={{ flexDirection: "row", paddingBottom: 10, gap: 2 }}
                  >
                    <Text
                      style={{
                        width: 130,
                        color: "white",
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      Where to watch:
                    </Text>
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      {network ? network : "unavailable"}
                    </Text>
                  </View>
                  {showInfo?.rating?.average && (
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                        marginBottom: 10,
                        alignItems: "center",
                      }}
                    >
                      <FontAwesome name="star" size={20} color="yellow" />
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        {showInfo?.rating?.average}/10
                      </Text>
                    </View>
                  )}
                  {genres && (
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      style={{
                        color: "white",
                        marginBottom: 10,
                        fontStyle: "italic",
                        fontWeight: "bold",
                      }}
                    >
                      {genres}
                    </Text>
                  )}
                </View>
                <Image
                  resizeMode="contain"
                  style={{
                    height: 135,
                    width: 100,
                    marginRight: 20,
                    borderRadius: 5,
                  }}
                  source={
                    showInfo?.image?.original
                      ? { uri: showInfo?.image?.original }
                      : require("../assets/images/poster-placeholder.png")
                  }
                />
              </View>
            </View>
          </ImageBackground>
          <ScrollView
            style={{ marginTop: 2 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 230 }}
          >
            <ScrollEpisodes
              episodeWithImages={episodeWithImages}
              showInfo={showInfo}
              showLibrary={showLibrary}
              setShowLibrary={setShowLibrary}
              handlingLibrary={handlingLibrary}
              setHandlingLibrary={setHandlingLibrary}
            />
            <View style={{ paddingHorizontal: 20 }}>
              {showInfo?.summary && (
                <RenderHtml
                  contentWidth={width}
                  source={{ html: showInfo?.summary }}
                  tagsStyles={{ p: { fontSize: 16 } }}
                />
              )}
            </View>
            {showCast.length > 0 && (
              <View
                style={{
                  marginBottom: 20,
                }}
              >
                <Text style={{ fontSize: 16, paddingLeft: 10 }}>Cast</Text>
                <Cast showCast={showCast} />
              </View>
            )}
            <View style={{ paddingHorizontal: 20 }}>
              {Object.keys(showSeasons).map((season, index) => {
                return (
                  <View key={index}>
                    <Season
                      season={showSeasons[season]}
                      seasonNumber={season}
                      showInfo={showInfo}
                      showLibrary={showLibrary}
                      setShowLibrary={setShowLibrary}
                      loading={handlingLibrary}
                      setLoading={setHandlingLibrary}
                    />
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}
      {loading ||
        (handlingLibrary && (
          <Loading />
        ))}
    </View>
  );
};

export default show;

const styles = StyleSheet.create({});
