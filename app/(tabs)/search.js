import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from "axios";
import SearchCard from "../components/SearchCard";
import { useSelector } from "react-redux";
import api from "../utils/api";
import { usePathname } from "expo-router";
import tvMazeApi from "../utils/tvMazeApi";
import HeaderSpecific from "../components/HeaderSpecific";
import ActorSearchCard from "../components/ActorSearchCard";

const search = () => {
  const pathname = usePathname();
  const userId = useSelector((state) => state.userId);
  const [show, setShows] = useState([]);
  const [searchShow, setSearchShow] = useState("");
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLibrary, setShowLibrary] = useState([]);
  const [actors, setActors] = useState([]);
  const [searchType, setSearchType] = useState("show");

  useEffect(() => {
    if (pathname === "/search") {
      setSearchType("show");
      setShows([]);
      setActors([]);
      setSearchShow("");
      setSearchName("");
      api.getShowLibrary(userId).then((res) => {
        setShowLibrary(res.data.showLibrary);
      });
    }
  }, [pathname]);

  useEffect(() => {
    setShows([]);
    setActors([]);
    setSearchShow("");
    setSearchName("");
  }, [searchType]);

  const handleSearch = async () => {
    Keyboard.dismiss();
    setLoading(true);
    setSearchName(searchShow);
    try {
      const response =
        searchType === "show"
          ? await tvMazeApi.searchShow(searchShow)
          : await tvMazeApi.searchActor(searchShow);
      searchType === "show"
        ? setShows(response.data)
        : setActors(response.data);
      setSearchShow("");
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      Alert.alert("Error while searching", error);
    }
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1, paddingBottom: 450 }}>
      <HeaderSpecific pageName={"Search"} />
      <View style={{ paddingHorizontal: 20 }}>
        <KeyboardAvoidingView>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                width: "100%",
                marginTop: 10,
              }}
            >
              <Pressable
                onPress={() => setSearchType("show")}
                style={{
                  borderBottomColor:
                    searchType === "show" ? "black" : "#dfdfdf",
                  borderBottomWidth: 1,
                  width: "50%",
                  paddingBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: "center",
                    color: searchType === "show" ? "black" : "gray",
                  }}
                >
                  Show
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setSearchType("actor")}
                style={{
                  borderBottomColor:
                    searchType === "actor" ? "black" : "#dfdfdf",
                  borderBottomWidth: 1,
                  width: "50%",
                  paddingBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: "center",
                    color: searchType === "actor" ? "black" : "gray",
                  }}
                >
                  Actor
                </Text>
              </Pressable>
            </View>
            <View style={{ flexDirection: "row", gap: 20, marginTop: 20 }}>
              <TextInput
                autoCapitalize="none"
                value={searchShow}
                onChangeText={(text) => setSearchShow(text)}
                placeholder="enter tv show name"
                onSubmitEditing={handleSearch}
                style={{
                  padding: 10,
                  borderColor: "#E0E0E0",
                  borderWidth: 1,
                  borderRadius: 5,
                  flex: 1,
                }}
              />
              <Pressable
                onPress={() => handleSearch()}
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  backgroundColor: "black",
                  width: 80,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: 16,
                  }}
                >
                  Search
                </Text>
              </Pressable>
            </View>
            {searchName && (
              <Text
                style={{
                  marginTop: 10,
                  textAlign: "center",
                  fontSize: 16,
                  color: "gray",
                }}
              >
                Results for "{searchName}"
              </Text>
            )}
            <ScrollView showsVerticalScrollIndicator={false}>
              {searchType === "show"
                ? show.map((tvShow, index) => {
                    return (
                      <View key={index}>
                        <SearchCard tvShow={tvShow} showLibrary={showLibrary} />
                      </View>
                    );
                  })
                : actors.map((actor, index) => {
                    return (
                      <View key={index}>
                        <ActorSearchCard actor={actor}/>
                      </View>
                    );
                  })}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
      {loading && (
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
      )}
    </View>
  );
};

export default search;

const styles = StyleSheet.create({
  tabActive: {
    borderBottomColor: "black",
  },
  textActive: {
    color: "black",
  },
  tabDisabled: {
    borderBottomColor: "#dfdfdf",
  },
  textDisabled: {
    color: "#dfdfdf",
  },
});
