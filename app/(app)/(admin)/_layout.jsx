import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

console.log("🟠 ADMIN LAYOUT - Mounting");
export default function AdminLayout() {
    console.log("🟠 ADMIN LAYOUT - Rendering");
    const { user } = useAuth();
    console.log("🟠 ADMIN LAYOUT - User:", user?.role);
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