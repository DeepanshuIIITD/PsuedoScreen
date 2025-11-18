import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
console.log("🟣 APP LAYOUT - Mounting");

export default function AppLayout() {
  console.log("🟣 APP LAYOUT - Rendering");
  return (
    <SafeAreaProvider style={{flex:1}}>
        <Slot />
    </SafeAreaProvider>
  );
}