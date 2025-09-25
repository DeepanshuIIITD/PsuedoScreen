import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function UserLayout() {
    const { user } = useAuth();
    
    // Protect user routes
    if (user?.role !== 'user') {
        return <Redirect href="/(auth)" />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="userClassEnrolled" />
        <Stack.Screen name="userClassRegistration" />
        <Stack.Screen name="(tabs)" /> {/* Your tab navigation */}
        </Stack>
    );
}