import { TextInput, StyleSheet, View } from "react-native";
import Colors from "../../utils/Colors";

function AddTagTextInput({ onTagAdd }) {
  function onChangeText(newTag) {
    onTagAdd(newTag);
  }

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.inputField}
        placeholder="Enter tag title here!"
        enterKeyHint="done"
        onChangeText={onChangeText}
      />
    </View>
  );
}

export default AddTagTextInput;

const styles = StyleSheet.create({
  inputContainer: {
    margin: 12,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: Colors.black,
    borderRadius: 32,
    maxWidth: "400",
  },
  inputField: {
    //backgroundColor: "#343",
    height: 35,
    fontSize: 14,
    // marginLeft: 5,
  },
});
