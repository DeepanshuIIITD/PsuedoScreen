// import { Slot, useRouter, useSegments } from 'expo-router';
// import { useEffect } from 'react';
// import { Image, Text, View } from 'react-native';
// import { AuthProvider, useAuth } from './contexts/AuthContext';

// function LoadingScreen() {
//   return <Text>Loading...</Text>;
// }

// function Splash() {
//   return (
//     <View style={{ 
//       flex: 1, 
//       justifyContent: "center", 
//       alignItems: "center", 
//       backgroundColor: "#000" 
//     }}>
//       <Image 
//         source={require("../assets/images/icon.png")} 
//         style={{ width: 150, height: 150 }} 
//       />
//       <Text style={{ color: "#fff", marginTop: 20, fontSize: 18 }}>
//         Loading...
//       </Text>
//     </View>
//   );
// }

// function RootLayoutNav() {
//   const { user, isLoading } = useAuth();
//   const segments = useSegments();
//   const router = useRouter();

  

//   useEffect(() => {
//     if (isLoading) return;

//     const inAuthGroup = segments[0] === '(auth)';
//     const inAppGroup = segments[0] === '(app)';

//   // checking  
//   console.log("Auth Layout file se ", user);


//     if (!user && !inAuthGroup) {
//       // Redirect to sign-in
//       router.replace('/(auth)');
//     } else if (user && !inAppGroup) {
//       // Redirect to appropriate role home
//       if (user.role === 'admin') {
//         router.replace('/(admin)/adminClassSelector');
//       } else {
//         router.replace('/(user)/userClassEnrolled');
//       }
//     }
//   }, [user, isLoading]);  // removed segments from here 

//   if (isLoading) {
//     return <Splash />;               //<LoadingScreen />; // Create a loading component
//   }

//   return <Slot />;
// }

// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <RootLayoutNav />
//     </AuthProvider>
//   );
// }


import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import { AuthProvider, useAuth } from './contexts/AuthContext';

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

    console.log('Navigation Debug:', {
      user: user?.username,
      role: user?.role,
      segments,
      inAuthGroup,
      inAppGroup
    });

    // User is not logged in
    if (!user) {
      if (!inAuthGroup) {
        console.log('Redirecting to login - no user');
        router.replace('/(auth)/index');
      }
      return;
    }

    // User is logged in - redirect from auth to app
    if (inAuthGroup) {
      console.log('Redirecting away from auth - user logged in');
      if (user.role === 'admin') {
        router.replace('/(app)/(admin)/adminClassSelector');
      } else {
        router.replace('/(app)/(user)/userClassEnrolled');
      }
      return;
    }

  }, [user, isLoading, segments]);      // I removed segments and it worked

  if (isLoading) {
    return <Splash />;
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