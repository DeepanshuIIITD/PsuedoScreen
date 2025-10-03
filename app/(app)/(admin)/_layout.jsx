import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLayout() {
    // const { user } = useAuth();
    const { user, isLoading } = useAuth();
    
    // Wait for auth to load
    if (isLoading) {
        return null; // or a loading component
    }
    // Protect admin routes
    console.log("Welcome from _layout (admin) your role is ", {user});
    if (user?.role !== 'admin') {
        return <Redirect href="/(auth)" />;
    }

    // removed the inline comment on tabs which was giving warning
    // added Navigator aftor Stack
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="adminClassSelector" />
            <Stack.Screen name="adminClassRegistration" />
            <Stack.Screen name="(tabs)" />
        </Stack >
    );
}