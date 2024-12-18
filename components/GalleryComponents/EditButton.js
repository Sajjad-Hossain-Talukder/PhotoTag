import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import Colors from "../../utils/Colors";

function EditButton({ onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonContatiner,
        pressed && styles.onPressed,
      ]}
    >
      <Feather name="edit" size={24} color="black" />
    </Pressable>
  );
}

export default EditButton;

const styles = StyleSheet.create({
  buttonContatiner: {
    padding: 10,
    paddingHorizontal: 10,
  },
  onPressed: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    color: Colors.black,
  },
});
