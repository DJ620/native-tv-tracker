import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import api from "../../utils/api";
import token from "../../utils/token";
import LibrarySection from "../../components/LibrarySection";
import { usePathname } from "expo-router";
import { useDispatch } from "react-redux";
import { addUserId } from "../../redux/slices/userId";
import { addLibrary } from "../../redux/slices/showLibrary";

const index = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [showLibrary, setShowLibrary] = useState([]);
  const [upToDate, setUpToDate] = useState([]);
  const [hasNewEpisodes, setHasNewEpisodes] = useState([]);
  const [notStarted, setNotStarted] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    saveUserId();
  }, []);

  const saveUserId = async () => {
    const id = await token.getId();
    dispatch(addUserId(id));
  };

  useEffect(() => {
    getLibrary();
  }, [pathname]);

  useEffect(() => {
    dispatch(addLibrary(showLibrary));
    setUpToDate(
      showLibrary.filter(
        (show) =>
          show.episodes.filter(
            (ep) => !ep.watched && new Date().toISOString() > ep.airTime
          ).length == 0
      )
    );
    setNotStarted(
      showLibrary.filter(
        (show) => show.episodes.filter((ep) => ep.watched).length == 0
      )
    );
    setHasNewEpisodes(
      showLibrary.filter(
        (show) =>
          show.episodes.filter(
            (ep) => !ep.watched && new Date().toISOString() > ep.airTime
          ).length > 0 && show.episodes.filter((ep) => ep.watched).length > 0
      )
    );
  }, [showLibrary]);

  const getLibrary = async () => {
    setLoading(true);
    const userId = await token.getId();
    const response = await api.getShowLibrary(userId);
    setShowLibrary(response.data.showLibrary);
    setLoading(false);
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <Header />
      <ScrollView
        style={{ marginTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {showLibrary.length == 0 && !loading && (
          <Text style={{ textAlign: "center", fontSize: 16 }}>
            You don't currently have any shows in your library
          </Text>
        )}

        {showLibrary.length > 0 && (
          <View>
            <LibrarySection episodes={hasNewEpisodes} title="Watch Next" />

            <LibrarySection
              episodes={notStarted}
              title="Haven't Started Watching"
            />

            <LibrarySection episodes={upToDate} title="Up To Date" />
          </View>
        )}
      </ScrollView>
      {loading && (
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
      )}
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
