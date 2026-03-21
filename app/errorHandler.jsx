// utils/errorHandler.js

/**
 * Centralized error handler that logs detailed errors to console
 * but shows user-friendly messages to the user
 */

import { Alert } from 'react-native';
import reportError from './utils/errorReporter';

/**
 * Error types for better categorization
 */
export const ErrorTypes = {
    NETWORK: 'NETWORK',
    API: 'API',
    AUTH: 'AUTH',
    VALIDATION: 'VALIDATION',
    UNKNOWN: 'UNKNOWN',
};

/**
 * User-friendly error messages
 */
const USER_FRIENDLY_MESSAGES = {
    [ErrorTypes.NETWORK]: 'Unable to connect to the server. Please check your internet connection and try again.',
    [ErrorTypes.API]: 'Oops! Something went wrong. Please try again later.',
    [ErrorTypes.AUTH]: 'Your session has expired. Please log in again.',
    [ErrorTypes.VALIDATION]: 'Please check your input and try again.',
    [ErrorTypes.UNKNOWN]: 'Oops! Something went wrong. Please try again later.',
};

/**
 * Determine error type based on error object
 */
const determineErrorType = (error) => {
    if (error.message?.toLowerCase().includes('network')) {
        return ErrorTypes.NETWORK;
    }
    if (error.message?.toLowerCase().includes('fetch')) {
        return ErrorTypes.NETWORK;
    }
    if (error.message?.toLowerCase().includes('session') || 
        error.message?.toLowerCase().includes('token') ||
        error.message?.toLowerCase().includes('unauthorized')) {
        return ErrorTypes.AUTH;
    }
    if (error.message?.toLowerCase().includes('validation') ||
        error.message?.toLowerCase().includes('invalid')) {
        return ErrorTypes.VALIDATION;
    }
    if (error.status >= 400 && error.status < 500) {
        return ErrorTypes.API;
    }
    return ErrorTypes.UNKNOWN;
};

/**
 * Main error handler function
 * @param {Error} error - The error object
 * @param {string} context - Where the error occurred (e.g., 'Login', 'Fetch Classes')
 * @param {Object} options - Additional options
 * @param {boolean} options.showAlert - Whether to show an alert to the user (default: true)
 * @param {string} options.customMessage - Custom user-facing message
 * @param {Function} options.onError - Callback function after error is handled
 */
export const handleError = (error, context = 'Application', options = {}) => {
    const {
        showAlert = true,
        customMessage = null,
        onError = null,
    } = options;

  // Log detailed error information to console
    console.group(`❌ ERROR in ${context}`);
    console.error('Timestamp:', new Date().toISOString());
    console.error('Error Type:', error.constructor.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    
    if (error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Data:', error.response.data);
    }
    
    if (error.config) {
        console.error('Request URL:', error.config.url);
        console.error('Request Method:', error.config.method);
    }
    
    console.groupEnd();

  // Determine error type and get user-friendly message
  const errorType = determineErrorType(error);
  const userMessage = customMessage || USER_FRIENDLY_MESSAGES[errorType];

  // Show alert to user if enabled
  if (showAlert) {
        Alert.alert(
        'Error',
        userMessage,
        [{ text: 'OK', style: 'cancel' }]
        );
    }

  // Send error details to backend for centralized logging (best-effort)
  try {
    // Attach extra context if available
    reportError(error, context, { errorType, userMessage });
  } catch (e) {
    // Swallow errors from logging to avoid breaking UX
  }

  // Execute callback if provided
  if (onError && typeof onError === 'function') {
    onError(error, errorType);
  }

    return {
        errorType,
        userMessage,
        originalError: error,
    };
    };

/**
 * Wrapper for async functions to handle errors automatically
 * @param {Function} asyncFn - The async function to wrap
 * @param {string} context - Context for error logging
 * @param {Object} errorOptions - Options for error handling
 */
export const withErrorHandling = (asyncFn, context, errorOptions = {}) => {
    return async (...args) => {
        try {
        return await asyncFn(...args);
        } catch (error) {
        handleError(error, context, errorOptions);
        throw error; // Re-throw if you want calling code to handle it too
        }
    };
};

/**
 * Try-catch wrapper with error handling
 * Usage: const result = await tryCatch(() => someAsyncFunction(), 'Context Name');
 */
export const tryCatch = async (fn, context, errorOptions = {}) => {
    try {
        return await fn();
    } catch (error) {
        return handleError(error, context, errorOptions);
    }
    };

/**
 * Global error boundary handler for React
 */
export const logErrorToService = (error, errorInfo) => {
    console.group('🔴 REACT ERROR BOUNDARY');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();
    
  // Here you could send to error tracking service like Sentry
  // Sentry.captureException(error);
};

export default handleError;
