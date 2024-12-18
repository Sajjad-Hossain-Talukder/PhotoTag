import { View, Text, StyleSheet } from "react-native";
import Colors from "../utils/Colors";

function Title({ textFront, textEnd }) {
  return (
    <View style={styles.container}>
      <Text style={styles.textFront}>
        {textFront}
        <Text style={styles.textEnd}>{textEnd}</Text>
      </Text>
    </View>
  );
}

export default Title;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  textFront: {
    color: Colors.appFont,
    fontSize: 32,
    fontWeight: "bold",
  },
  textEnd: {
    color: Colors.black,
    fontSize: 32,
    fontWeight: "bold",
  },
});
