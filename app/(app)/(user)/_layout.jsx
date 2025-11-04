import { Redirect, Stack } from 'expo-router';
// import { useEffect } from 'react';
import { ClassProvider } from '@/app/contexts/ClassContext';
import { useAuth } from '../../contexts/AuthContext';

export default function UserLayout() {
    const { user } = useAuth();
    // const {logout} = useAuth();

    // console.log("USER LAYOUT - manual logout");
    
    // Protect user routes
    if (user?.role !== 'user') {
        return <Redirect href="/(auth)" />;
    }

    

    return (
        <ClassProvider>
            <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="userClassEnrolled" />
            <Stack.Screen name="userClassRegistration" />
            <Stack.Screen name="(tabs)" /> 
            </Stack>
        </ClassProvider>
    );
}