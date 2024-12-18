import {
  View,
  Modal,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
import { useLayoutEffect } from "react";
import { getImagesByTag } from "../database/sqlite";
import { useState, useEffect } from "react";
import ImageGallery from "../components/AddTagComponents/ImageGallery";
import { deleteImage } from "../database/sqlite";
import * as ImagePicker from "expo-image-picker";
import { saveImageToDocuments } from "../utils/DocumentManager";
import { addImage, updateTagName } from "../database/sqlite";
import Colors from "../utils/Colors";
import EditButton from "../components/GalleryComponents/EditButton";
import AddButton from "../components/GalleryComponents/AddButton";

function TagGallery({ route, navigation }) {
  const tag = route.params.tag;
  const onGoBack = route.params.onGoBack;

  const [images, setImages] = useState([]);
  const [isReload, setIsReload] = useState(true);
  const [title, setTitle] = useState(tag.tagName);

  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState(tag.tagName);
  const [addIsVisible, setAddIsVisible] = useState(true);

  const pickImages = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access the gallery is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        saveImageToDocs(result.assets);
      }
    } catch (error) {
      console.error("Error picking images:", error);
      alert("Failed to pick images. Please try again.");
    }
  };

  const saveImageToDocs = async (newImages) => {
    try {
      const promises = newImages.map(async (image) => {
        console.log("Original URI:", image.uri);
        const newImageUri = await saveImageToDocuments(tag.id, image.uri);
        console.log("1> saveImageToDocs:", newImageUri);
        await addImagesToDB(tag.id, newImageUri);
      });
      await Promise.all(promises);
      setIsReload(true);
      console.log("All images processed successfully.");
    } catch (error) {
      console.error("Error saving Images:", error);
    }
  };

  const addImagesToDB = async (tagId, imageUri) => {
    console.log("1> addImagesToDB", imageUri);
    try {
      const imageId = await addImage(tagId, imageUri);
      console.log("Added image with ID:", imageId);
    } catch (error) {
      console.error("Error adding image to DB:", error);
    }
  };

  const onAddMore = () => {
    console.log("Add more ");
    pickImages();
  };

  useEffect(() => {
    if (isReload) {
      getImages(tag.id);
      setIsReload(false);
    }

    const unsubscribe = navigation.addListener(
      "beforeRemove",
      (e) => {
        e.preventDefault();
        onGoBack();
        navigation.dispatch(e.data.action);
        return unsubscribe;
      },
      [navigation]
    );
  }, [tag, isReload, navigation]);

  useLayoutEffect(() => {
    console.log(" > useLayoutEffect : TagName : ", title);
    navigation.setOptions({
      headerTitle: title,
      headerTitleStyle: { fontSize: 20 },
      headerRight: () => <EditButton onPress={editTag} />,
    });
  }, [navigation, isReload]);

  const getImages = async (tagId) => {
    try {
      const images = await getImagesByTag(tagId);
      const reversedImages = images.reverse();
      console.log("Images for tag:", reversedImages);
      setImages(reversedImages);
      return reversedImages;
    } catch (error) {
      return null;
    }
  };

  const onDelete = () => {
    setTimeout(() => {
      setIsReload(true);
    }, 200);
  };

  const handleSave = () => {
    console.log("User Input:", inputValue);
    updateTagName(tag.id, inputValue.trim(), (success) => {
      if (success) {
        console.log("Update Tag Name :- ", inputValue.trim());
        setTitle(inputValue.trim());
        setIsReload(true);
      } else {
        //console.error("Failed to update the tag.");
        setInputValue(tag.tagName);
        showAlert(
          "Duplicate tag",
          "The tag already exists. Please use a different title.",
          "Ok"
        );
      }
    });

    setModalVisible(false);
  };

  function showAlert(title, message, btnTitle) {
    Alert.alert(title, message, [{ text: btnTitle }]);
  }

  const handleCancel = () => {
    setInputValue(tag.tagName);
    setModalVisible(false);
  };

  const editTag = () => {
    setModalVisible(true);
  };

  const visibleAddButton = (isVisible, indexs) => {
    setAddIsVisible(isVisible);
  };

  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.title}>Edit tag title</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Type here..."
              placeholderTextColor="#888"
              value={inputValue}
              onChangeText={setInputValue}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.galleryContainer}>
        <ImageGallery
          images={images}
          isFromAddTag={false}
          visibleAddButton={visibleAddButton}
          onDelete={onDelete}
          isReload={isReload}
          tagName={tag.tagName}
        />
        {addIsVisible && (
          <AddButton style={styles.addButton} onPress={onAddMore} />
        )}
      </View>
    </View>
  );
}

export default TagGallery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  galleryContainer: {
    flex: 1,
    position: "relative",
  },
  addButton: {
    position: "absolute",
    bottom: 50,
    right: 20,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.appPopupBG,
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    width: "80%",
    backgroundColor: Colors.appBackground,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputField: {
    width: "100%",
    height: 40,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: Colors.appCancel,
  },
  saveButton: {
    backgroundColor: Colors.appFont,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: "bold",
  },
});
