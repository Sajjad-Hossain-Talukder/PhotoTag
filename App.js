import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { initializeDatabase } from "./database/sqlite";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Colors from "./utils/Colors";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  const [isDbInitialized, setIsDbInitialized] = useState(false);

  useEffect(() => {
    const initDb = async () => {
      try {
        await initializeDatabase();
        setIsDbInitialized(true);
        console.log("Database initialized successfully.");
      } catch (error) {
        console.error("Database initialization failed", error);
      }
    };
    initDb();
  }, []);

  if (!isDbInitialized) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}> Loading.... </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
