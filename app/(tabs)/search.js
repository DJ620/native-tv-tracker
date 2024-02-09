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
} from "react-native";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from "axios";
import SearchCard from "../components/SearchCard";
import { useSelector } from "react-redux";
import api from "../utils/api";
import { usePathname } from "expo-router";

const search = () => {
  const pathname = usePathname();
  const userId = useSelector((state) => state.userId);
  const [show, setShows] = useState([]);
  const [searchShow, setSearchShow] = useState("");
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLibrary, setShowLibrary] = useState([]);

  useEffect(() => {
    if (pathname === "/search") {
      setShows([]);
      setSearchShow("");
      setSearchName("");
    api.getShowLibrary(userId).then(res => {
      setShowLibrary(res.data.showLibrary);
    });
    }
  }, [pathname]);

  const handleSearch = async () => {
    Keyboard.dismiss();
    setLoading(true);
    setSearchName(searchShow);
    try {
      const response = await axios.get(
        `https://api.tvmaze.com/search/shows?q=${searchShow}`
      );
      setShows(response.data);
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
      <Header />
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ textAlign: "center", fontSize: 18 }}>
          Search for a TV show
        </Text>
        <KeyboardAvoidingView>
          <View>
            <View style={{ flexDirection: "row", gap: 20, marginTop: 40 }}>
              <TextInput
                autoCapitalize="none"
                value={searchShow}
                onChangeText={(text) => setSearchShow(text)}
                placeholder="enter tv show name"
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
              {show.map((tvShow, index) => {
                return (
                  <View key={index}>
                    <SearchCard tvShow={tvShow} showLibrary={showLibrary}/>
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

const styles = StyleSheet.create({});
