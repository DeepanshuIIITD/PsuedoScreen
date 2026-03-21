// Universal error reporter: sends error context/details to backend for debugging
import Constants from 'expo-constants';

// API URL configured in app.json/expo config
const API_URL = Constants?.expoConfig?.extra?.API_URL;

/**
 * Report an error to the backend for centralized logging.
 * This is best-effort and should not crash the app if the backend is unreachable.
 * @param {Error} error
 * @param {string} context - a human-friendly context (e.g., 'Login', 'Fetch Classes')
 * @param {Object} extra - additional metadata to include
 */
export const reportError =  (error, context = 'Application', extra = {}) => {
  if (!API_URL) return;
  try {
    const payload = {
      timestamp: new Date().toISOString(),
      context,
      message: error?.message ?? String(error),
      name: error?.name,
      stack: error?.stack,
      ...extra,
    };
    fetch(`${API_URL}/log/error`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
  } catch (e) {
    // Silently swallow to avoid affecting UX in case the logger fails
    // Optional: could console.error here in dev builds
    console.error("Error reporting failed:", e.message);
  }
};

export default reportError;
