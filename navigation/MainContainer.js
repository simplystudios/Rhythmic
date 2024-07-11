import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

//Screens
import HomeScreen from './screens/home';
import ShazamScreen from './screens/shazam';
import SettingsScreen from './screens/likedsongs';
//Screen Names

const homename = 'Home';
const shazamname = 'Now Playing';
const settingsname = 'Liked Songs';

const Tab = createBottomTabNavigator();


export default function MainContainer(){
    return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName={homename}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let IconName;
              let rn = route.name;

              if (rn === homename) {
                IconName = focused ? "home" : "home-outline";
              } else if (rn === shazamname) {
                IconName = focused ? "play-circle" : "play-circle-outline";
              } else if (rn === settingsname) {
                IconName = focused ? "heart" : "heart-outline";
              }

              return <Ionicons name={IconName} size={32} color={"purple"} />;
            },
          })}
          screenOptions={{
            headerShown: false,
            tabBarInactiveBackgroundColor: "black",
            tabBarActiveBackgroundColor: "#6546a7",
          }}
          tabBarOptions={{
            showLabel: true,
            showIcons: true,
            activeTintColor: "#ffffff",
          }}
        >
          <Tab.Screen
            name={homename}
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name={shazamname}
            component={ShazamScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons
                  name="play-circle-outline"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name={settingsname}
            component={SettingsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="heart" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
}