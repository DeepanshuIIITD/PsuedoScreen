import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
// import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';

export default function userLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs /*initialRouteName='userSupport'*/     /* need to remove this route later */
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="userHome"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="whatshot" color={color} />,
        }}
      />
      <Tabs.Screen
        name= "userPersonal"
        options={{
          title: 'Personal',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="fitness-center" color={color} />,
        }}
        />
      <Tabs.Screen
        name="userSupport"
        options={{
          title: 'Support Me',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="attach-money" color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name = "+not-found"
        options={{
          title: "Support",
          tabBarIcon: ({color}) => <MaterialIcons size={28} name="person" color={color} />
        }}
      /> */}
    </Tabs>
  );
}
