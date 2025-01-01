import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDecay,
} from "react-native-reanimated";
import { FontAwesome6 } from "@expo/vector-icons";
import Colors from "../../utils/Colors";

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
  const focalPoint = useSharedValue({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const screenWidth = Dimensions.get("window").width - 16;
  const screenHeight = Dimensions.get("window").height - 108;
  const halfWidth = Dimensions.get("window").width / 2;
  const halfHeight = Dimensions.get("window").height / 2;

  const springConfig = {
    damping: 15,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 2,
  };

  useEffect(() => {
    if (modalVisible) {
      offset.value = withSpring({ x: 0, y: 0 }, springConfig);
      start.value = { x: 0, y: 0 };
      scale.value = withSpring(1, springConfig);
      savedScale.value = 1;
      focalPoint.value = { x: 0, y: 0 };
    }
  }, [modalVisible]);

  useEffect(() => {
    if (imageUri) {
      Image.getSize(
        imageUri,
        (imageWidth, imageHeight) => {
          const imageAspectRatio = imageWidth / imageHeight;
          const screenAspectRatio = screenWidth / screenHeight;

          let finalWidth, finalHeight;

          if (imageAspectRatio > screenAspectRatio) {
            finalWidth = screenWidth;
            finalHeight = screenWidth / imageAspectRatio;
          } else {
            finalHeight = screenHeight;
            finalWidth = screenHeight * imageAspectRatio;
          }
          setImageSize({ width: finalWidth, height: finalHeight });
        },
        (error) => {
          console.error("Error loading image:", error);
          dismissModal();
        }
      );
    }
  }, [imageUri]);

  const dragGesture = Gesture.Pan()
    .averageTouches(true)
    .onUpdate((e) => {
      if (scale.value > 1) {
        const scaledWidth = imageSize.width * scale.value;
        const scaledHeight = imageSize.height * scale.value;

        const maxOffsetX = Math.max(0, (scaledWidth - screenWidth) / 2);
        const maxOffsetY = Math.max(0, (scaledHeight - screenHeight) / 2);

        let newX = e.translationX + start.value.x;
        let newY = e.translationY + start.value.y;

        newX = Math.min(Math.max(newX, -maxOffsetX), maxOffsetX);
        newY = Math.min(Math.max(newY, -maxOffsetY), maxOffsetY);

        offset.value = { x: newX, y: newY };
      }
    })
    .onEnd((e) => {
      if (scale.value > 1) {
        const scaledWidth = imageSize.width * scale.value;
        const scaledHeight = imageSize.height * scale.value;

        const maxOffsetX = Math.max(0, (scaledWidth - screenWidth) / 2);
        const maxOffsetY = Math.max(0, (scaledHeight - screenHeight) / 2);

        let finalX = offset.value.x;
        let finalY = offset.value.y;

        if (finalX < -maxOffsetX) finalX = -maxOffsetX;
        if (finalX > maxOffsetX) finalX = maxOffsetX;
        if (finalY < -maxOffsetY) finalY = -maxOffsetY;
        if (finalY > maxOffsetY) finalY = maxOffsetY;

        offset.value = withSpring({ x: finalX, y: finalY }, springConfig);
        start.value = { x: finalX, y: finalY };
      }
    });

  const zoomGesture = Gesture.Pinch()
    .onUpdate((event) => {
      const newScale = Math.min(savedScale.value * event.scale, 5.0);
      const changeInScale = newScale / scale.value;

      const focalPointX = focalPoint.value.x;
      const focalPointY = focalPoint.value.y;

      let newOffsetX = focalPointX - focalPointX * changeInScale;
      let newOffsetY = focalPointY - focalPointY * changeInScale;

      const scaledWidth = imageSize.width * newScale;
      const scaledHeight = imageSize.height * newScale;

      const maxOffsetX = Math.max(0, (scaledWidth - screenWidth) / 2);
      const maxOffsetY = Math.max(0, (scaledHeight - screenHeight) / 2);

      newOffsetX = Math.min(
        Math.max(offset.value.x + newOffsetX, -maxOffsetX),
        maxOffsetX
      );
      newOffsetY = Math.min(
        Math.max(offset.value.y + newOffsetY, -maxOffsetY),
        maxOffsetY
      );

      scale.value = newScale;
      offset.value = { x: newOffsetX, y: newOffsetY };
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withSpring(1, springConfig);
        offset.value = withSpring({ x: 0, y: 0 }, springConfig);
        start.value = { x: 0, y: 0 };
      } else {
        savedScale.value = scale.value;

        const scaledWidth = imageSize.width * scale.value;
        const scaledHeight = imageSize.height * scale.value;

        const maxOffsetX = Math.max(0, (scaledWidth - screenWidth) / 2);
        const maxOffsetY = Math.max(0, (scaledHeight - screenHeight) / 2);

        let finalX = offset.value.x;
        let finalY = offset.value.y;

        if (finalX < -maxOffsetX) finalX = -maxOffsetX;
        if (finalX > maxOffsetX) finalX = maxOffsetX;
        if (finalY < -maxOffsetY) finalY = -maxOffsetY;
        if (finalY > maxOffsetY) finalY = maxOffsetY;

        offset.value = withSpring({ x: finalX, y: finalY }, springConfig);
        start.value = { x: finalX, y: finalY };
      }
    });

  const composed = Gesture.Simultaneous(dragGesture, zoomGesture);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: scale.value },
      ],
    };
  });

  const imageDimension = {
    width: imageSize.width,
    height: imageSize.height,
  };

  return (
    <Modal visible={modalVisible} transparent={true} animationType="fade">
      <View style={styles.imageContainer}>
        <GestureHandlerRootView style={styles.container}>
          <GestureDetector gesture={composed}>
            <Animated.Image
              source={{ uri: imageUri }}
              style={[styles.image, imageDimension, animatedStyles]}
              resizeMode="contain"
              // onLoadStart={() => setIsLoading(true)}
              // onLoadEnd={() => setIsLoading(false)}
            />
          </GestureDetector>
        </GestureHandlerRootView>
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={dismissModal}>
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
});

/*
    {isLoading && (
        <ActivityIndicator
          size="large"
          color={Colors.white}
          style={styles.loader}
        />
    )}

    loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },

  const dragGesture = Gesture.Pan()
    .averageTouches(true)
    .onUpdate((e) => {
      if (scale.value > 1) {
        const scaledWidth = imageSize.width * scale.value;
        const scaledHeight = imageSize.height * scale.value;

        const maxOffsetX = Math.max(0, (scaledWidth - screenWidth) / 2);
        const maxOffsetY = Math.max(0, (scaledHeight - screenHeight) / 2);

        let newX = e.translationX + start.value.x;
        let newY = e.translationY + start.value.y;

        newX = Math.min(Math.max(newX, -maxOffsetX), maxOffsetX);
        newY = Math.min(Math.max(newY, -maxOffsetY), maxOffsetY);

        offset.value = { x: newX, y: newY };
      }
    })
    .onEnd((e) => {
      if (scale.value > 1) {
        const scaledWidth = imageSize.width * scale.value;
        const scaledHeight = imageSize.height * scale.value;

        const maxOffsetX = Math.max(0, (scaledWidth - screenWidth) / 2);
        const maxOffsetY = Math.max(0, (scaledHeight - screenHeight) / 2);

        let finalX = offset.value.x;
        let finalY = offset.value.y;

        if (finalX < -maxOffsetX) finalX = -maxOffsetX;
        if (finalX > maxOffsetX) finalX = maxOffsetX;
        if (finalY < -maxOffsetY) finalY = -maxOffsetY;
        if (finalY > maxOffsetY) finalY = maxOffsetY;

        offset.value = withSpring(
          { x: finalX, y: finalY },
          {
            ...springConfig,
          }
        );
        //springConfig

        offset.value = {
          x: withDecay({
            velocity: e.velocityX,
            clamp: [-maxOffsetX, maxOffsetX],
            rubberBandEffect: true,
            deceleration: 0.995,
          }),
          y: withDecay({
            velocity: e.velocityY,
            clamp: [-maxOffsetY, maxOffsetY],
            rubberBandEffect: true,
            deceleration: 0.995,
          }),
        };

        start.value = { x: finalX, y: finalY };
      }
    });

  
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value === 1) {
        scale.value = withSpring(2, springConfig);
        savedScale.value = 2;
      } else {
        scale.value = withSpring(1, springConfig);
        savedScale.value = 1;
        offset.value = withSpring({ x: 0, y: 0 }, springConfig);
        start.value = { x: 0, y: 0 };
      }
    });
*/
