import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [access_token, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API = "https://strea.com";

  // Load stored auth data at startup
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedToken, storedUserData] = await Promise.all([
        SecureStore.getItemAsync("access_token"),
        SecureStore.getItemAsync("user"),
      ]);

      if (storedToken && storedUserData) {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUserData));
      }
    } catch (error) {
      console.error("Error loading stored auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (role, username, password) => {
    try {
      const url = role === "admin" ? "/admin/signIn" : "/user/signIn";
      const response = await fetch(`${API}${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: username, password }),
        credentials: "include", // IMPORTANT for cookies (refresh token)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");

      const userWithRole = {
        ...data.user,
        role: role,
      };

      if (data.access_token !== access_token) {
        await SecureStore.setItemAsync("access_token", data.access_token);
        setAccessToken(data.access_token);
      }

      if (JSON.stringify(userWithRole) !== JSON.stringify(user)) {
        await SecureStore.setItemAsync("user", JSON.stringify(userWithRole));
        setUser(userWithRole);
      }

      return { success: true };
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      await Promise.all([
        SecureStore.deleteItemAsync("access_token").catch(() => {}),
        SecureStore.deleteItemAsync("user").catch(() => {}),
      ]);
      setAccessToken(null);
      setUser(null);
    }
  };

  const attemptTokenRefresh = async () => {
    try {
      const response = await fetch(`${API}/user/refreshToken`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Refresh failed");

      await SecureStore.setItemAsync("access_token", data.access_token);
      setAccessToken(data.access_token);

      return data.access_token;
    } catch (err) {
      console.error("Token refresh failed:", err);
      await logout();
      throw new Error("Session expired. Please login again.");
    }
  };

  // ✅ Unified API call wrapper (replaces apiHelper)
  const apiCall = async (url, options = {}) => {
    try {
      // First attempt
      let response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
          Authorization: `Bearer ${access_token}`,
        },
        credentials: "include",
      });

      // If token expired → refresh and retry
      if (response.status === 401) {
        console.log("Access token expired, refreshing...");

        try {
          const newToken = await attemptTokenRefresh();
          response = await fetch(url, {
            ...options,
            headers: {
              "Content-Type": "application/json",
              ...options.headers,
              Authorization: `Bearer ${newToken}`,
            },
            credentials: "include",
          });
        } catch (refreshError) {
          console.log("Refresh failed, logging out...");
          await logout();
          router.replace("/index");
          throw new Error("Session expired. Please login again.");
        }
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };

  const value = {
    user,
    access_token,
    isLoading,
    login,
    logout,
    refreshToken: attemptTokenRefresh,
    apiCall, // 👈 Use this everywhere instead of apiHelper
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};






// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { createContext, useContext, useEffect, useState } from 'react';

// const AuthContext = createContext();
// const DEV_MODE = true; // Set to false for production. very important


// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// }

// export function AuthProvider({ children }) {
//   // const [user, setUser] = useState(null);     uncomment after testing
//   const [user, setUser] = useState(
//     DEV_MODE ? { id: '1', username: 'testuser', role: 'user' } : null
//   );
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     loadStoredAuth();
//   }, []);

//   const loadStoredAuth = async () => {
//     try {
//       const [token, userData] = await Promise.all([
//         AsyncStorage.getItem('userToken'),
//         AsyncStorage.getItem('userData')
//       ]);
      
//       if (token && userData) {
//         setUser(JSON.parse(userData));
//       }
//     } catch (error) {
//       console.error('Error loading stored auth:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const signIn = async (userData, token) => {
//     try {
//       await Promise.all([
//         AsyncStorage.setItem('userToken', token),
//         AsyncStorage.setItem('userData', JSON.stringify(userData))
//       ]);
//       setUser(userData);
//     } catch (error) {
//       console.error('Error storing auth data:', error);
//       throw error;
//     }
//   };

//   const signOut = async () => {
//     try {
//       await AsyncStorage.multiRemove(['userToken', 'userData']);
//       setUser(null);
//     } catch (error) {
//       console.error('Error clearing auth data:', error);
//       throw error;
//     }
//   };

//   const value = {
//     user,
//     isLoading,
//     signIn,
//     signOut
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }



// import * as SecureStore from "expo-secure-store";
// import React, { createContext, useContext, useEffect, useState } from "react";

// export const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [access_token, setAccessToken] = useState(null);
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // const { API } = Constants.expoConfig.extra;
//   const API = "https://streak-app-uxyv.onrender.com";
//   // Load stored auth data at startup
//   useEffect(() => {
//     loadStoredAuth();
//   }, []);

//   const loadStoredAuth = async () => {
//     try {
//       const [storedToken, storedUserData] = await Promise.all([
//         SecureStore.getItemAsync("access_token"),
//         SecureStore.getItemAsync("user")
//       ]);

//       if (storedToken && storedUserData) {
//         setAccessToken(storedToken);
//         setUser(JSON.parse(storedUserData));
//       }

//       // trying to logout forcefully 
//       // console.log("Logout trying forcefully !!");
//       // await Promise.all([
//       //   SecureStore.deleteItemAsync("access_token").catch(() => {}),
//       //   SecureStore.deleteItemAsync("user").catch(() => {})
//       // ]);
//       // setAccessToken(null);
//       // setUser(null);
//     } catch (error) {
//       console.error('Error loading stored auth:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const login = async (role, username, password) => {
//     try {
//       const url = role === "admin" ? "/admin/signIn" : "/user/signIn";
//       const response = await fetch(`${API}${url}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userName: username, password }),
//         credentials: "include", // IMPORTANT for cookies (refresh token)
//       });


//       console.log("{AuthContext}:");
//       console.log("Awaiting data response")
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || "Login failed");
//       console.log("Data Should have come by now");

//       // Add role to the user data
//       const userWithRole = {
//         ...data.user,
//         role: role // Add the role parameter from login function
//       };

//       // Only update state if values actually changed
//     if (data.access_token !== access_token) {
//       await SecureStore.setItemAsync("access_token", data.access_token);
//       setAccessToken(data.access_token);
//     }
    
//     // if (JSON.stringify(data.user) !== JSON.stringify(user)) {
//     //   await SecureStore.setItemAsync("user", JSON.stringify(data.user));
//     //   setUser(data.user);
//     // }
//     if (JSON.stringify(userWithRole) !== JSON.stringify(user)) {
//         await SecureStore.setItemAsync("user", JSON.stringify(userWithRole));
//         setUser(userWithRole);
//       }

//     console.log(data);

//       return {success: true};
//     } catch (err) {
//       console.log(err);
//       return { success: false, error: err.message };
//     }
//   };

//   const logout = async () => {
//     try {
//       // Call logout endpoint to clear refresh token cookie
//       await fetch(`${API}/logout`, {
//         method: "POST",
//         credentials: "include"
//       });
//     } catch (error) {
//       console.error('Logout API call failed:', error);
//     } finally {
//       // Clear local storage regardless of API call result
//       await Promise.all([
//         SecureStore.deleteItemAsync("access_token").catch(() => {}),
//         SecureStore.deleteItemAsync("user").catch(() => {})
//       ]);
//       setAccessToken(null);
//       setUser(null);
//     }
//   };

//   const attemptTokenRefresh = async () => {
//     try {
//       const response = await fetch(`${API}/user/refreshToken`, {
//         method: "POST",
//         credentials: "include", // This sends the httpOnly refresh token cookie
//         headers: {
//           "Content-Type": "application/json"
//         }
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || "Refresh failed");
//       }

//       // Store new access token and updated user data (if provided)
//       await SecureStore.setItemAsync("access_token", data.access_token);
//       setAccessToken(data.access_token);

//       return data.access_token;
//     } catch (err) {
//       console.error('Token refresh failed:', err);
//       // If refresh fails, logout user
//       // await logout();
//       if (access_token) { // Only logout if we had a token to begin with
//       await logout();
//     }
//       throw err;
//     }
//   };

//   // Wrapper for API calls with automatic token refresh
//   const authenticatedFetch = async (url, options = {}) => {
//     const makeRequest = async (token) => {
//       return fetch(url, {
//         ...options,
//         headers: {
//           ...options.headers,
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         credentials: "include"
//       });
//     };

//     try {
//       let response = await makeRequest(access_token);
      
//       // If token expired (401), try to refresh
//       if (response.status === 401) {
//         console.log('Access token expired, attempting refresh...');
//         const newToken = await attemptTokenRefresh();
//         response = await makeRequest(newToken);
//       }
      
//       return response;
//     } catch (error) {
//       console.error('Authenticated fetch failed:', error);
//       // await logout();
//       throw error;
//     }
//   };

//   const value = {
//     user,
//     access_token,
//     isLoading,
//     login,
//     logout,
//     refreshToken: attemptTokenRefresh,
//     authenticatedFetch // Provide this for API calls
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };