// utils/apiHelper.js - Create this new file
import { router } from 'expo-router';

export const apiCall = async (url, options = {}, authContext) => {
  const { access_token, attemptTokenRefresh, logout } = authContext;

  try {
    // First attempt with current token
    let response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        'Authorization': `Bearer ${access_token}`,
      },
    });

    // If token expired (401), try to refresh
    if (response.status === 401) {
      console.log('Token expired, refreshing...');
      
      try {
        // Try to refresh the token
        await attemptTokenRefresh();
        
        // Retry the original request with new token
        response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
            'Authorization': `Bearer ${access_token}`,
          },
        });
        
        
      } catch (refreshError) {
        // Refresh failed - force logout and redirect to login
        console.log('Refresh failed, logging out...');
        await logout();
        router.replace('/index'); // Replace with your login route
        throw new Error('Session expired. Please login again.');
      }
    }

    // Check if request was successful
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};