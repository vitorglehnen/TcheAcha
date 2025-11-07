import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./NavBar.styles";

// usa 'tabBar' do BottomTabNavigator. Ele recebe 'state' e 'navigation'.
const NavBar = ({ state, navigation }) => {
  const getIconName = (screenName, isActive) => {
    if (screenName === "Home") {
      return isActive ? "home" : "home-outline";
    }
    if (screenName === "MyCases") {
      return isActive ? "briefcase" : "briefcase-outline";
    }
    if (screenName === "Profile") {
      return isActive ? "person" : "person-outline";
    }
    return "ellipse-outline";
  };

  return (
    <View style={styles.navBar}>
      {state.routes.map((route, index) => {
        const isActive = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isActive && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.navButton}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={isActive ? { selected: true } : {}}
            accessibilityLabel={route.name}
          >
            <Ionicons
              name={getIconName(route.name, isActive)}
              size={28}
              style={styles.icon}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default NavBar;
