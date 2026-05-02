// //   // const API = 'https://streak-app-production.up.railway.app';

  
// // import { useAuth } from '@/app/contexts/AuthContext';
// // import { MaterialCommunityIcons } from '@expo/vector-icons';
// // import Constants from 'expo-constants';
// // import { router } from 'expo-router';
// // import React, { useState } from 'react';
// // import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// // import { useSafeAreaInsets } from 'react-native-safe-area-context';


// // const EditProfile = () => {
// //   const { user, apiCall } = useAuth();
// //   const insets = useSafeAreaInsets();
// //   const API = Constants.expoConfig.extra.API_URL;
// //   const [firstName, setFirstName] = useState(user?.firstName || '');
// //   const [lastName, setLastName] = useState(user?.lastName || '');
// //   const [email, setEmail] = useState(user?.email || '');
// //   const [phone, setPhone] = useState(user?.phone || '');
// //   const [isSaving, setIsSaving] = useState(false);

// //   const handleSave = async () => {
// //     if (!firstName.trim() || !lastName.trim() || !email.trim()) {
// //       Alert.alert("Error", "Please fill in all required fields");
// //       return;
// //     }

// //     setIsSaving(true);
// //     try {
// //       await apiCall(`${API}/user/profile/${user.id}`, {
// //         method: 'Patch',
// //         body: JSON.stringify({ firstName, lastName, email })
// //       });
// //       Alert.alert("Success", "Profile updated successfully!", [ { text: "OK", onPress: () => router.back() } ]);
      
// //     } catch (e) {
// //       Alert.alert("Error", e.message || 'Failed to update profile');
// //     } finally {
// //       setIsSaving(false);
// //     }
// //   };

// //   return (
// //     <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
// //           <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>Edit Profile</Text>
// //         <View style={styles.placeholder} />
// //       </View>

// //       <ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer}>
// //         {/* Profile Picture Section */}
// //         <View style={styles.profilePictureSection}>
// //           <View style={styles.profilePictureContainer}>
// //             {/* TODO: Replace with actual image when backend supports profile pictures */}
// //             {/* {profileImage ? (
// //               <Image source={{ uri: profileImage }} style={styles.profileImage} />
// //             ) : ( */}
// //               <View style={styles.profileImagePlaceholder}>
// //                 <MaterialCommunityIcons name="account-circle" size={80} color="#9ca3af" />
// //               </View>
// //             {/* )} */}
// //             <TouchableOpacity 
// //               style={styles.cameraButton}
// //               onPress={() => {
// //                 // TODO: Implement image picker when backend is ready
// //                 Alert.alert("Coming Soon", "Profile picture upload will be available soon");
// //               }}
// //             >
// //               <MaterialCommunityIcons name="camera" size={20} color="#fff" />
// //             </TouchableOpacity>
// //           </View>
// //           <TouchableOpacity 
// //             style={styles.changePictureButton}
// //             onPress={() => {
// //               // TODO: Implement image picker when backend is ready
// //               Alert.alert("Coming Soon", "Profile picture upload will be available soon");
// //             }}
// //           >
// //             <Text style={styles.changePictureText}>Change Picture</Text>
// //           </TouchableOpacity>
// //           <Text style={styles.pictureHint}>
// //             Tap to upload a profile picture (feature coming soon)
// //           </Text>
// //         </View>

// //         {/* Form Fields */}
// //         <View style={styles.card}>
// //           <Text style={styles.sectionTitle}>Personal Information</Text>
          
// //           <View style={styles.inputGroup}>
// //             <Text style={styles.label}>First Name *</Text>
// //             <TextInput
// //               style={styles.input}
// //               value={firstName}
// //               onChangeText={setFirstName}
// //               placeholder="Enter first name"
// //               placeholderTextColor="#9ca3af"
// //             />
// //           </View>

// //           <View style={styles.inputGroup}>
// //             <Text style={styles.label}>Last Name *</Text>
// //             <TextInput
// //               style={styles.input}
// //               value={lastName}
// //               onChangeText={setLastName}
// //               placeholder="Enter last name"
// //               placeholderTextColor="#9ca3af"
// //             />
// //           </View>

// //           <View style={styles.inputGroup}>
// //             <Text style={styles.label}>Email</Text>
// //             <TextInput
// //               style={styles.input}
// //               value={email}
// //               onChangeText={setEmail}
// //               placeholder="Enter email"
// //               placeholderTextColor="#9ca3af"
// //               keyboardType="email-address"
// //               autoCapitalize="none"
// //             />
// //           </View>

// //           <View style={styles.inputGroup}>
// //             <Text style={styles.label}>Phone</Text>
// //             <TextInput
// //               style={styles.input}
// //               value={phone}
// //               // onChangeText={setPhone}
// //               editable={false} // Phone editing disabled for now
// //               placeholder="Enter phone number"
// //               placeholderTextColor="#9ca3af"
// //               // keyboardType="phone-pad"
// //             />
// //           </View>
// //         </View>

// //         {/* Save Button */}
// //         <TouchableOpacity
// //           style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
// //           onPress={handleSave}
// //           disabled={isSaving}
// //         >
// //           <Text style={styles.saveButtonText}>
// //             {isSaving ? "Saving..." : "Save Changes"}
// //           </Text>
// //         </TouchableOpacity>
// //       </ScrollView>
// //     </View>
// //   );
// // };

// // export default EditProfile;

// // const styles = StyleSheet.create({
// //   safeContainer: {
// //     flex: 1,
// //     backgroundColor: "f9fafb",
// //   },
// //   header: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     padding: 16,
// //     backgroundColor: "#fff",
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#e5e7eb",
// //   },
// //   backButton: {
// //     padding: 8,
// //   },
// //   headerTitle: {
// //     fontSize: 20,
// //     fontWeight: "600",
// //     color: "#111827",
// //   },
// //   placeholder: {
// //     width: 40,
// //   },
// //   screen: {
// //     flex: 1,
// //     backgroundColor: "#f9fafb",
// //   },
// //   contentContainer: {
// //     padding: 16,
// //     paddingBottom: 40,
// //   },
// //   profilePictureSection: {
// //     alignItems: "center",
// //     marginBottom: 24,
// //   },
// //   profilePictureContainer: {
// //     position: "relative",
// //     marginBottom: 12,
// //   },
// //   profileImagePlaceholder: {
// //     width: 120,
// //     height: 120,
// //     borderRadius: 60,
// //     backgroundColor: "#f3f4f6",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 3,
// //     borderColor: "#e5e7eb",
// //   },
// //   profileImage: {
// //     width: 120,
// //     height: 120,
// //     borderRadius: 60,
// //     borderWidth: 3,
// //     borderColor: "#e5e7eb",
// //   },
// //   cameraButton: {
// //     position: "absolute",
// //     bottom: 0,
// //     right: 0,
// //     backgroundColor: "#2563eb",
// //     width: 36,
// //     height: 36,
// //     borderRadius: 18,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 3,
// //     borderColor: "#fff",
// //     shadowColor: "#000",
// //     shadowOpacity: 0.2,
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowRadius: 4,
// //     elevation: 5,
// //   },
// //   changePictureButton: {
// //     paddingVertical: 8,
// //     paddingHorizontal: 16,
// //     borderRadius: 8,
// //     backgroundColor: "#e0f2fe",
// //     marginBottom: 8,
// //   },
// //   changePictureText: {
// //     color: "#0284c7",
// //     fontWeight: "600",
// //     fontSize: 14,
// //   },
// //   pictureHint: {
// //     fontSize: 12,
// //     color: "#6b7280",
// //     textAlign: "center",
// //     fontStyle: "italic",
// //   },
// //   card: {
// //     backgroundColor: "white",
// //     borderRadius: 16,
// //     padding: 20,
// //     marginBottom: 20,
// //     shadowColor: "#000",
// //     shadowOpacity: 0.08,
// //     shadowOffset: { width: 0, height: 3 },
// //     shadowRadius: 6,
// //     elevation: 3,
// //   },
// //   sectionTitle: {
// //     fontSize: 18,
// //     fontWeight: "600",
// //     color: "#1f2937",
// //     marginBottom: 20,
// //   },
// //   inputGroup: {
// //     marginBottom: 20,
// //   },
// //   label: {
// //     fontSize: 14,
// //     fontWeight: "500",
// //     color: "#374151",
// //     marginBottom: 8,
// //   },
// //   input: {
// //     backgroundColor: "#f9fafb",
// //     borderWidth: 1,
// //     borderColor: "#d1d5db",
// //     borderRadius: 8,
// //     padding: 12,
// //     fontSize: 16,
// //     color: "#111827",
// //   },
// //   saveButton: {
// //     backgroundColor: "#2563eb",
// //     paddingVertical: 16,
// //     borderRadius: 12,
// //     alignItems: "center",
// //     marginTop: 10,
// //   },
// //   saveButtonDisabled: {
// //     backgroundColor: "#9ca3af",
// //   },
// //   saveButtonText: {
// //     color: "#fff",
// //     fontSize: 16,
// //     fontWeight: "600",
// //   },
// // });



// import { useAuth } from '@/app/contexts/AuthContext';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import Constants from 'expo-constants';
// import { router } from 'expo-router';
// import React, { useState } from 'react';
// import {
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// const EditProfile = () => {
//   const { user, apiCall } = useAuth();
//   const insets = useSafeAreaInsets();
//   const API = Constants.expoConfig.extra.API_URL;
//   const [firstName, setFirstName] = useState(user?.firstName || '');
//   const [lastName, setLastName] = useState(user?.lastName || '');
//   const [email, setEmail] = useState(user?.email || '');
//   const [phone, setPhone] = useState(user?.phone || '');
//   const [isSaving, setIsSaving] = useState(false);

//   const handleSave = async () => {
//     if (!firstName.trim() || !lastName.trim() || !email.trim()) {
//       Alert.alert("Error", "Please fill in all required fields");
//       return;
//     }

//     setIsSaving(true);
//     try {
//       await apiCall(`${API}/user/profile/${user.id}`, {
//         method: 'PATCH',
//         body: JSON.stringify({ firstName, lastName, email })
//       });
//       Alert.alert("Success", "Profile updated successfully!", [ 
//         { text: "OK", onPress: () => router.back() } 
//       ]);
//     } catch (e) {
//       Alert.alert("Error", e.message || 'Failed to update profile');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Edit Profile</Text>
//         <View style={styles.placeholder} />
//       </View>

//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
//       >
//         <ScrollView 
//           style={styles.screen} 
//           contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 24 }]}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Profile Picture Section */}
//           <View style={styles.profilePictureSection}>
//             <View style={styles.profilePictureContainer}>
//               <View style={styles.profileImagePlaceholder}>
//                 <MaterialCommunityIcons name="account-circle" size={80} color="#9ca3af" />
//               </View>
//               <TouchableOpacity 
//                 style={styles.cameraButton}
//                 onPress={() => {
//                   Alert.alert("Coming Soon", "Profile picture upload will be available soon");
//                 }}
//               >
//                 <MaterialCommunityIcons name="camera" size={20} color="#fff" />
//               </TouchableOpacity>
//             </View>
//             <TouchableOpacity 
//               style={styles.changePictureButton}
//               onPress={() => {
//                 Alert.alert("Coming Soon", "Profile picture upload will be available soon");
//               }}
//             >
//               <Text style={styles.changePictureText}>Change Picture</Text>
//             </TouchableOpacity>
//             <Text style={styles.pictureHint}>
//               Tap to upload a profile picture (feature coming soon)
//             </Text>
//           </View>

//           {/* Form Fields */}
//           <View style={styles.card}>
//             <Text style={styles.sectionTitle}>Personal Information</Text>
            
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>First Name *</Text>
//               <TextInput
//                 style={styles.input}
//                 value={firstName}
//                 onChangeText={setFirstName}
//                 placeholder="Enter first name"
//                 placeholderTextColor="#9ca3af"
//                 returnKeyType="next"
//               />
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Last Name *</Text>
//               <TextInput
//                 style={styles.input}
//                 value={lastName}
//                 onChangeText={setLastName}
//                 placeholder="Enter last name"
//                 placeholderTextColor="#9ca3af"
//                 returnKeyType="next"
//               />
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Email *</Text>
//               <TextInput
//                 style={styles.input}
//                 value={email}
//                 onChangeText={setEmail}
//                 placeholder="Enter email"
//                 placeholderTextColor="#9ca3af"
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 returnKeyType="done"
//               />
//             </View>

//             <View style={styles.inputGroup}>
//               <View style={styles.labelRow}>
//                 <Text style={styles.label}>Phone</Text>
//                 <View style={styles.lockedBadge}>
//                   <MaterialCommunityIcons name="lock" size={12} color="#ef4444" />
//                   <Text style={styles.lockedText}>Cannot be edited</Text>
//                 </View>
//               </View>
//               <View style={[styles.input, styles.inputDisabled]}>
//                 <Text style={styles.disabledText}>{phone || 'No phone number'}</Text>
//               </View>
//             </View>
//           </View>

//           {/* Save Button */}
//           <TouchableOpacity
//             style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
//             onPress={handleSave}
//             disabled={isSaving}
//           >
//             <Text style={styles.saveButtonText}>
//               {isSaving ? "Saving..." : "Save Changes"}
//             </Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// export default EditProfile;

// const styles = StyleSheet.create({
//   safeContainer: {
//     flex: 1,
//     backgroundColor: "#f9fafb",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: 16,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e5e7eb",
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   placeholder: {
//     width: 40,
//   },
//   screen: {
//     flex: 1,
//     backgroundColor: "#f9fafb",
//   },
//   contentContainer: {
//     padding: 16,
//     paddingBottom: 40,
//   },
//   profilePictureSection: {
//     alignItems: "center",
//     marginBottom: 24,
//   },
//   profilePictureContainer: {
//     position: "relative",
//     marginBottom: 12,
//   },
//   profileImagePlaceholder: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: "#f3f4f6",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 3,
//     borderColor: "#e5e7eb",
//   },
//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 3,
//     borderColor: "#e5e7eb",
//   },
//   cameraButton: {
//     position: "absolute",
//     bottom: 0,
//     right: 0,
//     backgroundColor: "#2563eb",
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 3,
//     borderColor: "#fff",
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   changePictureButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     backgroundColor: "#e0f2fe",
//     marginBottom: 8,
//   },
//   changePictureText: {
//     color: "#0284c7",
//     fontWeight: "600",
//     fontSize: 14,
//   },
//   pictureHint: {
//     fontSize: 12,
//     color: "#6b7280",
//     textAlign: "center",
//     fontStyle: "italic",
//   },
//   card: {
//     backgroundColor: "white",
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#1f2937",
//     marginBottom: 20,
//   },
//   inputGroup: {
//     marginBottom: 20,
//   },
//   labelRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#374151",
//   },
//   lockedBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fee2e2",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     gap: 4,
//   },
//   lockedText: {
//     fontSize: 11,
//     color: "#ef4444",
//     fontWeight: "500",
//   },
//   input: {
//     backgroundColor: "#f9fafb",
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     color: "#111827",
//   },
//   inputDisabled: {
//     backgroundColor: "#f3f4f6",
//     borderColor: "#e5e7eb",
//     justifyContent: "center",
//   },
//   disabledText: {
//     color: "#9ca3af",
//     fontSize: 16,
//   },
//   saveButton: {
//     backgroundColor: "#2563eb",
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   saveButtonDisabled: {
//     backgroundColor: "#9ca3af",
//   },
//   saveButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });



import { useAuth } from '@/app/contexts/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EditProfile = () => {
  const { user, apiCall } = useAuth();
  const insets = useSafeAreaInsets();
  const API = Constants.expoConfig.extra.API_URL;

  // Basic profile fields
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);

  // Mobile change OTP flow
  const [wantChangeMobile, setWantChangeMobile] = useState(false);
  const [newMobile, setNewMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Resend timer effect
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

  const handleSendOtp = async () => {
    if (newMobile.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setIsOtpLoading(true);
    try {
      await fetch(`${API}/user/sendOTP`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: newMobile }),
      });
      setOtpSent(true);
      setResendTimer(120);
      setCanResend(false);
      Alert.alert('OTP Sent', 'Please check your WhatsApp / SMS for the OTP.');
    } catch (e) {
      Alert.alert('Could Not Send OTP', 'Please check your connection and try again.');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter the OTP you received.');
      return;
    }
    setIsVerifying(true);
    try {
      const res = await fetch(`${API}/user/verifyOTP`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: newMobile, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');
      setOtpVerified(true);
      Alert.alert('Verified ✓', 'Mobile number verified. You can now save your profile.');
    } catch (e) {
      Alert.alert('Verification Failed', 'The OTP you entered is incorrect. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setOtp('');
    setOtpVerified(false);
    setCanResend(false);
    await handleSendOtp();
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      Alert.alert('Missing Fields', 'Please fill in your first name, last name, and email.');
      return;
    }

    // If user wants to change mobile but hasn't verified OTP yet
    if (wantChangeMobile && !otpVerified) {
      Alert.alert('Verify Mobile', 'Please verify your new mobile number with OTP before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const body = {
        firstName,
        lastName,
        email,
        // Send new mobile only if user changed and verified it, otherwise send existing
        mobile: otpVerified ? newMobile : (user?.phone || phone),
      };

      await apiCall(`${API}/user/profile`, {
        method: 'PATCH',
        body: JSON.stringify(body)
      });

      Alert.alert('Saved!', 'Your profile has been updated successfully.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (e) {
      Alert.alert('Could Not Save', 'Something went wrong while saving your profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const isOtpButtonDisabled = isOtpLoading || (otpSent && resendTimer > 0) || otpVerified;

  return (
    <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.screen}
          contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 24 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Picture Placeholder */}
          <View style={styles.profilePictureSection}>
            <View style={styles.profilePictureContainer}>
              <View style={styles.profileImagePlaceholder}>
                <MaterialCommunityIcons name="account-circle" size={80} color="#9ca3af" />
              </View>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={() => Alert.alert('Coming Soon', 'Profile picture upload will be available soon.')}
              >
                <MaterialCommunityIcons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.changePictureButton}
              onPress={() => Alert.alert('Coming Soon', 'Profile picture upload will be available soon.')}
            >
              <Text style={styles.changePictureText}>Change Picture</Text>
            </TouchableOpacity>
          </View>

          {/* Personal Information */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
                placeholderTextColor="#9ca3af"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
                placeholderTextColor="#9ca3af"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="done"
              />
            </View>

            {/* Mobile Section */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Mobile</Text>
                {!wantChangeMobile && (
                  <TouchableOpacity
                    style={styles.changeBadge}
                    onPress={() => setWantChangeMobile(true)}
                  >
                    <MaterialCommunityIcons name="pencil" size={12} color="#2563eb" />
                    <Text style={styles.changeBadgeText}>Change</Text>
                  </TouchableOpacity>
                )}
                {wantChangeMobile && !otpVerified && (
                  <TouchableOpacity
                    style={styles.cancelBadge}
                    onPress={() => {
                      setWantChangeMobile(false);
                      setNewMobile('');
                      setOtp('');
                      setOtpSent(false);
                      setOtpVerified(false);
                    }}
                  >
                    <Text style={styles.cancelBadgeText}>Cancel</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Show existing mobile (read-only) when not changing */}
              {!wantChangeMobile && (
                <View style={[styles.input, styles.inputDisabled]}>
                  <Text style={styles.disabledText}>{phone || 'No mobile number'}</Text>
                </View>
              )}

              {/* OTP Flow when changing mobile */}
              {wantChangeMobile && (
                <View>
                  <View style={styles.otpRow}>
                    <TextInput
                      style={[styles.input, styles.otpMobileInput]}
                      value={newMobile}
                      onChangeText={setNewMobile}
                      placeholder="New mobile number"
                      placeholderTextColor="#9ca3af"
                      keyboardType="phone-pad"
                      maxLength={10}
                      editable={!otpVerified}
                    />
                    <TouchableOpacity
                      style={[styles.otpSendButton, isOtpButtonDisabled && styles.otpSendButtonDisabled]}
                      onPress={handleSendOtp}
                      disabled={isOtpButtonDisabled}
                    >
                      <Text style={styles.otpSendText}>
                        {isOtpLoading
                          ? 'Sending…'
                          : otpVerified
                          ? '✓ Done'
                          : otpSent && resendTimer > 0
                          ? `${Math.floor(resendTimer / 60)}:${String(resendTimer % 60).padStart(2, '0')}`
                          : 'Get OTP'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {otpSent && !otpVerified && (
                    <View style={styles.otpVerifySection}>
                      <TextInput
                        style={styles.input}
                        value={otp}
                        onChangeText={setOtp}
                        placeholder="Enter OTP"
                        placeholderTextColor="#9ca3af"
                        keyboardType="number-pad"
                        maxLength={6}
                      />
                      <TouchableOpacity
                        style={[styles.verifyButton, (isVerifying || otp.length < 4) && styles.verifyButtonDisabled]}
                        onPress={handleVerifyOtp}
                        disabled={isVerifying || otp.length < 4}
                      >
                        <Text style={styles.verifyButtonText}>
                          {isVerifying ? 'Verifying…' : 'Verify OTP'}
                        </Text>
                      </TouchableOpacity>
                      {resendTimer === 0 && canResend && (
                        <TouchableOpacity style={styles.resendButton} onPress={handleResendOtp}>
                          <Text style={styles.resendButtonText}>Resend OTP</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  {otpVerified && (
                    <View style={styles.verifiedBadge}>
                      <MaterialCommunityIcons name="check-circle" size={16} color="#065f46" />
                      <Text style={styles.verifiedBadgeText}>Mobile verified — {newMobile}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving…' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  screen: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    padding: 16,
  },
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#e5e7eb',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563eb',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 5,
  },
  changePictureButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#e0f2fe',
  },
  changePictureText: {
    color: '#0284c7',
    fontWeight: '600',
    fontSize: 14,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
    justifyContent: 'center',
  },
  disabledText: {
    color: '#9ca3af',
    fontSize: 16,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  changeBadgeText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
  },
  cancelBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  cancelBadgeText: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '600',
  },
  otpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  otpMobileInput: {
    flex: 1,
    marginBottom: 0,
  },
  otpSendButton: {
    backgroundColor: '#17e95d',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  otpSendButtonDisabled: {
    backgroundColor: '#a5a5a5',
  },
  otpSendText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  otpVerifySection: {
    marginTop: 12,
    gap: 10,
  },
  verifyButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButtonDisabled: {
    backgroundColor: '#a5a5a5',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
  },
  resendButtonText: {
    color: '#0284c7',
    fontWeight: '600',
    fontSize: 14,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#d1fae5',
    borderWidth: 1,
    borderColor: '#10b981',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  verifiedBadgeText: {
    color: '#065f46',
    fontWeight: '600',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});