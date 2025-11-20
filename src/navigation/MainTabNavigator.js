import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NavBar from "../components/navbar/NavBar";

import HomeScreen from "../views/home/HomeScreen";
import MyCasesScreen from "../views/myCases/MyCasesScreen";
import ProfileScreen from "../views/profile/profileScreen";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <NavBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="MyCases" component={MyCasesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
