import { AntDesign } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../../utils/Colors";

function DeleteButton({ onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonContatiner,
        pressed && styles.onPressed,
      ]}
    >
      <View style={styles.container}>
        <AntDesign name="delete" size={24} color={Colors.white} />
        <Text style={styles.text}> Delete</Text>
      </View>
    </Pressable>
  );
}

export default DeleteButton;

const styles = StyleSheet.create({
  buttonContatiner: {
    padding: 10,
    backgroundColor: Colors.appRed,
    borderRadius: 8,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    position: "absolute",
    bottom: 40,
    right: 10,
    zIndex: 10,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  onPressed: {
    opacity: 0.5,
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
});
