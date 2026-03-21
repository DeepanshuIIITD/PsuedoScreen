import Constants from "expo-constants";
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
  const [refresh_token, setRefreshToken] = useState(null); // newly added
  const [isLoading, setIsLoading] = useState(true);
  // const API = 'https://streak-app-production.up.railway.app';
  const API = Constants.expoConfig.extra.API_URL;


  // Load stored auth data at startup
  useEffect(() => {
    loadStoredAuth();
    // logout();       // force logout
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedAccessToken, storedRefreshToken, storedUserData] = await Promise.all([
        SecureStore.getItemAsync("access_token"),
        SecureStore.getItemAsync("refresh_token"),
        SecureStore.getItemAsync("user"),
      ]);

      if (storedAccessToken && storedUserData) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken || null);
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
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");

      const userWithRole = { ...data.user, role };
      await SecureStore.setItemAsync("access_token", data.access_token);
      if (data.refresh_token) {       // newly added
        await SecureStore.setItemAsync("refresh_token", data.refresh_token); // <-- ADD THIS
      }
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token || null); // <-- newly added
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
        const logoutUrl = user?.role === "admin" ? "/admin/logOutAdmin/" : "/user/logOutUser";
        await fetch(`${API}${logoutUrl}`, { method: "POST", credentials: "include" });
    }
    catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      await Promise.all([
        SecureStore.deleteItemAsync("access_token").catch(() => {}),
        SecureStore.deleteItemAsync("refresh_token").catch(() => {}), // <-- newly added
        SecureStore.deleteItemAsync("user").catch(() => {}),
      ]);
      setAccessToken(null);
      setRefreshToken(null); // <-- newly added
      setUser(null);
      router.replace("/(auth)");
    }
  };

  const attemptTokenRefresh = async () => {
    try {
      const refreshUrl = user?.role === "admin" ? "/admin/refreshToken" : "/user/refreshToken";
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
      if (data.refresh_token) {
        await SecureStore.setItemAsync("refresh_token", data.refresh_token); // <-- ADD THIS
      }
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token || refresh_token); // <-- newly added
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
    // console.log("Access token is ", access_token);

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

      if (!response.ok) {
        console.log("Error in api response, Response looks like ", response);
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.message}`);
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
    refresh_token,
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
