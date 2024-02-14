import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import RenderHtml from "react-native-render-html";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import Cast from "./Cast";

const EpisodeInfo = ({
  showInfoModal,
  setShowInfoModal,
  episode,
  showInLibrary,
  watched,
  hasAired,
  openModal,
  loading,
  infoLoading,
  showModal,
  setShowModal,
  handleWatchEpisode,
  handleWatchEpisodeAndPrevious,
  guestCast,
}) => {
  const { width } = useWindowDimensions();

  return (
    <Modal
      isVisible={showInfoModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowInfoModal(false)}
      hasBackdrop={true}
      backdropOpacity={0.5}
      backdropColor="white"
      onBackdropPress={() => setShowInfoModal(false)}
      propagateSwipe={true}
      style={{ justifyContent: "flex-end", margin: 0, borderRadius: 5 }}
    >
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
      <View
        style={{
          marginTop: 60,
          backgroundColor: "white",
          paddingBottom: 20,
          height: "auto",
          maxHeight: 700,
          borderRadius: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#dfdfdf",
            paddingVertical: 10,
            justifyContent: "space-between",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomWidth: 1,
            borderBottomColor: "gray",
          }}
        >
          <Pressable
            onPress={() => setShowInfoModal(false)}
            style={{ width: 60 }}
          >
            <FontAwesome5
              name="caret-down"
              size={24}
              color="black"
              style={{ paddingLeft: 10 }}
            />
          </Pressable>
          <Text
            style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
          >
            Season {episode.season} Episode {episode.number}
          </Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={{ padding: 10 }}>
          <View
            style={{
              flexDirection: showInLibrary ? "row" : "column",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 20 }}>
              {episode.name}
            </Text>
            {showInLibrary && (
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
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 16 }}>
              Air date: {new Date(episode.airdate).toLocaleDateString()}
            </Text>
            <Text style={{ fontSize: 16 }}>
              Runtime: {episode.runtime} minutes
            </Text>
          </View>
          <ScrollView
            style={{ maxHeight: "93%", marginTop: 10 }}
            propagateSwipe={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
          >
            <TouchableOpacity propagateSwipe={true} activeOpacity={0.99}>
              <View style={{ alignItems: "center", flexGrow: 1 }}>
                <Image
                  style={{
                    resizeMode: "cover",
                    height: 200,
                    width: "100%",
                  }}
                  source={
                    episode.image?.original
                      ? { uri: episode.image.original }
                      : require("../assets/images/colorcard.jpeg")
                  }
                />
                <View>
                  {episode?.summary && (
                    <RenderHtml
                      contentWidth={width}
                      source={{ html: episode.summary }}
                      tagsStyles={{ p: { fontSize: 16 } }}
                      enableExperimentalBRCollapsing={true}
                      enableExperimentalGhostLinesPrevention={true}
                    />
                  )}
                  {episode.rating?.average && (
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <StarRatingDisplay
                        rating={episode.rating?.average}
                        maxStars={10}
                        starSize={18}
                      />
                      <Text style={{ fontSize: 16 }}>
                        {episode.rating?.average}/10
                      </Text>
                    </View>
                  )}
                  {guestCast?.length > 0 && (
                    <View>
                      <Text
                        style={{ fontSize: 16, paddingLeft: 10, marginTop: 10 }}
                      >
                        Guest Cast
                      </Text>
                      <Cast showCast={guestCast} />
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      {loading ||
        (infoLoading && (
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
    </Modal>
  );
};

export default EpisodeInfo;

const styles = StyleSheet.create({});
