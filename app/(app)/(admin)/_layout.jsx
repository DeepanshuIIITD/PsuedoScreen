// import { ClassProvider } from '@/app/contexts/ClassContext';
// import { Stack } from 'expo-router';
// import { useAuth } from '../../contexts/AuthContext';


// console.log("🟠 ADMIN LAYOUT - Mounting");
// export default function AdminLayout() {
//     console.log("🟠 ADMIN LAYOUT - Rendering");

//     const { user } = useAuth();
//     console.log("🟠 ADMIN LAYOUT - User:", user?.role);
//     // Protect admin routes
//     if (user?.role !== 'admin') {
//         return <Redirect href="/(auth)" />;
//     }


//     return (
//     <ClassProvider>
//         <Stack>
//         <Stack.Screen 
//             name="adminClassSelector" 
//             options={{ title: "My Classes" }} 
//         />
//         <Stack.Screen 
//             name="adminClassRegistration" 
//             options={{ title: "Register Class" }} 
//         />
//         <Stack.Screen 
//             name="(tabs)" 
//             options={{ headerShown: false }} 
//         />
//         </Stack>
//     </ClassProvider>
//     );
// }

// import { Redirect, Stack } from 'expo-router';
// import { useAuth } from '../../contexts/AuthContext';

// console.log("🟠 ADMIN LAYOUT - Mounting");
// export default function AdminLayout() {
//     console.log("🟠 ADMIN LAYOUT - Rendering");
//     const { user } = useAuth();
//     console.log("🟠 ADMIN LAYOUT - User:", user?.role);
//     // Protect admin routes
//     if (user?.role !== 'admin') {
//         return <Redirect href="/(auth)" />;
//     }

//     // remove the inline comment on tabs which was giving warning
//     return (
//         <Stack screenOptions={{ headerShown: false }}>
//             <Stack.Screen name="adminClassSelector" />
//             <Stack.Screen name="adminClassRegistration" />
//             <Stack.Screen name="(tabs)" />
//         </Stack>
//     );
// }

import { ClassProvider } from '@/app/contexts/ClassContext';
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


    return (
    <ClassProvider>
        <Stack>
        <Stack.Screen 
            name="adminClassSelector" 
            options={{ title: "My Classes" }} 
        />
        <Stack.Screen 
            name="adminClassRegistration" 
            options={{ title: "Register Class" }} 
        />
        <Stack.Screen 
            name="(tabs)" 
            options={{ headerShown: false }} 
        />
        </Stack>
    </ClassProvider>
    );
}