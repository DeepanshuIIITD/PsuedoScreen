import DateTimePicker from '@react-native-community/datetimepicker';
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

const Signup = () => {
  const [role, setRole] = React.useState("user");
  const [userName, setUserName] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [isOtpLoading, setIsOtpLoading] = React.useState(false);
  const [otpError, setOtpError] = React.useState('');
  const [resendTimer, setResendTimer] = React.useState(0);
  const [canResend, setCanResend] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const insets = useSafeAreaInsets();

  const API_URL = 'https://streak-app-uxyv.onrender.com';
  const USE_MOCK = true; // Toggle mocked APIs for OTP + Signup

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

    try {
      console.log('Sending OTP to mobile:', mobile);
      if (USE_MOCK) {
        // Expected backend API (commented)
        // Request: POST `${API_URL}/user/sendOTP`
        // Body:
        // { "phone": string }
        // Response 200:
        // { "success": true, "delivery": "whatsapp" | "sms" }
        // Response 400:
        // { "error": string }
        const data = { success: true, delivery: 'sms' };
        setOtpSent(true);
        alert("OTP sent successfully! Check your WhatsApp/SMS.");
        console.log('OTP sent successfully (mock):', data);
        setResendTimer(120);
        setCanResend(false);
      } else {
        const response = await fetch(`${API_URL}/user/sendOTP`, {
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
      }
    } catch (error) {
      console.error('OTP sending error:', error);
      setOtpError(error.message);
      alert(`Failed to send OTP: ${error.message}`);
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setOtpError('');
    setOtp('');
    
    await handleGetOtp();
  };

  const handleSubmit = async () => {
    if (!userName || !password || !email || !mobile || !dateOfBirth) {
      alert("Please fill all fields");
      return;
    }
    
    if (!otpSent) {
      alert("Please request OTP first");
      return;
    }
    
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }

    try {
      console.log('Verifying OTP...');
      if (USE_MOCK) {
        // Expected backend API (commented)
        // Request: POST `${API_URL}/user/verifyOTP`
        // Body:
        // { "phone": string, "otp": string }
        // Response 200:
        // { "valid": true }
        // Response 400:
        // { "error": string }
        const otpVerifyData = { valid: otp === '123456' || otp?.length === 6 };
        if (!otpVerifyData.valid) throw new Error('Invalid OTP');
        console.log('OTP verified successfully (mock), proceeding with signup...');
      } else {
        const otpVerifyResponse = await fetch(`${API_URL}/user/verifyOTP`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: mobile, otp: otp }),
        });
        const otpVerifyData = await otpVerifyResponse.json();
        if (!otpVerifyResponse.ok) {
          throw new Error(otpVerifyData.error || 'Invalid OTP');
        }
        console.log('OTP verified successfully, proceeding with signup...');
      }

      const signupData = {
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: mobile,
        dob: dateOfBirth,
        password: password,
        otp: otp,
      };
      if (USE_MOCK) {
        // Expected backend API (commented)
        // Request: POST `${API_URL}/${role}/signUp` (role in ['user','admin'])
        // Body:
        // {
        //   "userName": string,
        //   "firstName": string,
        //   "lastName": string,
        //   "email": string,
        //   "phone": string,
        //   "dob": "YYYY-MM-DD",
        //   "password": string,
        //   "otp": string
        // }
        // Response 201:
        // { "user": { "id": string, "username": string }, "message": string }
        // Response 400:
        // { "error": string }
        const data = {
          user: { id: 'u_456', username: userName },
          message: 'created',
        };
        console.log('Signup successful (mock):', data);
        alert(`Signup successful! Welcome ${data.user.username}`);
        router.replace("/(auth)/index");
      } else {
        const response = await fetch(`${API_URL}/${role}/signUp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signupData)
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Server error: ${response.status}`);
        }
        const data = await response.json();
        console.log('Signup successful:', data);
        alert(`Signup successful! Welcome ${data.user.username}`);
        router.replace("/(auth)/index");
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert(`Signup failed: ${error.message}`);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      setDateOfBirth(date.toISOString().split('T')[0]);
    }
  };

  // Check if Get OTP button should be disabled
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
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Header role selector */}
            <View style={styles.headerBar}>
              <Pressable
                style={[
                  styles.selector,
                  { backgroundColor: role === "user" ? "#51e6ebff" : "#fff" },
                ]}
                onPress={() => setRole("user")}
              >
                <Text style={styles.selectorText}>User</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.selector,
                  { backgroundColor: role === "admin" ? "#51e6ebff" : "#fff" },
                ]}
                onPress={() => setRole("admin")}
              >
                <Text style={styles.selectorText}>Admin</Text>
              </Pressable>
            </View>

            {/* Input fields */}
            <View style={styles.formContainer}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(text) => setFirstName(text)}
                value={firstName}
                placeholder="First Name"
                returnKeyType="next"
              />

              <TextInput
                style={styles.inputStyle}
                onChangeText={(text) => setLastName(text)}
                value={lastName}
                placeholder="Last Name"
                returnKeyType="next"
              />

              <TextInput
                style={styles.inputStyle}
                onChangeText={(text) => setUserName(text)}
                value={userName}
                placeholder="Username"
                returnKeyType="next"
              />

              <TextInput
                style={styles.inputStyle}
                onChangeText={(text) => setPassword(text)}
                value={password}
                placeholder="Password"
                secureTextEntry
                returnKeyType="next"
              />

              <TextInput
                style={styles.inputStyle}
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder="Email address"
                keyboardType="email-address"
                returnKeyType="next"
              />

              <Pressable style={styles.datePickerButton} onPress={showDatePickerModal}>
                <Text style={[styles.datePickerText, { color: dateOfBirth ? '#000' : '#999' }]}>
                  {dateOfBirth || "Select Date of Birth"}
                </Text>
              </Pressable>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                />
              )}

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
                  />
                  <Pressable 
                    style={[
                      styles.otpButton, 
                      isGetOtpDisabled && styles.otpButtonDisabled
                    ]} 
                    onPress={handleGetOtp}
                    disabled={isGetOtpDisabled}
                  >
                    <Text style={styles.otpButtonText}>
                      {isOtpLoading ? "Sending..." : 
                       otpSent && resendTimer > 0 ? `${Math.floor(resendTimer / 60)}:${(resendTimer % 60).toString().padStart(2, '0')}` : 
                       "Get OTP"}
                    </Text>
                  </Pressable>
                </View>

                {/* OTP input shown only after request */}
                {otpSent && (
                  <View style={styles.otpSection}>
                    <TextInput
                      style={styles.inputStyle}
                      onChangeText={(text) => setOtp(text)}
                      value={otp}
                      placeholder="Enter OTP"
                      keyboardType="number-pad"
                      maxLength={6}
                      returnKeyType="done"
                    />
                    
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
              </View>
            </View>

            {/* Submit Button */}
            <Pressable style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Submit</Text>
            </Pressable>

            <Text style={styles.footerText}>Hello, {role}!</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40, // Extra padding at bottom
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    marginTop: 20,
    marginBottom: 30,
  },
  selector: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectorText: {
    fontSize: 16,
    fontWeight: "600",
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
    alignItems: "flex-start", // Changed from center to flex-start
    marginBottom: 0,
  },
  mobileInput: {
    flex: 1,
    marginRight: 10,
    marginBottom: 0, // Remove bottom margin for mobile input
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
  resendButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 10,
  },
  resendButtonDisabled: {
    backgroundColor: '#a5a5a5',
  },
  resendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  datePickerButton: {
    backgroundColor: "#f8f8f8",
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  datePickerText: {
    fontSize: 16,
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
  footerText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
});









// my implementation working fine but with some design flow and hiddBottom like things
// import DateTimePicker from '@react-native-community/datetimepicker';
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

// const Signup = () => {
//   const [role, setRole] = React.useState("user");
//   const [userName, setUserName] = React.useState("");
//   const [firstName, setFirstName] = React.useState("");
//   const [lastName, setLastName] = React.useState("");
//   const [password, setPassword] = React.useState("");
//   const [email, setEmail] = React.useState("");
//   const [mobile, setMobile] = React.useState("");
//   const [otp, setOtp] = React.useState("");
//   const [otpSent, setOtpSent] = React.useState(false);
//   const [dateOfBirth, setDateOfBirth] = React.useState("");
//   const [isOtpLoading, setIsOtpLoading] = React.useState(false);
//   const [otpError, setOtpError] = React.useState('');
//   const [resendTimer, setResendTimer] = React.useState(0);
//   const [canResend, setCanResend] = React.useState(false);
//   const [showDatePicker, setShowDatePicker] = React.useState(false);
//   const [selectedDate, setSelectedDate] = React.useState(new Date());

//   const insets = useSafeAreaInsets();

//   const API_URL = 'https://streak-app-uxyv.onrender.com';

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

//       const response = await fetch(`${API_URL}/user/sendOTP`, {       // "/user/sendOTP"
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           phone: mobile,
//           // countryCode: '91' // for India
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setOtpSent(true);
//         alert("OTP sent successfully! Check your WhatsApp/SMS.");
//         console.log('OTP sent successfully:', data);
        
//         // Start 2-minute timer for resend
//         setResendTimer(120); // 2 minutes = 120 seconds
//         setCanResend(false);
//       } else {
//         throw new Error(data.error || 'Failed to send OTP');
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
//     setOtp(''); // Clear previous OTP
    
//     // Call the same logic as handleGetOtp
//     await handleGetOtp();
//   };

//   const handleSubmit = async () => {
//     if (!userName || !password || !email || !mobile || !dateOfBirth) {
//       alert("Please fill all fields");
//       return;
//     }
    
//     if (!otpSent) {
//       alert("Please request OTP first");
//       return;
//     }
    
//     if (!otp) {
//       alert("Please enter the OTP");
//       return;
//     }

//     try {
//       // First verify OTP with backend
//       console.log('Verifying OTP...');
      
//       const otpVerifyResponse = await fetch(`${API_URL}/user/verifyOTP`, {  // "/user/verfiyOTP"
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           phone: mobile,
//           otp: otp,
//         }),
//       });

//       const otpVerifyData = await otpVerifyResponse.json();

//       if (!otpVerifyResponse.ok) {
//         throw new Error(otpVerifyData.error || 'Invalid OTP');
//       }

//       console.log('OTP verified successfully, proceeding with signup...');

//       // If OTP is verified, proceed with signup
//       console.log('Attempting signup to:', `${API_URL}/user/signUp`);  //user/signUp
      
//       const signupData = {
//         userName: userName,
//         firstName: firstName,
//         lastName: lastName,
//         email: email,
//         phone: mobile,
//         dob: dateOfBirth,               //format - yyyy-mm-dd
//         password: password,
//         otp: otp,
//       };
//       console.log('Signup data:', signupData);
      
//       const response = await fetch(`${API_URL}/admin/signUp`, {           // "/user/signUp" // "/admin/signUp"
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(signupData)
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `Server error: ${response.status}`);
//       }
      
//       const data = await response.json();
//       console.log('Signup successful:', data);
      
//       alert(`Signup successful! Welcome ${data.user.username}`);
      
//       // if (role === "user") {
//       //   router.push("/userClassEnrolled");
//       // } else if (role === "admin") {
//       //   router.push("/adminClassSelector");
//       // }
//       router.replace("/(auth)/index");        // need to see later if this things not work
//     } catch (error) {
//       console.error('Signup error:', error);
//       alert(`Signup failed: ${error.message}`);
//     }
//   };

//   const showDatePickerModal = () => {
//   setShowDatePicker(true);
// };

// const onDateChange = (event, date) => {
//   setShowDatePicker(false);
//   if (date) {
//     setSelectedDate(date);
//     setDateOfBirth(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
//   }
// };

//   return (
//   <View style={[styles.safeContainer, {paddingTop: insets.top}]}>
//   <KeyboardAvoidingView
//     style={{flex:1}}
//     behavior={Platform.OS === "ios" ? "padding" : "height"}
//     keyboardVerticalOffset={70} // need to adjust this later
//   >
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.container}>
//         {/* Header role selector */}
//         <View style={[styles.headerBar , {marginTop: 50} ]}>
//           <Pressable
//             style={[
//               styles.selector,
//               { backgroundColor: role === "user" ? "#51e6ebff" : "#fff" },
//             ]}
//             onPress={() => setRole("user")}
//           >
//             <Text style={styles.selectorText}>User</Text>
//           </Pressable>
//           <Pressable
//             style={[
//               styles.selector,
//               { backgroundColor: role === "admin" ? "#51e6ebff" : "#fff" },
//             ]}
//             onPress={() => setRole("admin")}
//           >
//             <Text style={styles.selectorText}>Admin</Text>
//           </Pressable>
//         </View>

//         {/* Input fields */}


//         <View style={styles.formContainer}>

//           <TextInput
//             style={styles.inputStyle}
//             onChangeText={(text) => setFirstName(text)}
//             value={firstName}
//             placeholder="FirstName"
//           />

//             <TextInput
//             style={styles.inputStyle}
//             onChangeText={(text) => setLastName(text)}
//             value={lastName}
//             placeholder="LastName"
//           />

//           <TextInput
//             style={styles.inputStyle}
//             onChangeText={(text) => setUserName(text)}
//             value={userName}
//             placeholder="Username"
//           />

        

//           <TextInput
//             style={styles.inputStyle}
//             onChangeText={(text) => setPassword(text)}
//             value={password}
//             placeholder="Password"
//             secureTextEntry
//           />

//           <TextInput
//             style={styles.inputStyle}
//             onChangeText={(text) => setEmail(text)}
//             value={email}
//             placeholder="Email address"
//             keyboardType="email-address"
//           />

//           <Pressable style={styles.datePickerButton} onPress={showDatePickerModal}>
//             <Text style={styles.datePickerText}>
//               {dateOfBirth || "Select Date of Birth"}
//             </Text>
//           </Pressable>

//           {showDatePicker && (
//             <DateTimePicker
//               value={selectedDate}
//               mode="date"
//               display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//               onChange={onDateChange}
//               maximumDate={new Date()} // Prevent future dates
//               minimumDate={new Date(1900, 0, 1)} // Reasonable minimum date
//             />
//           )}

//           {/* Mobile row */}
//           <View style={styles.inputRow}>
//             <TextInput
//               style={[styles.inputStyle, { flex: 1 }]}
//               onChangeText={(text) => setMobile(text)}
//               value={mobile}
//               placeholder="Mobile number"
//               keyboardType="phone-pad"
//             />
//             <Pressable 
//               style={[
//                 styles.otpButton, 
//                 isOtpLoading && styles.otpButtonDisabled
//               ]} 
//               onPress={handleGetOtp}
//               disabled={isOtpLoading}
//             >
//               <Text style={styles.otpButtonText}>
//                 {isOtpLoading ? "Sending..." : "Get OTP"}
//               </Text>
//             </Pressable>
//           </View>

//           {/* OTP input shown only after request */}
//           {otpSent && (
//             <View>
//               <TextInput
//                 style={styles.inputStyle}
//                 onChangeText={(text) => setOtp(text)}
//                 value={otp}
//                 placeholder="Enter OTP"
//                 keyboardType="number-pad"
//                 maxLength={6}
//               />
              
//               {/* Resend button */}
//               <View style={styles.resendContainer}>
//                 {resendTimer > 0 ? (
//                   <Text style={styles.timerText}>
//                     Resend OTP in {Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, '0')}
//                   </Text>
//                 ) : (
//                   <Pressable 
//                     style={[styles.resendButton, !canResend && styles.resendButtonDisabled]}
//                     onPress={handleResendOtp}
//                     disabled={!canResend}
//                   >
//                     <Text style={styles.resendButtonText}>Resend OTP</Text>
//                   </Pressable>
//                 )}
//               </View>
              
//               {otpError ? (
//                 <Text style={styles.errorText}>{otpError}</Text>
//               ) : null}
//             </View>
//           )}
//         </View>

//         {/* Submit */}
//         <Pressable style={styles.submitButton} onPress={handleSubmit}>
//           <Text style={styles.submitText}>Submit</Text>
//         </Pressable>

//         <Text style={styles.footerText}>Hello, {role}!</Text>
//       </View>
//     </ScrollView>
//   </KeyboardAvoidingView>
//   </View>
//   );
// };

// export default Signup;

// const styles = StyleSheet.create({
//   safeContainer: {
//     flex: 1,
//     backgroundColor: "lightgold",
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: "#f9f9f9",
//     marginTop: 100,
//   },
//   container: {
//     flex: 1,
//     alignItems: "center",
//   },
//   headerBar: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "70%",
//     marginBottom: 20,
//   },
//   selector: {
//     flex: 1,
//     paddingVertical: 12,
//     marginHorizontal: 5,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   selectorText: {
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   formContainer: {
//     width: "100%",
//     borderRadius: 12,
//     padding: 10,
//     marginBottom: 20,
//     backgroundColor: "#fff",
//   },
//   inputRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   inputStyle: {
//     backgroundColor: "#f2f2f2",
//     height: 48,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     fontSize: 14,
//     marginBottom: 15,
//   },
//   otpButton: {
//     backgroundColor: "#17e95d",
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 6,
//     marginLeft: 10,
//     marginBottom: 15,
//   },
//   otpButtonDisabled: {
//     backgroundColor: "#a5a5a5",
//   },
//   otpButtonText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   resendContainer: {
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   resendButton: {
//     backgroundColor: '#17e95d',
//     paddingVertical: 8,
//     paddingHorizontal: 20,
//     borderRadius: 6,
//   },
//   resendButtonDisabled: {
//     backgroundColor: '#a5a5a5',
//   },
//   resendButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   timerText: {
//     color: '#666',
//     fontSize: 14,
//     fontStyle: 'italic',
//   },
//   errorText: {
//     color: "#ff4444",
//     fontSize: 12,
//     marginTop: -10,
//     marginBottom: 10,
//     paddingHorizontal: 12,
//   },
//   submitButton: {
//     backgroundColor: "#17e95d",
//     paddingVertical: 12,
//     paddingHorizontal: 40,
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   submitText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "700",
//     marginBottom: 10,
//   },
//   linkText: {
//     fontSize: 16,
//     color: "#0c0a0a",
//     marginBottom: 5,
//     fontWeight: "600",
//   },
//   footerText: {
//     marginTop: 10,
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   datePickerButton: {
//   backgroundColor: "#f2f2f2",
//   height: 48,
//   borderRadius: 8,
//   paddingHorizontal: 12,
//   fontSize: 14,
//   marginBottom: 15,
//   justifyContent: 'center',
// },
// // datePickerText: {
// //   fontSize: 14,
// //   color: dateOfBirth ? '#000' : '#999',
// // },
// });