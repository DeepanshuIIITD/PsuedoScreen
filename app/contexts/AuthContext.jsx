import { API } from "@env";
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

  // const API = "https://streak-app-uxyv.onrender.com";
  const USE_MOCK = false; // Toggle to switch between mocked and real API

  // Load stored auth data at startup
  useEffect(() => {
    loadStoredAuth();
    logout();       // force logout
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
      if (USE_MOCK) {
        // Expected backend API (commented)
        // Request: POST `${API}${role === 'admin' ? '/admin/signIn' : '/user/signIn'}`
        // Body:
        // {
        //   "userName": string,
        //   "password": string
        // }
        // Response 200:
        // {
        //   "access_token": string,
        //   "user": {
        //     "id": string,
        //     "username": string,
        //     "firstName": string,
        //     "lastName": string,
        //     "email": string
        //   }
        // }
        // Response 401/400:
        // { "error": string }

        // const mockData = {
        //   access_token: `mock_access_token_${role}_${username}`,
        //   user: {
        //     id: "u_123",
        //     username,
        //     firstName: "Demo",
        //     lastName: role === "admin" ? "Admin" : "User",
        //     email: `${username || 'demo'}@example.com`,
        //   },
        // };

        const userWithRole = { ...mockData.user, role };

        await SecureStore.setItemAsync("access_token", mockData.access_token);
        setAccessToken(mockData.access_token);
        await SecureStore.setItemAsync("user", JSON.stringify(userWithRole));
        setUser(userWithRole);
        return { success: true };
      }

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
      setAccessToken(data.access_token);
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
      if (!USE_MOCK) {
        // Expected backend API (commented)
        // Request: POST `${API}${user?.role === 'admin' ? '/admin/logout' : '/user/logout'}`
        // Headers/Cookies: includes refresh token cookie
        const logoutUrl = user?.role === "admin" ? "/admin/logout" : "/user/logout";
        await fetch(`${API}${logoutUrl}`, { method: "POST", credentials: "include" });
      }
    }

    catch (error) {
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
      if (USE_MOCK) {
        // Expected backend API (commented)
        // Request: POST `${API}${user?.role === 'admin' ? '/admin/refreshToken' : '/user/refreshToken'}`
        // Cookie: refresh_token (HttpOnly)
        // Response 200:
        // { "access_token": string }
        const newToken = `mock_refreshed_token_${user?.role || 'user'}`;
        await SecureStore.setItemAsync("access_token", newToken);
        setAccessToken(newToken);
        return newToken;
      }

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
    console.log("🔍 API Call to:", url);
    // console.log("🔍 Current access_token:", access_token ? "EXISTS" : "MISSING");
    // console.log("🔍 Current user:", user ? JSON.stringify(user, null, 2) : "MISSING");

    try {
      if (USE_MOCK) {
        // Minimal mock router for app demo
        // Documenting expected shapes per endpoint (examples):
        // - GET `${API}/root/health-check` -> { "status": "ok", "uptime": number }
        // - GET `${API}/user/streak` -> { "streak": number, "lastCheckIn": ISOString }
        // - POST `${API}/user/checkin` -> { "success": true, "streak": number }
        const now = new Date().toISOString();
        if (url.includes('/root/health-check')) {
          return { status: 'ok', uptime: 12345 };
        }
        if (url.includes('/user/streak')) {
          return { streak: 7, lastCheckIn: now };
        }
        if (url.includes('/user/checkin')) {
          return { success: true, streak: 8 };
        }
        // Default mock
        return { ok: true };
      }

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

      
      // console.log("AUTH CONTEXT FILE - Error occurs in api calling ");
      // console.log("user id - ",user.id, " Type of user_id is ", typeof(user.id));
      // console.log("Type of user_id is ", )
      // console.log("Full Response ", response);
      if (!response.ok) {
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