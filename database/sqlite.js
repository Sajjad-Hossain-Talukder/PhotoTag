import * as SQLite from "expo-sqlite";
import { deleteFolderByTagId } from "../utils/DocumentManager";
const DATABASE_NAME = "phototag-app-1.db";

const openDatabaseAsync = async () => {
  return await SQLite.openDatabaseAsync(DATABASE_NAME);
};

const initializeDatabase = async () => {
  const db = await openDatabaseAsync();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS Tag (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tagName TEXT NOT NULL UNIQUE,
      imageCount INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS Image (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tagId INTEGER NOT NULL,
      imageUri TEXT NOT NULL,
      FOREIGN KEY (tagId) REFERENCES Tag(id) ON DELETE CASCADE
    );
  `);
};

const addTag = async (tagName, callback) => {
  try {
    const db = await openDatabaseAsync();
    const result = await db.runAsync(
      "INSERT INTO Tag (tagName) VALUES (?)",
      tagName
    );

    if (result.lastInsertRowId) {
      callback(true, result.lastInsertRowId);
    } else {
      callback(false, null);
    }
  } catch (error) {
    callback(false, error.message);
  }
};

const addImage = async (tagId, imageUri) => {
  const db = await openDatabaseAsync();
  const result = await db.runAsync(
    "INSERT INTO Image (tagId, imageUri) VALUES (?, ?)",
    tagId,
    imageUri
  );
  await db.runAsync(
    "UPDATE Tag SET imageCount = imageCount + 1 WHERE id = ?",
    tagId
  );
  return result.lastInsertRowId;
};

const getAllTags = async () => {
  const db = await openDatabaseAsync();
  return await db.getAllAsync("SELECT * FROM Tag");
};

const getImagesByTag = async (tagId) => {
  const db = await openDatabaseAsync();
  return await db.getAllAsync("SELECT * FROM Image WHERE tagId = ?", tagId);
};

const deleteTag = async (tagId) => {
  const db = await openDatabaseAsync();
  await db.runAsync("DELETE FROM Tag WHERE id = ?", tagId);
  deleteFolderByTagId(tagId);
};

const deleteImage = async (imageId, tagId) => {
  const db = await openDatabaseAsync();
  await db.runAsync("DELETE FROM Image WHERE id = ?", imageId);
  await db.runAsync(
    "UPDATE Tag SET imageCount = imageCount - 1 WHERE id = ?",
    tagId
  );
};

const updateTagName = async (tagId, newTagName, callback) => {
  try {
    const db = await openDatabaseAsync();
    await db.runAsync("UPDATE Tag SET tagName = ? WHERE id = ?", [
      newTagName,
      tagId,
    ]);
    console.log(`Tag with ID ${tagId} updated to '${newTagName}'`);
    callback(true); // Indicate success
  } catch (error) {
    //console.error("Error updating tag:", error);
    callback(false); // Indicate failure
  }
};

const getTagNameById = async (tagId) => {
  const db = await openDatabaseAsync();
  const result = await db.getFirstAsync(
    "SELECT * FROM Tag WHERE id = ?",
    tagId
  );
  return result ? result.tagName : null;
};

export {
  openDatabaseAsync,
  initializeDatabase,
  addTag,
  addImage,
  getAllTags,
  getImagesByTag,
  deleteTag,
  deleteImage,
  updateTagName,
  getTagNameById,
};
