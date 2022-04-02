import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer, useLinkProps } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import HeaderBackground from "../components/HeaderBackground";
import HeaderTitle from "../components/HeaderTitle";
import HeaderProfile from "../components/HeaderProfile";
import HomeScreen from "./HomeScreen";
import SearchScreen from "./SearchScreen";
import PostScreen from "./PostScreen";
import NotificationScreen from "./NotificationScreen";
import ProfileScreen from "./ProfileScreen";
import ChatScreen from "./ChatScreen"
import EditProfileScreen from "./EditProfileScreen"

const Tab = createBottomTabNavigator();

// Collection of all the screens in the app once the users is authenticated
const AuthenticatedScreen = ({ route, navigation }) => {
  const userID = route.params.userID
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Post") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Notification") {
            iconName = focused ? "notifications" : "notifications-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#573C6B",
        tabBarInactiveTintColor: "white",
        tabBarStyle: { backgroundColor: "black", borderTopColor: "gray" },
        tabBarShowLabel: false,
        headerBackground: HeaderBackground,
        headerLeft: HeaderTitle,
        headerRight: HeaderProfile,
        title: "",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Post" component={PostScreen} />
      {/* Notifications will be the only icon with a badge, right now the default is 3 
          but we need to make it so that a new notification that hasn't been looked
          at will show as a badge */}
      <Tab.Screen name="Notification" component={NotificationScreen} options={{ tabBarBadge: 3}} />
      <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{userID: userID}}/>
      <Tab.Screen name="Chat" component={ChatScreen} options={{tabBarButton: () => null}}/>
      <Tab.Screen name="EditProfile" component={EditProfileScreen} options={{tabBarButton: () => null}}/>
    </Tab.Navigator>
  );
};

export default AuthenticatedScreen;

const styles = StyleSheet.create({});
