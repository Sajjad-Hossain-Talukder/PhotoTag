import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AddTagTextInput from "../components/AddTagComponents/AddTagTextInput";
import CustomButton from "../components/CustomButton";
import ImageGallery from "../components/AddTagComponents/ImageGallery";
import Colors from "../utils/Colors";
import { addTag, addImage } from "../database/sqlite";
import { saveImageToDocuments } from "../utils/DocumentManager";

function AddTag({ route, navigation }) {
  const onGoBack = route.params.onGoBack;
  const [images, setImages] = useState([]);
  const [tag, setTag] = useState("");
  const [isRemove, setIsRemove] = useState(false);
  const [removeIndexs, setRemoveIndexs] = useState([]);
  const [isReload, setIsReload] = useState(false);

  useEffect(() => {
    if (isReload) {
      setIsReload(false);
    }
  }, [isReload]);

  const pickImages = async () => {
    setIsRemove(false);
    setIsReload(true);
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access the gallery is required!");
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        setImages((prevImages) => {
          const newImages = result.assets.filter(
            (newImage) =>
              !prevImages.some(
                (prevImage) => prevImage.fileName === newImage.fileName
              )
          );
          return [...newImages, ...prevImages];
        });
      }
    } catch (error) {
      console.error("Error picking images:", error);
      alert("Failed to pick images. Please try again.");
    }
  };

  const buttonTitle = images.length > 0 ? "Pick more images" : "Pick images";

  const saveButton =
    images.length > 0 ? (
      <View style={styles.saveButtonViewContainer}>
        <View style={styles.saveButtonView}>
          <Pressable
            android_ripple={Colors.appBackground}
            style={({ pressed }) => [
              styles.button,
              isRemove
                ? { backgroundColor: Colors.appRed }
                : { backgroundColor: Colors.appButton },
              pressed && styles.onPressed,
            ]}
            onPress={isRemove ? removeHandler : saveHandler}
          >
            <Text style={styles.buttonText}>
              {isRemove ? "Remove" : "Save"}
            </Text>
          </Pressable>
        </View>
      </View>
    ) : null;

  function onTagAdd(newTag) {
    setTag(newTag);
  }

  function visibleAddButton(isVisible, indexs) {
    if (isVisible === isRemove) {
      setIsRemove(!isVisible);
    }
    setRemoveIndexs(indexs);
    console.log(
      " Image Got Seletected, Show Remove " +
        isVisible +
        " isRemove " +
        isRemove
    );
  }

  function saveHandler() {
    if (tag.trim() === "") {
      showAlert(
        "Invalid Input",
        "Tag name cannot be empty. Please enter a valid tag.",
        "Ok"
      );
    } else {
      addTagToDB();
    }
  }

  function removeHandler() {
    console.log("Remove Handler .. Indexes : " + removeIndexs);
    setImages((prevImages) =>
      prevImages.filter((_, i) => !removeIndexs.includes(i))
    );
    setIsReload(true);
  }

  function showAlert(title, message, btnTitle) {
    Alert.alert(title, message, [{ text: btnTitle }]);
  }

  const addTagToDB = () => {
    addTag(tag.trim(), (success, data) => {
      if (success) {
        console.log("Tag inserted successfully with ID:", data);
        saveImageToDocs(data);
        console.log("Added tag with ID:", data);
        setTimeout(() => {
          onGoBack();
          navigation.pop();
        }, 500);
      } else {
        //console.error("Failed to insert tag:", data);
        showAlert(
          "Duplicate tag",
          "The tag already exists. Please use a different title.",
          "Ok"
        );
      }
    });
  };

  const saveImageToDocs = async (tagId) => {
    try {
      const promises = images.map(async (image) => {
        console.log("Original URI:", image.uri);
        const newImageUri = await saveImageToDocuments(tagId, image.uri);
        console.log("1> saveImageToDocs:", newImageUri);
        await addImagesToDB(tagId, newImageUri);
      });
      await Promise.all(promises);
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

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.rootContainer}>
          <View style={styles.container}>
            <View>
              <View>
                <AddTagTextInput onTagAdd={onTagAdd} />
              </View>
              <View style={styles.buttonContainer}>
                <CustomButton onPress={pickImages} title={buttonTitle} />
              </View>
            </View>

            <View style={styles.galleryContainer}>
              <ImageGallery
                images={images}
                visibleAddButton={visibleAddButton}
                isFromAddTag={true}
                isReload={isReload}
                tagName=""
              />
            </View>
          </View>
          {saveButton}
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  buttonContainer: {
    alignItems: "center",
  },
  galleryContainer: {
    flex: 1,
    marginTop: 8,
  },
  saveButtonViewContainer: {
    height: 80,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonView: {
    height: 50,
    width: "60%",
    maxWidth: 400,
    borderRadius: 8,
    overflow: "hidden",
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
  },
  onPressed: {
    opacity: 0.7,
  },
});

export default AddTag;
