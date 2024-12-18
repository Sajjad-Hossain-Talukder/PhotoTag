import { StyleSheet, Text, View, Pressable } from "react-native";
import Colors from "../utils/Colors";

function CustomButton({ onPress, title }) {
  return (
    <View style={styles.rootContainer}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: Colors.appRiple }}
        style={({ pressed }) => [pressed && styles.pressAnimation]}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.textColor}>{title}</Text>
        </View>
      </Pressable>
    </View>
  );
}

export default CustomButton;

const styles = StyleSheet.create({
  rootContainer: {
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: Colors.appButton,
  },
  innerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  textColor: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  pressAnimation: {
    opacity: 0.5,
  },
});
