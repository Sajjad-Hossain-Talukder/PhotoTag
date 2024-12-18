import React, { useEffect } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { FontAwesome6 } from "@expo/vector-icons";
import Colors from "../../utils/Colors";
import TextTicker from "react-native-text-ticker";
import { AntDesign } from "@expo/vector-icons";

function ImagePreview({
  imageUri,
  modalVisible,
  dismissModal,
  isFromAddTag,
  tagName,
}) {
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

  console.log(
    "URI: ",
    imageUri,
    " : isFromAddTag > ",
    isFromAddTag,
    " : tagName > ",
    tagName
  );

  useEffect(() => {
    if (modalVisible) {
      offset.value = { x: 0, y: 0 };
      start.value = { x: 0, y: 0 };
      scale.value = 1;
      savedScale.value = 1;
      rotation.value = 0;
      savedRotation.value = 0;
    }
  }, [modalVisible]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: scale.value },
        { rotateZ: `${rotation.value}rad` },
      ],
    };
  });

  const dragGesture = Gesture.Pan()
    .averageTouches(true)
    .onUpdate((e) => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      console.log(offset.value.x, offset.value.y);
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    });

  const zoomGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.min(savedScale.value * event.scale, 5.0);
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = 1;
        offset.value.x = 0;
        offset.value.y = 0;
        start.value.x = 0;
        start.value.y = 0;
      }
      savedScale.value = scale.value;
    });

  const rotateGesture = Gesture.Rotation()
    .onUpdate((event) => {
      rotation.value = savedRotation.value + event.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(1000)
    .onEnd((_event, success) => {
      if (success) {
        // scale.value = scale.value <= 2.5 ? 5 : 1.0;
        // savedScale.value = scale.value;
        console.log("double tap!");
      }
    });

  const composed = Gesture.Simultaneous(
    dragGesture,
    Gesture.Simultaneous(zoomGesture, doubleTap)
  );

  const dismissHandler = () => {
    dismissModal();
  };

  const getFilenameWithoutExtension = (imageUri) => {
    if (!imageUri) return null;
    const lastSegment = imageUri.split("/").pop();
    const filenameWithoutExtension = lastSegment
      .split(".")
      .slice(0, -1)
      .join(".");
    return filenameWithoutExtension;
  };

  const filename = getFilenameWithoutExtension(imageUri);

  return (
    <Modal visible={modalVisible} transparent={true} animationType="fade">
      <View style={styles.imageContainer}>
        <GestureHandlerRootView style={styles.container}>
          <GestureDetector gesture={composed}>
            <Animated.Image
              source={{ uri: imageUri }}
              style={[styles.image, animatedStyles]}
              resizeMode="contain"
            />
          </GestureDetector>
        </GestureHandlerRootView>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={dismissHandler}>
        <FontAwesome6 name="xmark" size={24} color={Colors.white} />
      </TouchableOpacity>
    </Modal>
  );
}

export default ImagePreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1,
    backgroundColor: Colors.appModalBG,
    position: "relative",
  },
  image: {
    width: "95%",
    height: "90%",
  },

  closeButton: {
    position: "absolute",
    backgroundColor: Colors.appCrossBG,
    right: 20,
    top: 50,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  closeButtonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
});
/*
  fileNameContainer: {
    width: 30,
    justifyContent: "center",
  },
  tickerText: {
    fontSize: 16,
    color: "black",
  },
header: {
    flexDirection: "row",
    marginTop: 40,
    height: 50,
    // backgroundColor: "red",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 12,
    padding: 5,
  },
  tagContainer: {
    width: 100,
    backgroundColor: "green",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tagFont: {
    fontSize: 16,
    fontWeight: "600",
  },


   <View style={styles.header}>
        <View style={styles.tagContainer}>
          <ScrollView horizontal={true} style={{ backgroundColor: "yellow" }}>
            <Text style={styles.tagFont}>{tagName}</Text>
          </ScrollView>
          <AntDesign name="right" size={24} color="black" />
        </View>
        <View style={{ width: 200, backgroundColor: "green" }}>
          <ScrollView horizontal={true}>
            <Text>{filename}</Text>
          </ScrollView>
        </View>
        <View>
          <TouchableOpacity style={styles.closeButton} onPress={dismissHandler}>
            <FontAwesome6 name="xmark" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
*/
