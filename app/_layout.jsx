// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';
// import { SafeAreaView } from 'react-native-safe-area-context';

// import { useColorScheme } from '@/hooks/useColorScheme';

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   if (!loaded) {
//     // Async font loading only occurs in development.
//     return null;
//   }

//   return (
//     <SafeAreaView style={{flex: 1}}>
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>     {/* need to remove this route later */}
//         <Stack.Screen name="index" options={{ headerShown: false }} />
//         <Stack.Screen name="(user)" options={{ headerShown: false }} />
//         <Stack.Screen name="(admin)" options={{ headerShown: false }} />
//         {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
//         <Stack.Screen name="+not-found" />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//     </SafeAreaView>
//   );
// }






import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function LoadingScreen() {
  return <Text>Loading...</Text>;
}

function Splash() {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: "center", 
      alignItems: "center", 
      backgroundColor: "#000" 
    }}>
      <Image 
        source={require("../assets/images/icon.png")} 
        style={{ width: 150, height: 150 }} 
      />
      <Text style={{ color: "#fff", marginTop: 20, fontSize: 18 }}>
        Loading...
      </Text>
    </View>
  );
}

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

  // checking  
  console.log("Auth Layout file se ", user);


    if (!user && !inAuthGroup) {
      // Redirect to sign-in
      router.replace('/(auth)');
    } else if (user && !inAppGroup) {
      // Redirect to appropriate role home
      if (user.role === 'admin') {
        router.replace('adminClassSelector');
      } else {
        router.replace('/userClassEnrolled');
      }
    }
  }, [user, isLoading]);  // removed segments from here 

  if (isLoading) {
    return <Splash />;               //<LoadingScreen />; // Create a loading component
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}