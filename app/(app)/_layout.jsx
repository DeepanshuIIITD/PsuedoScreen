// import { Redirect, Stack } from 'expo-router';
// import { useAuth } from '../contexts/AuthContext';

// export default function AppLayout() {
//     const { user } = useAuth();

//     if (!user) {
//         return <Redirect href="/(auth)" />;
//     }

//   // Role-based routing protection
//     return (
//         <Stack screenOptions={{ headerShown: false }}>
//             <Stack.Screen name="(admin)" />
//             <Stack.Screen name="(user)" />
//         </Stack>
//     );
// }


import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AppLayout() {
  return (
    <SafeAreaProvider style={{flex:1}}>
        <Slot />
    </SafeAreaProvider>
  );
}