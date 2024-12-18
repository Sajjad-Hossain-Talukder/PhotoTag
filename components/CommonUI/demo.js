import { StyleSheet, Modal } from "react-native";
import Animated from "react-native-reanimated";
import {
  PanGestureHandler,
  PinchGestureHandler,
} from "react-native-gesture-handler";

import { useRef, createRef } from "react";

function ImagePrevieew() {
  const [panEnabled, setPanEnabled] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = new Animated.Value(0);
  const translateY = new Animated.Value(0);

  const pinchRef = createRef();
  const panRef = createRef();

  const onPinchEvent = Animated.event(
    [
      {
        nativeEvent: { scale },
      },
    ],
    { useNativeDriver: true }
  );

  const onPanEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const handlePinchStateChange = ({ nativeEvent }) => {
    // enabled pan only after pinch-zoom
    if (nativeEvent.state === State.ACTIVE) {
      setPanEnabled(true);
    }

    // when scale < 1, reset scale back to original (1)
    const nScale = nativeEvent.scale;
    console.log("Here NScale : " + nativeEvent.scale);
    if (nativeEvent.state === State.END) {
      if (nScale < 1) {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();

        setPanEnabled(false);
      }
    }
  };

  return (
    <Modal visible={modalVisible} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <PanGestureHandler
          onGestureEvent={onPanEvent}
          // ref={panRef}
          // simultaneousHandlers={[pinchRef]}
          // enabled={panEnabled}
          // failOffsetX={[-1000, 1000]}
          // shouldCancelWhenOutside
        >
          <Animated.View style={styles.animatedView}>
            {/* <PinchGestureHandler
            ref={pinchRef}
            onGestureEvent={onPinchEvent}
            //simultaneousHandlers={[panRef]}
            onHandlerStateChange={handlePinchStateChange}
          > */}
            <Animated.Image
              source={{
                uri: selectedImage,
              }}
              style={{
                width: "90%",
                height: "70%",
                transform: [{ scale }, { translateX }, { translateY }],
                backgroundColor: "red",
              }}
              resizeMode="contain"
            />
            {/* </PinchGestureHandler> */}

            {console.log("Scale : " + scale)}
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Modal>
  );
}

export default ImagePrevieew;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
