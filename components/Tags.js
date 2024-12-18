import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "../utils/Colors";
import { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";
import DeleteButton from "./GalleryComponents/DeleteButton";

function Tags({ tagList, filteredList, searchText, onGoBack, onDelete }) {
  console.log("TagList.count: ", tagList.length);
  console.log("FilteredList.count: ", filteredList.length);

  const list = searchText.length > 0 ? filteredList : tagList;
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    setIsSelectionMode(selectedTags.length !== 0);
  }, [selectedTags]);

  function shortPressHandler(tag) {
    if (isSelectionMode) {
      if (selectedTags.includes(tag.id)) {
        setSelectedTags((prevTags) => prevTags.filter((i) => i != tag.id));
      } else {
        setSelectedTags((prevTags) => [...prevTags, tag.id]);
      }
      console.log("Selected Index : " + selectedTags);
    } else {
      navigation.navigate("TagGallery", {
        tag: tag,
        onGoBack: onGoBack,
      });
    }
  }

  function longPressHandler(tag) {
    console.log(tag.tagName);
    if (isSelectionMode) {
      console.log("True");
      if (selectedTags.includes(tag.id)) {
        setSelectedTags((prevTags) => prevTags.filter((i) => i != tag.id));
      } else {
        setSelectedTags((prevTags) => [...prevTags, tag.id]);
      }
      console.log("Selected Index : " + selectedTags);
    } else {
      console.log("Mode Change : index -> " + tag.id);
      setSelectedTags((prevTags) => [...prevTags, tag.id]);
      setIsSelectionMode(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  const deleteHandler = () => {
    onDelete(selectedTags, clearSelectedTags);
  };

  const clearSelectedTags = () => {
    console.log("clearSelectedTags called ");
    setSelectedTags([]);
    setIsSelectionMode(false);
  };

  const tagView = (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.tagContainer}>
        {list.map((tag, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.textContainer,
              isSelectionMode &&
                selectedTags.includes(tag.id) &&
                styles.selectedTextContainer,
              tag.isSelected && styles.tagSelected,
            ]}
            onPress={() => shortPressHandler(tag)}
            onLongPress={() => longPressHandler(tag)}
          >
            <Text
              key={index}
              style={[
                styles.tagText,
                isSelectionMode &&
                  selectedTags.includes(tag.id) &&
                  styles.selectedTagText,
              ]}
            >
              {tag.tagName}
            </Text>
            <Text
              style={[
                styles.imageCount,
                isSelectionMode &&
                  selectedTags.includes(tag.id) &&
                  styles.selectedImageCount,
              ]}
            >
              {tag.imageCount}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const noTagView = (
    <View style={styles.noTagContainer}>
      <Text style={styles.noTagText}> No tag found!!</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tags</Text>
      <View style={styles.listContainer}>
        {list.length > 0 ? tagView : noTagView}
      </View>
      {isSelectionMode && <DeleteButton onPress={deleteHandler} />}
    </View>
  );
}

export default Tags;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  title: {
    color: Colors.appFont,
    fontSize: 24,
    fontWeight: "bold",
  },
  listContainer: {
    flex: 1,
    padding: 8,
    paddingTop: 16,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  noTagContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
  },
  noTagText: {
    fontSize: 16,
    fontWeight: "400",
  },
  textContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(7, 0, 0, 0.3)",
    marginVertical: 4,
    marginHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedTextContainer: {
    backgroundColor: Colors.appFont,
  },
  tagSelected: {
    backgroundColor: "rgba(147, 112, 219, 0.3)",
    borderColor: "#db7070",
  },
  tagText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginRight: 4,
  },
  selectedTagText: {
    color: Colors.white,
  },
  imageCount: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.white,
    backgroundColor: Colors.appFont,
    padding: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  selectedImageCount: {
    backgroundColor: Colors.appBackground,
    color: Colors.appFont,
  },
});
