import { StyleSheet, FlatList, View } from "react-native";
import { useRef, useEffect, useState } from "react";
import Episode from "./Episode";

const ScrollEpisodes = ({
  episodeWithImages,
  showInfo,
  showLibrary,
  setShowLibrary,
  handlingLibrary,
  setHandlingLibrary,
}) => {
  const flatListRef = useRef();
  const [indexFound, setInfexFound] = useState(false);
  const [index, setIndex] = useState(null);

  useEffect(() => {
    if (episodeWithImages.length > 0) {
        setTimeout(() => {
            scrollToHere();
        }, 100);
    }
  }, [episodeWithImages]);

  const getItemLayout = (_, index) => {
    return {
      length: 350,
      offset: 350 * (index - 1),
      index,
    };
  };

  const isUnwatched = (ep) => !ep.watched;

const findUnwatchedEpisode = () => {
   return episodeWithImages.findIndex(isUnwatched);
}

  const scrollToHere = () => {
    flatListRef.current?.scrollToIndex({ animated: false, index: findUnwatchedEpisode() + 1 });
  };

  return (
    <View>
    <FlatList
      getItemLayout={getItemLayout}
      ref={flatListRef}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginVertical: 20 }}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
      decelerationRate={"fast"}
      snapToInterval={350}
      snapToAlignment={"start"}
      data={episodeWithImages}
      renderItem={({ item, index }) => {
        return (
          <Episode
            onPress={() => onClickItem(item, index)}
            index={index}
            episode={item}
            showInfo={showInfo}
            showLibrary={showLibrary}
            setShowLibrary={setShowLibrary}
            loading={handlingLibrary}
            setLoading={setHandlingLibrary}
          />
        );
      }}
    />
    </View>
  );
};

export default ScrollEpisodes;

const styles = StyleSheet.create({});
