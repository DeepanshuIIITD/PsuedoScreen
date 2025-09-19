import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
// import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';

export default function adminLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
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
        name="adminHome"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="whatshot" color={color} />,
        }}
      />
      <Tabs.Screen
        name="adminStreak"
        options={{
          title: 'Personal',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="fitness-center" color={color} />,
        }}
      />
      <Tabs.Screen
        name="adminStudents"
        options={{
          title: 'Students',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="school" color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name = ""
        options={{
          title: "Support",
          tabBarIcon: ({color}) => <MaterialIcons size={28} name="person" color={color} />
        }}
      /> */}
    </Tabs>
  );
}
