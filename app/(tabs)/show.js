import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  Pressable,
  Image,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { useEffect, useState, Suspense } from "react";
import Header from "../components/Header";
import { useLocalSearchParams } from "expo-router";
import tvMazeApi from "../utils/tvMazeApi";
import api from "../utils/api";
import token from "../utils/token";
import RenderHtml from "react-native-render-html";
import Season from "../components/Season";
import Cast from "../components/Cast";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import ScrollEpisodes from "../components/ScrollEpisodes";

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
  const [network, setNetwork] = useState("");
  const [genres, setGenres] = useState("");

  useEffect(() => {
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
      let image = null;
      image = showImages.find((img) => {
        return img.type === "banner";
      });
      if (!image) {
        image = showImages.find((img) => {
          return img.type === "typography";
        });
      }
      if (!image) {
        image = showImages.find((img) => {
          return img.type === "background";
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

  const getShowInfo = async (showId) => {
    setLoading(true);
    setEpisodeWithImages([]);
    setMainImage("");
    setNetwork("");

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
      <Header />
      {showInfo && !loading && (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingBottom: 10,
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <Text
              adjustsFontSizeToFit={true}
              numberOfLines={2}
              style={{ fontSize: 30, maxWidth: "65%" }}
            >
              {showInfo?.name}
            </Text>
            <Pressable
              onPress={() => handleShowLibrary()}
              style={{
                padding: 10,
                backgroundColor: inLibrary ? "green" : "red",
                borderRadius: 5,
              }}
            >
              <Text style={{ fontSize: 16, color: "white" }}>
                {inLibrary ? "Remove from Library" : "Add to Library"}
              </Text>
            </Pressable>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
          >
            <Suspense fallback={<Text>Loading image...</Text>}>
              <Image
                style={{
                  resizeMode: "contain",
                  height: 200,
                  width: "100%",
                  marginTop: 10,
                }}
                source={
                  mainImage
                    ? {
                        uri: mainImage,
                      }
                    : require("../assets/images/colorcard.jpeg")
                }
              />
            </Suspense>
            {/* <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ marginVertical: 20 }}
              contentContainerStyle={{ paddingHorizontal: 10 }}
              decelerationRate={"fast"}
              snapToInterval={310}
              snapToAlignment={"center"}
              ref={(ref) => {
                setScroller(ref);
              }}
            >
              <View style={{ flexDirection: "row", gap: 10 }}>
                {episodeWithImages?.map((episode, index) => {
                  return (
                    <View
                      onLayout={(event) => {
                        const layout = event.nativeEvent.layout;
                        // coordinate[item.key] = layout.x;
                        console.log(layout.x);
                      }}
                    >
                      <Episode
                        key={index}
                        episode={episode}
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
            </ScrollView> */}
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
              {genres && <Text style={{ marginBottom: 20, fontStyle: "italic" }}>
                {genres}
              </Text>}
              <Text style={{ fontSize: 16, paddingBottom: 10 }}>
                Where to watch: {network ? network : "unavailable"}
              </Text>
              {showInfo?.rating?.average && (
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    marginBottom: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <StarRatingDisplay
                    rating={showInfo?.rating?.average}
                    maxStars={10}
                    starSize={20}
                  />
                  <Text style={{ fontSize: 16 }}>
                    {showInfo?.rating?.average}/10
                  </Text>
                </View>
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
          <View
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              marginTop: 50,
              backgroundColor: "white",
              opacity: 0.5,
            }}
          >
            <ActivityIndicator
              size={"large"}
              color={"black"}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </View>
        ))}
    </View>
  );
};

export default show;

const styles = StyleSheet.create({});
