// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { createContext, useContext, useEffect, useState } from 'react';

// type User = {
//   id: string;
//   username: string;
//   email: string;
//   role: 'admin' | 'user';
// };

// type AuthContextType = {
//   user: User | null;
//   isLoading: boolean;
//   signIn: (user: User, token: string) => Promise<void>;
//   signOut: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// }

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     loadStoredAuth();
//   }, []);

//   const loadStoredAuth = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const userData = await AsyncStorage.getItem('userData');
      
//       if (token && userData) {
//         setUser(JSON.parse(userData));
//       }
//     } catch (error) {
//       console.error('Error loading stored auth:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const signIn = async (userData: User, token: string) => {
//     try {
//       await AsyncStorage.setItem('userToken', token);
//       await AsyncStorage.setItem('userData', JSON.stringify(userData));
//       setUser(userData);
//     } catch (error) {
//       console.error('Error storing auth data:', error);
//     }
//   };

//   const signOut = async () => {
//     try {
//       await AsyncStorage.multiRemove(['userToken', 'userData']);
//       setUser(null);
//     } catch (error) {
//       console.error('Error clearing auth data:', error);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }




import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
const DEV_MODE = true; // Set to false for production. very important


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  // const [user, setUser] = useState(null);     uncomment after testing
  const [user, setUser] = useState(
    DEV_MODE ? { id: '1', username: 'testuser', role: 'user' } : null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('userData')
      ]);
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (userData, token) => {
    try {
      await Promise.all([
        AsyncStorage.setItem('userToken', token),
        AsyncStorage.setItem('userData', JSON.stringify(userData))
      ]);
      setUser(userData);
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData']);
      setUser(null);
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}