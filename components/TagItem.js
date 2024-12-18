import {
  StyleSheet,
  Text,
  View,
  Pressable,
  LinearGradient,
} from "react-native";
import Colors from "../utils/Colors";

function TagItem({ tagName, tagCount }) {
  return (
    <>
      <View style={styles.rootContainer}>
        <Text style={styles.textColor}> {tagName} </Text>
        <Text style={styles.textColor}> {tagCount} </Text>
      </View>
    </>
  );
}

export default TagItem;

const styles = StyleSheet.create({
  rootContainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.appRiple,
  },
  textColor: {
    color: "white",
  },
});
