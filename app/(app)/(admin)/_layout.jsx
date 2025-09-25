import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLayout() {
    const { user } = useAuth();
    
    // Protect admin routes
    if (user?.role !== 'admin') {
        return <Redirect href="/(auth)" />;
    }

    // remove the inline comment on tabs which was giving warning
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="adminClassSelector" />
            <Stack.Screen name="adminClassRegistration" />
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}