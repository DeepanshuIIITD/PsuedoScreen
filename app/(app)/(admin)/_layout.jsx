import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLayout() {
    const { user } = useAuth();
    
    // Protect admin routes
    if (user?.role !== 'admin') {
        return <Redirect href="/(auth)" />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="class-selector" />
            <Stack.Screen name="class-registration" />
            <Stack.Screen name="(tabs)" /> {/* Your tab navigation */}
        </Stack>
    );
}