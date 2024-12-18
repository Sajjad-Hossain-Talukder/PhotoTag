import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Colors from "../utils/Colors";
import Title from "../components/Title";
import Tags from "../components/Tags";
import { deleteTag, getAllTags } from "../database/sqlite";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";

function Home({ text, navigation }) {
  const [tagList, setTagList] = useState([]);
  const [isReload, setIsReload] = useState(true);
  const [filteredTags, setFilteredTags] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [inputText, setInputText] = useState("");
  const [isCrossVisible, setIsCrossVisible] = useState(false);

  const handleSearch = (text) => {
    console.log(text);
    const filtered = tagList.filter((tag) =>
      tag.tagName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredTags(filtered);
  };

  useEffect(() => {
    if (isReload) {
      retrieveTags();
      setIsReload(false);
    }
  }, [isReload]);

  const retrieveTags = async () => {
    try {
      const tags = await getAllTags();
      const reversedTags = tags.reverse();
      setTagList(reversedTags);
      console.log("All tags:", reversedTags);
    } catch (error) {
      console.error("Error managing tags:", error);
    }
  };

  const onGoBack = () => {
    setSearchText("");
    setIsReload(true);
  };

  const addNewTag = () => {
    console.log(" Add New Tag Pressed ");
    navigation.navigate("AddTag", { onGoBack: onGoBack });
  };

  const onInput = (text) => {
    console.log("Sajjad :: ", text);
    handleSearch(text);
    setSearchText(text);
    setInputText(text);
    text.length > 0 ? setIsCrossVisible(true) : setIsCrossVisible(false);
  };

  const onClear = () => {
    setSearchText("");
    setInputText("");
    setIsCrossVisible(false);
    console.log("Here I am");
  };

  const onDelete = (selectedTags, clearSelectedTags) => {
    console.log(tagList);
    console.log("Delete Tags: ", selectedTags);

    let nm = selectedTags.length > 1 ? "Tags" : "Tag";
    var subTitle = Alert.alert(
      "Delete " + nm,
      "Are you sure you want to delete the selected " + nm.toLowerCase() + "?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            selectedTags.filter((tagId) => {
              //deleteTag();
              console.log("Deleted TagId = " + tagId);
              deleteTag(tagId);
            });
            setIsReload(true);
            clearSelectedTags();
            setSearchText("");
          },
        },
      ]
    );
  };

  return (
    <>
      <StatusBar style="dark" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.screen}>
          <SafeAreaView style={styles.screen}>
            <View style={styles.rootContainer}>
              <Title textFront="Photo" textEnd="Tag" />
              <View style={styles.searchNAdd}>
                <View style={styles.search}>
                  <Ionicons name="search" size={24} color="black" />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Looking for Tag!"
                    enterKeyHint="done"
                    onChangeText={onInput}
                    value={inputText}
                  />
                  <Pressable
                    style={[
                      styles.pressable,
                      isCrossVisible ? styles.visible : styles.hidden,
                    ]}
                    onPress={onClear}
                  >
                    <MaterialIcons name="cancel" size={24} color="black" />
                  </Pressable>
                </View>
                <View style={styles.add}>
                  <Pressable
                    onPress={addNewTag}
                    style={({ pressed }) => pressed && styles.addPressed}
                  >
                    <AntDesign name="plus" size={36} color="black" />
                  </Pressable>
                </View>
              </View>
              <View style={styles.tagView}>
                <Tags
                  tagList={tagList}
                  filteredList={filteredTags}
                  searchText={searchText}
                  onGoBack={onGoBack}
                  onDelete={onDelete}
                />
              </View>
            </View>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

export default Home;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.appBackground,
  },
  rootContainer: {
    flex: 1,
    marginTop: Platform.OS === "android" ? 40 : 0,
  },
  searchNAdd: {
    height: 50,
    margin: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  search: {
    flex: 1,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.black,
    width: "85%",
  },
  add: {
    paddingLeft: 8,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tagView: {
    flex: 1,
  },
  inputField: {
    height: 35,
    width: "75%",
    marginHorizontal: 3,
  },
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
  addPressed: {
    opacity: 0.5,
  },
});
