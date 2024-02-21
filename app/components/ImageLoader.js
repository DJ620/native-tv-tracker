import { StyleSheet, Image, View } from 'react-native';
import React from 'react';

const ImageLoader = ({style, source, resizeMode}) => {
    style.backgroundColor = "gray";
  return (
    <View style={style}>
      <Image 
      resizeMode={resizeMode && resizeMode}
      style={style}
      source={source}
      />
    </View>
  )
};

export default ImageLoader;

const styles = StyleSheet.create({});