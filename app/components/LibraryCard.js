import { StyleSheet, Pressable, View, Text } from "react-native";
import { useState, useEffect} from "react";
import ImageLoader from "./ImageLoader";

const LibraryCard = ({show, width, title}) => {
    const [watched, setWatched] = useState(0);
    const [complete, setComplete] = useState(0);

    useEffect(() => {
        const epsWatched = show.episodes.filter(ep => ep.watched);
        setWatched(epsWatched.length);
        let percent = Math.trunc((epsWatched.length / show.episodes.length) * 100);
        // if (percent > 90) percent = 90;
        // console.log(percent);
        setComplete(((width * 0.28) * percent) / 100);
    }, [show]);

  return (
    <View key={show.showId}>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/(tabs)/show",
            params: {
              showId: show.showId,
            },
          })
        }
      >
        <ImageLoader
          style={{
            resizeMode: "cover",
            height: 175,
            width: width * 0.29,
          }}
          source={{
            uri: show.image,
          }}
        />
        {title === "Watch Next" && <View style={{width: width * 0.29, height: 10, backgroundColor: "rgba(19, 157, 192, 0.25)", marginTop:2}}>
            <View style={{width: complete, height: 10, backgroundColor:"rgb(19, 157, 192)"}} />
        </View>}
      </Pressable>
    </View>
  );
};

export default LibraryCard;

const styles = StyleSheet.create({});
