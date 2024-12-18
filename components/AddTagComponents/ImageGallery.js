import {
  View,
  Image,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  Modal,
  Alert,
  Animated,
} from "react-native";

import { useState, useEffect } from "react";
import DeleteButton from "../GalleryComponents/DeleteButton";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { deleteImage } from "../../database/sqlite";
import * as Haptics from "expo-haptics";
import ImagePreview from "../CommonUI/ImagePreview";

function ImageGallery({
  images,
  visibleAddButton,
  isFromAddTag,
  onDelete,
  isReload,
  tagName,
}) {
  console.log("> ImageGallery : Reloaded ", isReload);
  console.log("> isFromAddTag : ", isFromAddTag);
  console.log("> tagName : ", tagName);

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    console.log(" > useEffect : ImageGallery : " + selectedImages);
    if (selectedImages.length === 0) {
      setIsSelectionMode(false);
      visibleAddButton(true, selectedImages);
    } else {
      visibleAddButton(false, selectedImages);
    }
    if (isReload) {
      setIsSelectionMode(false);
      setSelectedImages([]);
    }
  }, [selectedImages, isReload]);

  const numColumns = Platform.isPad ? 3 : 2;
  const screenWidth = Dimensions.get("window").width;
  const imageSize = (screenWidth - 20) / numColumns - 10;

  const handleShortTap = (item, index) => {
    console.log(isFromAddTag ? item.uri : item.imageUri);
    if (isSelectionMode) {
      console.log("Long Mood");
      if (selectedImages.includes(index)) {
        setSelectedImages(selectedImages.filter((i) => i !== index));
      } else {
        setSelectedImages([...selectedImages, index]);
      }
      console.log("Selected Image List : " + selectedImages);
    } else {
      setSelectedImage(isFromAddTag ? item.uri : item.imageUri);
      setModalVisible(true);
    }
  };

  const handleLongTap = (index) => {
    //alert(`Long tap detected on image ${index + 1}`);
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedImages([index]);
      console.log("Selected Image List : " + selectedImages);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      if (selectedImages.includes(index)) {
        setSelectedImages(selectedImages.filter((i) => i !== index));
      } else {
        setSelectedImages([...selectedImages, index]);
      }
    }
  };

  const marked = (
    <MaterialCommunityIcons
      name="checkbox-marked-circle"
      size={24}
      color="blue"
    />
  );

  const unmarked = <Entypo name="circle" size={24} color="black" />;

  const renderItem = ({ item, index }) => (
    <View style={[styles.imageContainer]}>
      <TouchableOpacity
        onPress={() => handleShortTap(item, index)}
        onLongPress={() => handleLongTap(index)}
        delayLongPress={500}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.imageInnerContainer,
            { width: imageSize, height: imageSize },
          ]}
        >
          <Image
            source={{ uri: isFromAddTag ? item.uri : item.imageUri }}
            style={[styles.image, { width: imageSize, height: imageSize }]}
            resizeMode="cover"
          />

          {isSelectionMode && (
            <View style={styles.selectionIconContainer}>
              {selectedImages.includes(index) ? marked : unmarked}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  const deletePressed = () => {
    console.log("Delete These images: " + selectedImages);

    let nm = selectedImages.length > 1 ? "Images" : "Image";
    var subTitle = Alert.alert(
      "Delete " + nm,
      "Are you sure you want to delete the selected " + nm.toLowerCase() + "?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            selectedImages.filter((index) => {
              deleteImage(images[index].id, images[index].tagId);
            });
            setSelectedImages([]);
            setIsSelectionMode(false);
            onDelete();
          },
        },
      ]
    );
  };

  const noImageView = (
    <View style={styles.noImageView}>
      <Text style={styles.noImagesText}>
        No images {isFromAddTag ? "selected" : "found"}.
      </Text>
    </View>
  );

  const dismissModal = () => {
    setModalVisible(false);
  };

  const listView = (
    <View style={styles.listContainer}>
      <FlatList
        data={images}
        keyExtractor={(item, index) => `image-${index}`}
        renderItem={renderItem}
        numColumns={numColumns}
        contentContainerStyle={styles.imageList}
        showsVerticalScrollIndicator={false}
      />
      <ImagePreview
        imageUri={selectedImage}
        modalVisible={modalVisible}
        dismissModal={dismissModal}
        isFromAddTag={isFromAddTag}
        tagName={tagName}
      />
      {selectedImages.length > 0 && !isFromAddTag && (
        <DeleteButton onPress={deletePressed} />
      )}
    </View>
  );

  return <>{images.length === 0 ? noImageView : listView}</>;
}

export default ImageGallery;

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    margin: 10,
    marginTop: 5,
  },
  noImageView: {
    flex: 1,
    alignItems: "center",
    paddingTop: 100,
  },
  noImagesText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#999",
  },
  imageList: {
    paddingVertical: 10,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  imageInnerContainer: {
    flex: 1,
  },
  image: {
    borderRadius: 8,
    height: 100,
    width: 300,
  },
  selectionIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
