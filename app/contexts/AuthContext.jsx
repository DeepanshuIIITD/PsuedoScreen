// import { router } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { createContext, useContext, useEffect, useState } from "react";

// export const AuthContext = createContext();
// console.log("🟢 AUTH CONTEXT - Loading");

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   console.log("🟢 AUTH PROVIDER - Mounting");
//   const [access_token, setAccessToken] = useState(null);
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const API = "https://streak-app-uxyv.onrender.com";

//   // Load stored auth data at startup
//   useEffect(() => {
//     loadStoredAuth();
//   }, []);

//   const loadStoredAuth = async () => {
//     try {
//       const [storedToken, storedUserData] = await Promise.all([
//         SecureStore.getItemAsync("access_token"),
//         SecureStore.getItemAsync("user"),
//       ]);

//       if (storedToken && storedUserData) {
//         setAccessToken(storedToken);
//         setUser(JSON.parse(storedUserData));
//       }
//     } catch (error) {
//       console.error("Error loading stored auth:", error);
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

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || "Login failed");

//       console.log("Response ",response);
//       console.log("Data and api", data, {API},{url});

//       const userWithRole = {
//         ...data.user,
//         role: role,
//       };

//       if (data.access_token !== access_token) {
//         await SecureStore.setItemAsync("access_token", data.access_token);
//         setAccessToken(data.access_token);
//       }

//       if (JSON.stringify(userWithRole) !== JSON.stringify(user)) {
//         await SecureStore.setItemAsync("user", JSON.stringify(userWithRole));
//         setUser(userWithRole);
//       }

//       return { success: true };
//     } catch (err) {
//       console.error("Login failed:", err);
//       return { success: false, error: err.message };
//     }
//   };

//   const logout = async () => {
//     try {
//       await fetch(`${API}/logout`, {
//         method: "POST",
//         credentials: "include",
//       });
//     } catch (error) {
//       console.error("Logout API call failed:", error);
//     } finally {
//       await Promise.all([
//         SecureStore.deleteItemAsync("access_token").catch(() => {}),
//         SecureStore.deleteItemAsync("user").catch(() => {}),
//       ]);
//       setAccessToken(null);
//       setUser(null);

//       router.replace("/(auth)");  // for logout 
//     }
//   };

//   const attemptTokenRefresh = async () => {
//     try {
//       const response = await fetch(`${API}/user/refreshToken`, {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || "Refresh failed");

//       await SecureStore.setItemAsync("access_token", data.access_token);
//       setAccessToken(data.access_token);

//       return data.access_token;
//     } catch (err) {
//       console.error("Token refresh failed:", err);
//       await logout();
//       throw new Error("Session expired. Please login again.");
//     }
//   };

//   // ✅ Unified API call wrapper (replaces apiHelper)
//   const apiCall = async (url, options = {}) => {
//     try {
//       // First attempt
//       let response = await fetch(url, {
//         ...options,
//         headers: {
//           "Content-Type": "application/json",
//           ...options.headers,
//           Authorization: `Bearer ${access_token}`,
//         },
//         credentials: "include",
//       });

//       // If token expired → refresh and retry
//       if (response.status === 401) {
//         console.log("Access token expired, refreshing...");

//         try {
//           const newToken = await attemptTokenRefresh();
//           response = await fetch(url, {
//             ...options,
//             headers: {
//               "Content-Type": "application/json",
//               ...options.headers,
//               Authorization: `Bearer ${newToken}`,
//             },
//             credentials: "include",
//           });
//         } catch (refreshError) {
//           console.log("Refresh failed, logging out...");
//           await logout();
//           // router.replace("/index");
//           throw new Error("Session expired. Please login again.");
//         }
//       }

//       if (!response.ok) {
//         throw new Error(`API Error: ${response.status}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("API call failed:", error);
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
//     apiCall, // 👈 Use this everywhere instead of apiHelper
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();
console.log("🟢 AUTH CONTEXT - Loading");

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  console.log("🟢 AUTH PROVIDER - Mounting");
  const [access_token, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API = "https://streak-app-uxyv.onrender.com";

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

      console.log("✅ Login Response Status:", response.status);
      console.log("✅ Login Data:", JSON.stringify(data, null, 2));
      console.log("✅ User Object:", JSON.stringify(data.user, null, 2));
      console.log("✅ Access Token:", data.access_token ? "EXISTS" : "MISSING");


      // const userWithRole = {
      //   ...data.user,
      //   role: role,
      // };

      // if (data.access_token !== access_token) {
      //   await SecureStore.setItemAsync("access_token", data.access_token);
      //   setAccessToken(data.access_token);
      // }

      // if (JSON.stringify(data) !== JSON.stringify(user)) {
      //   await SecureStore.setItemAsync("user", JSON.stringify(data));
      //   setUser(data);
      // }
      const userWithRole = {
        ...data.user,  // Only spread the user object
        role: role,
      };

      console.log("✅ User with Role (clean):", JSON.stringify(userWithRole, null, 2));

      // Store access token
      await SecureStore.setItemAsync("access_token", data.access_token);
      setAccessToken(data.access_token);

      // Store only the user object
      await SecureStore.setItemAsync("user", JSON.stringify(userWithRole));
      setUser(userWithRole);

      return { success: true };
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      // Call the appropriate logout endpoint based on user role
      const logoutUrl = user?.role === "admin" ? "/admin/logout" : "/user/logout";
      await fetch(`${API}${logoutUrl}`, {
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

      router.replace("/(auth)");
    }
  };

  const attemptTokenRefresh = async () => {
    try {
      // ✅ FIXED: Use the correct refresh endpoint based on user role
      const refreshUrl = user?.role === "admin" 
        ? "/admin/refreshToken" 
        : "/user/refreshToken";
      
      console.log(`Refreshing token for ${user?.role} at ${refreshUrl}`);

      const response = await fetch(`${API}${refreshUrl}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Refresh token error:", data.error);
        throw new Error(data.error || "Refresh failed");
      }

      await SecureStore.setItemAsync("access_token", data.access_token);
      setAccessToken(data.access_token);

      console.log("Token refreshed successfully");
      return data.access_token;
    } catch (err) {
      console.error("Token refresh failed:", err);
      await logout();
      throw new Error("Session expired. Please login again.");
    }
  };

  // ✅ Unified API call wrapper (replaces apiHelper)
  const apiCall = async (url, options = {}) => {
    console.log("🔍 API Call to:", url);
    console.log("🔍 Current access_token:", access_token ? "EXISTS" : "MISSING");
    console.log("🔍 Current user:", user ? JSON.stringify(user, null, 2) : "MISSING");

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
          throw new Error("Session expired. Please login again.");
        }
      }

      console.log("Error occurs in api calling ");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.status}`);
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
    apiCall,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};