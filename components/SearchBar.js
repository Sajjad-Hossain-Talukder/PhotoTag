import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "../utils/Colors";
import { useState } from "react";

function SearchBar({ onInput, onClear }) {
  const [inputText, setInputText] = useState("");
  const [isCrossVisible, setIsCrossVisible] = useState(false);

  const onInputEntered = (text) => {
    onInput(text);
    setInputText(text);
    if (text !== "") {
      setIsCrossVisible(true);
    }
  };

  const onPress = () => {
    onClear();
    setInputText("");
    setIsCrossVisible(false);
  };

  return (
    <View style={styles.inputContainer}>
      <Ionicons name="search" size={24} color="black" />
      <TextInput
        style={styles.inputField}
        placeholder="Looking for Tag!"
        enterKeyHint="done"
        password={true}
        secureTextEntry={true}
        onChangeText={onInputEntered}
        value={inputText}
      />
      <Pressable
        style={[
          styles.pressable,
          isCrossVisible ? styles.visible : styles.hidden,
        ]}
        onPress={onPress}
      >
        <MaterialIcons name="cancel" size={24} color="black" />
      </Pressable>
    </View>
  );
}

export default SearchBar;

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    width: "80%",
  },
  inputField: {
    height: 35,
    // width: "70%",
    backgroundColor: "yellow",
  },
  pressable: {
    //backgroundColor: "yellow",
    padding: 2,
  },
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
});

// onChangeText={textInputHandler}
// value={entText}
