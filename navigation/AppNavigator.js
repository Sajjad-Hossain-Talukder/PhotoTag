import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import AddTag from "../screens/AddTag";
import TagGallery from "../screens/TagGallery";
import Colors from "../utils/Colors";
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

function AppNavigator() {
  return (
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
  );
}

export default AppNavigator;
