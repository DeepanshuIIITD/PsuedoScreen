// // claude version

// import Constants from "expo-constants";
// import { router } from "expo-router";
// import React from "react";
// import {
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const ResetPassword = () => {
//   const [mobile, setMobile] = React.useState("");
//   const [otp, setOtp] = React.useState("");
//   const [newPassword, setNewPassword] = React.useState("");
//   const [confirmPassword, setConfirmPassword] = React.useState("");
//   const [otpSent, setOtpSent] = React.useState(false);
//   const [isOtpLoading, setIsOtpLoading] = React.useState(false);
//   const [otpError, setOtpError] = React.useState('');
//   const [resendTimer, setResendTimer] = React.useState(0);
//   const [canResend, setCanResend] = React.useState(false);

//   const insets = useSafeAreaInsets();
//   const API = Constants.expoConfig?.extra?.API_URL || 'https://streak-app-production.up.railway.app';
//   const USE_MOCK = true; // Toggle mocked APIs

//   // Timer effect for resend functionality
//   React.useEffect(() => {
//     let interval;
//     if (resendTimer > 0) {
//       interval = setInterval(() => {
//         setResendTimer((prev) => {
//           if (prev <= 1) {
//             setCanResend(true);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [resendTimer]);

//   const handleGetOtp = async () => {
//     if (mobile.length < 10) {
//       alert("Enter a valid mobile number (10 digits minimum)");
//       return;
//     }

//     setIsOtpLoading(true);
//     setOtpError('');

//     try {
//       console.log('Sending OTP to mobile:', mobile);
//       if (USE_MOCK) {
//         const data = { success: true, delivery: 'sms' };
//         setOtpSent(true);
//         alert("OTP sent successfully! Check your WhatsApp/SMS.");
//         console.log('OTP sent successfully (mock):', data);
//         setResendTimer(120);
//         setCanResend(false);
//       } else {
//         const response = await fetch(`${API}/user/sendOTP`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ phone: mobile }),
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setOtpSent(true);
//           alert("OTP sent successfully! Check your WhatsApp/SMS.");
//           console.log('OTP sent successfully:', data);
//           setResendTimer(120);
//           setCanResend(false);
//         } else {
//           throw new Error(data.error || 'Failed to send OTP');
//         }
//       }
//     } catch (error) {
//       console.error('OTP sending error:', error);
//       setOtpError(error.message);
//       alert(`Failed to send OTP: ${error.message}`);
//     } finally {
//       setIsOtpLoading(false);
//     }
//   };

//   const handleResendOtp = async () => {
//     if (!canResend) return;
    
//     setCanResend(false);
//     setOtpError('');
//     setOtp('');
    
//     await handleGetOtp();
//   };

//   const handleResetPassword = async () => {
//     if (!mobile || !otp || !newPassword || !confirmPassword) {
//       alert("Please fill all fields");
//       return;
//     }
    
//     if (!otpSent) {
//       alert("Please request OTP first");
//       return;
//     }
    
//     if (newPassword !== confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }

//     if (newPassword.length < 6) {
//       alert("Password must be at least 6 characters long");
//       return;
//     }

//     try {
//       console.log('Verifying OTP...');
      
//       // Step 1: Verify OTP first
//       if (USE_MOCK) {
//         const otpVerifyData = { valid: otp === '123456' || otp?.length === 6 };
//         if (!otpVerifyData.valid) throw new Error('Invalid OTP');
//         console.log('OTP verified successfully (mock), proceeding with password reset...');
//       } else {
//         const otpVerifyResponse = await fetch(`${API}/user/verifyOTP`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ phone: mobile, otp: otp }),
//         });
//         const otpVerifyData = await otpVerifyResponse.json();
//         if (!otpVerifyResponse.ok) {
//           throw new Error(otpVerifyData.error || 'Invalid OTP');
//         }
//         console.log('OTP verified successfully, proceeding with password reset...');
//       }

//       // Step 2: Reset password after OTP verification
//       const resetData = {
//         phone: parseInt(mobile),
//         otp: parseInt(otp),
//         newPassword: newPassword,
//       };

//       if (USE_MOCK) {
//         const data = { message: 'Password reset successful' };
//         console.log('Password reset successful (mock):', data);
//         alert("Password reset successful! You can now login with your new password.");
//         router.replace("/(auth)");
//       } else {
//         const response = await fetch(`${API}/user/resetPassword`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(resetData)
//         });
        
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || `Server error: ${response.status}`);
//         }
        
//         const data = await response.json();
//         console.log('Password reset successful:', data);
//         alert("Password reset successful! You can now login with your new password.");
//         router.replace("/(auth)");
//       }
//     } catch (error) {
//       console.error('Password reset error:', error);
//       alert(`Password reset failed: ${error.message}`);
//     }
//   };

//   const isGetOtpDisabled = isOtpLoading || (otpSent && resendTimer > 0);

//   return (
//     <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
//       >
//         <ScrollView 
//           contentContainerStyle={styles.scrollContainer}
//           showsHorizontalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         >
//           <View style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//               <Text style={styles.headerTitle}>Reset Password</Text>
//               <Text style={styles.headerSubtitle}>
//                 Enter your mobile number to receive an OTP
//               </Text>
//             </View>

//             {/* Form Container */}
//             <View style={styles.formContainer}>
//               {/* Mobile and OTP section */}
//               <View style={styles.mobileSection}>
//                 <View style={styles.inputRow}>
//                   <TextInput
//                     style={[styles.inputStyle, styles.mobileInput]}
//                     onChangeText={(text) => setMobile(text)}
//                     value={mobile}
//                     placeholder="Mobile number"
//                     keyboardType="phone-pad"
//                     returnKeyType="done"
//                     editable={!otpSent}
//                     maxLength={10}
//                   />
//                   <Pressable 
//                     style={[
//                       styles.otpButton, 
//                       isGetOtpDisabled && styles.otpButtonDisabled
//                     ]} 
//                     onPress={handleGetOtp}
//                     disabled={isGetOtpDisabled}
//                   >
//                     <Text style={styles.otpButtonText}>
//                       {isOtpLoading ? "Sending..." : 
//                        otpSent && resendTimer > 0 ? `${Math.floor(resendTimer / 60)}:${(resendTimer % 60).toString().padStart(2, '0')}` : 
//                        "Get OTP"}
//                     </Text>
//                   </Pressable>
//                 </View>

//                 {/* OTP input shown only after request */}
//                 {otpSent && (
//                   <View style={styles.otpSection}>
//                     <TextInput
//                       style={styles.inputStyle}
//                       onChangeText={(text) => setOtp(text)}
//                       value={otp}
//                       placeholder="Enter OTP"
//                       keyboardType="number-pad"
//                       maxLength={6}
//                       returnKeyType="next"
//                     />
                    
//                     {/* Password inputs */}
//                     <TextInput
//                       style={styles.inputStyle}
//                       onChangeText={(text) => setNewPassword(text)}
//                       value={newPassword}
//                       placeholder="New Password"
//                       secureTextEntry
//                       returnKeyType="next"
//                     />

//                     <TextInput
//                       style={styles.inputStyle}
//                       onChangeText={(text) => setConfirmPassword(text)}
//                       value={confirmPassword}
//                       placeholder="Confirm New Password"
//                       secureTextEntry
//                       returnKeyType="done"
//                     />
                    
//                     {/* Resend button - only show when timer is 0 */}
//                     {resendTimer === 0 && (
//                       <Pressable 
//                         style={[styles.resendButton, !canResend && styles.resendButtonDisabled]}
//                         onPress={handleResendOtp}
//                         disabled={!canResend}
//                       >
//                         <Text style={styles.resendButtonText}>Resend OTP</Text>
//                       </Pressable>
//                     )}
                    
//                     {otpError ? (
//                       <Text style={styles.errorText}>{otpError}</Text>
//                     ) : null}
//                   </View>
//                 )}
//               </View>
//             </View>

//             {/* Reset Password Button */}
//             {otpSent && (
//               <Pressable style={styles.submitButton} onPress={handleResetPassword}>
//                 <Text style={styles.submitText}>Reset Password</Text>
//               </Pressable>
//             )}

//             {/* Back to Login */}
//             <Pressable onPress={() => router.back()}>
//               <Text style={styles.backLink}>Back to Login</Text>
//             </Pressable>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// export default ResetPassword;

// const styles = StyleSheet.create({
//   safeContainer: {
//     flex: 1,
//     backgroundColor: "#f9f9f9",
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     paddingHorizontal: 20,
//     paddingBottom: 40,
//   },
//   container: {
//     flex: 1,
//     alignItems: "center",
//     paddingTop: 40,
//   },
//   header: {
//     width: "100%",
//     marginBottom: 30,
//     alignItems: "center",
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#0c0a0a",
//     marginBottom: 8,
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: "#6b7280",
//     textAlign: "center",
//   },
//   formContainer: {
//     width: "100%",
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 20,
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   mobileSection: {
//     marginTop: 5,
//   },
//   inputRow: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     marginBottom: 0,
//   },
//   mobileInput: {
//     flex: 1,
//     marginRight: 10,
//     marginBottom: 0,
//   },
//   inputStyle: {
//     backgroundColor: "#f8f8f8",
//     height: 48,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     fontSize: 16,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//   },
//   otpButton: {
//     backgroundColor: "#17e95d",
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     minWidth: 80,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   otpButtonDisabled: {
//     backgroundColor: "#a5a5a5",
//   },
//   otpButtonText: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "600",
//     textAlign: "center",
//   },
//   otpSection: {
//     marginTop: 15,
//   },
//   resendButton: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 6,
//     alignSelf: 'center',
//     marginTop: 10,
//   },
//   resendButtonDisabled: {
//     backgroundColor: '#a5a5a5',
//   },
//   resendButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   errorText: {
//     color: "#ff4444",
//     fontSize: 12,
//     marginTop: 5,
//     textAlign: 'center',
//   },
//   submitButton: {
//     backgroundColor: "#17e95d",
//     paddingVertical: 15,
//     paddingHorizontal: 60,
//     borderRadius: 8,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   submitText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   backLink: {
//     color: '#007AFF',
//     fontSize: 16,
//     fontWeight: '500',
//     textDecorationLine: 'underline',
//   },
// });



// verfiy otp

// Updated forgotPassword.jsx with OTP verification button

import Constants from "expo-constants";
import { router } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ResetPassword = () => {
  const [mobile, setMobile] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);
  const [otpVerified, setOtpVerified] = React.useState(false);
  const [isOtpLoading, setIsOtpLoading] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [otpError, setOtpError] = React.useState('');
  const [resendTimer, setResendTimer] = React.useState(0);
  const [canResend, setCanResend] = React.useState(false);

  const insets = useSafeAreaInsets();
  const API = Constants.expoConfig?.extra?.API_URL;

  // Timer effect for resend functionality
  React.useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleGetOtp = async () => {
    if (mobile.length < 10) {
      alert("Enter a valid mobile number (10 digits minimum)");
      return;
    }

    setIsOtpLoading(true);
    setOtpError('');
    setOtpVerified(false); // Reset verification status

    try {
      console.log('Sending OTP to mobile:', mobile);
      const response = await fetch(`${API}/user/sendOTP`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: mobile }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setOtpSent(true);
        alert("OTP sent successfully! Check your WhatsApp/SMS.");
        console.log('OTP sent successfully:', data);
        setResendTimer(120);
        setCanResend(false);
      } else {
        throw new Error(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('OTP sending error:', error);
      setOtpError(error.message);
      alert(`Failed to send OTP: ${error.message}`);
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    setOtpError('');

    try {
      console.log('Verifying OTP...');
      const otpVerifyResponse = await fetch(`${API}/user/verifyOTP`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: mobile, otp: otp }),
      });
      const otpVerifyData = await otpVerifyResponse.json();
      
      if (!otpVerifyResponse.ok) {
        throw new Error(otpVerifyData.error || 'Invalid OTP');
      }
      
      console.log('OTP verified successfully');
      setOtpVerified(true);
      alert("OTP verified successfully! You can now reset your password.");
    } catch (error) {
      console.error('OTP verification error:', error);
      setOtpError(error.message);
      alert(`OTP verification failed: ${error.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setOtpError('');
    setOtp('');
    setOtpVerified(false); // Reset verification when resending
    
    await handleGetOtp();
  };

  const handleResetPassword = async () => {
    if (!mobile || !otp || !newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }
    
    if (!otpSent) {
      alert("Please request OTP first");
      return;
    }
    
    if (!otpVerified) {
      alert("Please verify your OTP before resetting password");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      console.log('Proceeding with password reset...');

      const resetData = {
        phone: parseInt(mobile),
        otp: parseInt(otp),
        newPassword: newPassword,
      };

      const response = await fetch(`${API}/user/resetPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resetData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Password reset successful:', data);
      alert("Password reset successful! You can now login with your new password.");
      router.replace("/(auth)");
    } catch (error) {
      console.error('Password reset error:', error);
      alert(`Password reset failed: ${error.message}`);
    }
  };

  const isGetOtpDisabled = isOtpLoading || (otpSent && resendTimer > 0);

  return (
    <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Reset Password</Text>
              <Text style={styles.headerSubtitle}>
                Enter your mobile number to receive an OTP
              </Text>
            </View>

            {/* Form Container */}
            <View style={styles.formContainer}>
              {/* Mobile and OTP section */}
              <View style={styles.mobileSection}>
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.inputStyle, styles.mobileInput]}
                    onChangeText={(text) => setMobile(text)}
                    value={mobile}
                    placeholder="Mobile number"
                    keyboardType="phone-pad"
                    returnKeyType="done"
                    editable={!otpVerified}
                    maxLength={10}
                  />
                  <Pressable 
                    style={[
                      styles.otpButton, 
                      (isGetOtpDisabled || otpVerified) && styles.otpButtonDisabled
                    ]} 
                    onPress={handleGetOtp}
                    disabled={isGetOtpDisabled || otpVerified}
                  >
                    <Text style={styles.otpButtonText}>
                      {isOtpLoading ? "Sending..." : 
                       otpVerified ? "Verified" :
                       otpSent && resendTimer > 0 ? `${Math.floor(resendTimer / 60)}:${(resendTimer % 60).toString().padStart(2, '0')}` : 
                       "Get OTP"}
                    </Text>
                  </Pressable>
                </View>

                {/* OTP input shown only after request */}
                {otpSent && !otpVerified && (
                  <View style={styles.otpSection}>
                    <TextInput
                      style={styles.inputStyle}
                      onChangeText={(text) => setOtp(text)}
                      value={otp}
                      placeholder="Enter OTP"
                      keyboardType="number-pad"
                      maxLength={6}
                      returnKeyType="next"
                    />
                    
                    {/* Verify OTP Button */}
                    <Pressable
                      style={[styles.verifyButton, isVerifying && styles.verifyButtonDisabled]}
                      onPress={handleVerifyOtp}
                      disabled={isVerifying || !otp || otp.length !== 6}
                    >
                      <Text style={styles.verifyButtonText}>
                        {isVerifying ? "Verifying..." : "Verify OTP"}
                      </Text>
                    </Pressable>
                    
                    {/* Resend button - only show when timer is 0 */}
                    {resendTimer === 0 && (
                      <Pressable 
                        style={[styles.resendButton, !canResend && styles.resendButtonDisabled]}
                        onPress={handleResendOtp}
                        disabled={!canResend}
                      >
                        <Text style={styles.resendButtonText}>Resend OTP</Text>
                      </Pressable>
                    )}
                    
                    {otpError ? (
                      <Text style={styles.errorText}>{otpError}</Text>
                    ) : null}
                  </View>
                )}

                {/* OTP Verified - Show Password Fields */}
                {otpVerified && (
                  <View style={styles.passwordSection}>
                    <View style={styles.verifiedContainer}>
                      <Text style={styles.verifiedText}>✓ OTP Verified Successfully</Text>
                    </View>

                    <TextInput
                      style={styles.inputStyle}
                      onChangeText={(text) => setNewPassword(text)}
                      value={newPassword}
                      placeholder="New Password"
                      secureTextEntry
                      returnKeyType="next"
                    />

                    <TextInput
                      style={styles.inputStyle}
                      onChangeText={(text) => setConfirmPassword(text)}
                      value={confirmPassword}
                      placeholder="Confirm New Password"
                      secureTextEntry
                      returnKeyType="done"
                    />
                  </View>
                )}
              </View>
            </View>

            {/* Reset Password Button - Only show when OTP is verified */}
            {otpVerified && (
              <Pressable 
                style={styles.submitButton} 
                onPress={handleResetPassword}
              >
                <Text style={styles.submitText}>Reset Password</Text>
              </Pressable>
            )}

            {/* Back to Login */}
            <Pressable onPress={() => router.back()}>
              <Text style={styles.backLink}>Back to Login</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
  },
  header: {
    width: "100%",
    marginBottom: 30,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0c0a0a",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mobileSection: {
    marginTop: 5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 0,
  },
  mobileInput: {
    flex: 1,
    marginRight: 10,
    marginBottom: 0,
  },
  inputStyle: {
    backgroundColor: "#f8f8f8",
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  otpButton: {
    backgroundColor: "#17e95d",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  otpButtonDisabled: {
    backgroundColor: "#a5a5a5",
  },
  otpButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  otpSection: {
    marginTop: 15,
  },
  passwordSection: {
    marginTop: 15,
  },
  verifyButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  verifyButtonDisabled: {
    backgroundColor: "#a5a5a5",
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resendButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 5,
  },
  resendButtonDisabled: {
    backgroundColor: '#a5a5a5',
  },
  resendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  verifiedContainer: {
    backgroundColor: '#d1fae5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  verifiedText: {
    color: '#065f46',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: "#17e95d",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  backLink: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});