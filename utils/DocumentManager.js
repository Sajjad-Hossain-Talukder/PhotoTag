import * as FileSystem from "expo-file-system";

const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const getFileExtension = (uri) => {
  return uri.substring(uri.lastIndexOf(".") + 1);
};

const createUniqueFilename = (uri) => {
  const randomString = generateRandomString(10);
  const fileExtension = getFileExtension(uri);
  return `${randomString}.${fileExtension}`;
};

export const saveImageToDocuments = async (tagId, imageUri) => {
  const documentDirectory =
    FileSystem.documentDirectory + "PhotoTag/" + String(tagId) + "/";
  const uuid = generateRandomString(4);
  const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);
  const newFilename = `${uuid}-${filename}`;
  try {
    const folderInfo = await FileSystem.getInfoAsync(documentDirectory);
    if (!folderInfo.exists) {
      await FileSystem.makeDirectoryAsync(documentDirectory, {
        intermediates: true,
      });
    }
    const newFilePath = documentDirectory + newFilename;
    await FileSystem.copyAsync({
      from: imageUri,
      to: newFilePath,
    });
    console.log("Image saved at:", newFilePath);
    return newFilePath;
  } catch (error) {
    console.error("Error saving image:", error);
  }
};

export const clearAppDirectory = async () => {
  try {
    const directoryPath = FileSystem.documentDirectory;
    console.log("App Directory Path:", directoryPath);

    const files = await FileSystem.readDirectoryAsync(directoryPath);
    console.log("Files in Directory:", files);

    for (const file of files) {
      const filePath = `${directoryPath}${file}`;
      await FileSystem.deleteAsync(filePath, { idempotent: true });
      console.log(`Deleted: ${filePath}`);
    }

    console.log("All files deleted successfully.");
  } catch (error) {
    console.error("Error clearing directory:", error);
  }
};

export const deleteFolderByTagId = async (tagId) => {
  try {
    const folderPath = `${FileSystem.documentDirectory}PhotoTag/${String(
      tagId
    )}/`;

    const folderInfo = await FileSystem.getInfoAsync(folderPath);
    if (!folderInfo.exists) {
      console.log("Folder does not exist:", folderPath);
      return;
    }

    await FileSystem.deleteAsync(folderPath, { idempotent: true });
    console.log("Folder deleted successfully:", folderPath);
  } catch (error) {
    console.error("Error deleting folder:", error);
  }
};
