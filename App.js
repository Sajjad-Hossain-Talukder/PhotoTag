import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeDatabase } from "./database/sqlite";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Home from "./screens/Home";
import AddTag from "./screens/AddTag";
import TagGallery from "./screens/TagGallery";
import Colors from "./utils/Colors";

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: Colors.appBackground,
  },
  headerBackTitleStyle: {
    fontSize: 16,
  },
  headerTintColor: Colors.black,
};

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
      <NavigationContainer>
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddTag"
            component={AddTag}
            options={{
              headerTitle: "Add New Tag",
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen
            name="TagGallery"
            component={TagGallery}
            // options={{
            //   headerBackVisible: false,
            // }}
          />
        </Stack.Navigator>
      </NavigationContainer>
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
