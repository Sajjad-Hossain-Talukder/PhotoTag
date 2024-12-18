import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../utils/Colors";

function AddButton({ onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonContatiner,
        style,
        pressed && styles.onPressed,
      ]}
    >
      <View style={styles.container}>
        <Feather name="plus" size={24} color={Colors.appFont} />
        <Text style={styles.text}> Add</Text>
      </View>
    </Pressable>
  );
}

export default AddButton;

const styles = StyleSheet.create({
  buttonContatiner: {
    padding: 10,
    backgroundColor: Colors.appBackground,
    borderRadius: 8,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  onPressed: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.appFont,
  },
});
