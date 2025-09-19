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

// const Signup = () => {
//   const [role, setRole] = React.useState("user");
//   const [userName, setUserName] = React.useState("");
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

//   // CHANGE THIS TO YOUR COMPUTER'S IP ADDRESS
//   const API_URL = 'http://192.168.29.152:5050';

//   const handleGetOtp = async () => {
//     if (mobile.length < 10) {
//       alert("Enter a valid mobile number (10 digits minimum)");
//       return;
//     }

//     setIsOtpLoading(true);
//     setOtpError('');

//     try {
//       console.log('Sending OTP to mobile:', mobile);

//       // Option 1: Call your backend endpoint that handles OTP
//       const response = await fetch(`${API_URL}/send-otp`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           mobile: mobile,
//           countryCode: '+91' // for India
//         }),
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         setOtpSent(true);
//         alert("OTP sent successfully! Check your SMS.");
//         console.log('OTP sent successfully:', data);
//         // Start 2-minute timer for resend
//         setResendTimer(120); // 2 minutes = 120 seconds
//         setCanResend(false);
//       } else {
//         throw new Error(data.error || 'Failed to send OTP');
//       }
//       } catch (error) {
//       console.error('OTP sending error:', error);
//       setOtpError(error.message);
//       alert(`Failed to send OTP: ${error.message}`);
//     } finally {
//       setIsOtpLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!userName || !password || !email || !mobile || !dateOfBirth) {
//       alert("Please fill all fields");
//       return;
//     }
//     const response = await fetch(`${API_URL}/verify-otp`,{

//     })
//     if (otp !== "123456") {
//       alert("Invalid OTP");
//       return;
//     }

//     try {
//       console.log('Attempting signup to:', `${API_URL}/signup`);
      
//       // Log the data being sent
//       const signupData = {
//         username: userName,
//         email: email,
//         mobile: mobile,
//         dateofbirth: dateOfBirth,
//         password: password,
//       };
//       console.log('Signup data:', signupData);
      
//       const response = await fetch(`${API_URL}/signup`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: userName,
//           email: email,
//           mobile: mobile,
//           dateofbirth: dateOfBirth, // Note: backend expects 'dateofbirth', not 'dateOfBirth'
//           password: password,
//         })
//       });
      
//       // Check if response is OK
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `Server error: ${response.status}`);
//       }
      
//       const data = await response.json();
//       console.log('Signup successful:', data);
      
//       alert(`Signup successful! Welcome ${data.user.username}`);
      
//       if (role === "user") {
//         router.push("/userClassEnrolled");
//       } else if (role === "admin") {
//         router.push("/adminClassSelector");
//       }
//     } catch (error) {
//       console.error('Signup error:', error);
//       alert(`Signup failed: ${error.message}`);
//     }
//   };

//   return (
//   <KeyboardAvoidingView
//     style={{flex:1}}
//     behavior={Platform.OS === "ios" ? "padding" : "height"}
//     keyboardVerticalOffset={60} // adjust this value as needed
//   >
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.container}>
//         {/* Header role selector */}
//         <View style={styles.headerBar}>
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

//           <TextInput
//             style={styles.inputStyle}
//             onChangeText={(text) => setDateOfBirth(text)}
//             value={dateOfBirth}
//             placeholder="YYYY-MM-DD"
//           />

//           {/* Mobile row */}
//             <View style={styles.inputRow}>
//               <TextInput
//                 style={[styles.inputStyle, { flex: 1 }]}
//                 onChangeText={(text) => setMobile(text)}
//                 value={mobile}
//                 placeholder="Mobile number"
//                 keyboardType="phone-pad"
//               />
//               <Pressable style={styles.otpButton} onPress={handleGetOtp}>
//                 <Text style={styles.otpButtonText}>Get OTP</Text>
//               </Pressable>
//             </View>

//           {/* OTP input shown only after request */}
//           {otpSent && (
//             <TextInput
//               style={styles.inputStyle}
//               onChangeText={(text) => setOtp(text)}
//               value={otp}
//               placeholder="Enter OTP (use 123456)"
//               keyboardType="number-pad"
//             />
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
//   );
// };

// export default Signup;

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: "#f9f9f9",
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
//   otpButtonText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "600",
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
// });


// refresh token /user/refreshToken


// after signup will riderect to login page








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

const Signup = () => {
  const [role, setRole] = React.useState("user");
  const [userName, setUserName] = React.useState("");
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

  const API_URL = 'http://192.168.29.152:5050';

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

      const response = await fetch(`${API_URL}/send-otp`, {       // "/user/sendOTP"
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: mobile,
          countryCode: '91' // for India
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOtpSent(true);
        alert("OTP sent successfully! Check your WhatsApp/SMS.");
        console.log('OTP sent successfully:', data);
        
        // Start 2-minute timer for resend
        setResendTimer(120); // 2 minutes = 120 seconds
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

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setOtpError('');
    setOtp(''); // Clear previous OTP
    
    // Call the same logic as handleGetOtp
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
      // First verify OTP with backend
      console.log('Verifying OTP...');
      
      const otpVerifyResponse = await fetch(`${API_URL}/verify-otp`, {  // "/user/verfiyOTP"
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: mobile,
          otp: otp,
        }),
      });

      const otpVerifyData = await otpVerifyResponse.json();

      if (!otpVerifyResponse.ok || !otpVerifyData.success) {
        throw new Error(otpVerifyData.error || 'Invalid OTP');
      }

      console.log('OTP verified successfully, proceeding with signup...');

      // If OTP is verified, proceed with signup
      console.log('Attempting signup to:', `${API_URL}/signup`);
      
      const signupData = {
        username: userName,
        email: email,
        mobile: mobile,
        dateofbirth: dateOfBirth,
        password: password,
      };
      console.log('Signup data:', signupData);
      
      const response = await fetch(`${API_URL}/signup`, {           // "/user/signUp" // "/admin/signUp"
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Signup successful:', data);
      
      alert(`Signup successful! Welcome ${data.user.username}`);
      
      if (role === "user") {
        router.push("/userClassEnrolled");
      } else if (role === "admin") {
        router.push("/adminClassSelector");
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
    setDateOfBirth(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
  }
};

  return (
  <KeyboardAvoidingView
    style={{flex:1}}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={1000} // need to adjust this later
  >
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Header role selector */}
        <View style={[styles.headerBar , {marginTop: 50} ]}>
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
            onChangeText={(text) => setUserName(text)}
            value={userName}
            placeholder="Username"
          />

          <TextInput
            style={styles.inputStyle}
            onChangeText={(text) => setPassword(text)}
            value={password}
            placeholder="Password"
            secureTextEntry
          />

          <TextInput
            style={styles.inputStyle}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="Email address"
            keyboardType="email-address"
          />

          <Pressable style={styles.datePickerButton} onPress={showDatePickerModal}>
            <Text style={styles.datePickerText}>
              {dateOfBirth || "Select Date of Birth"}
            </Text>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              maximumDate={new Date()} // Prevent future dates
              minimumDate={new Date(1900, 0, 1)} // Reasonable minimum date
            />
          )}

          {/* Mobile row */}
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.inputStyle, { flex: 1 }]}
              onChangeText={(text) => setMobile(text)}
              value={mobile}
              placeholder="Mobile number"
              keyboardType="phone-pad"
            />
            <Pressable 
              style={[
                styles.otpButton, 
                isOtpLoading && styles.otpButtonDisabled
              ]} 
              onPress={handleGetOtp}
              disabled={isOtpLoading}
            >
              <Text style={styles.otpButtonText}>
                {isOtpLoading ? "Sending..." : "Get OTP"}
              </Text>
            </Pressable>
          </View>

          {/* OTP input shown only after request */}
          {otpSent && (
            <View>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(text) => setOtp(text)}
                value={otp}
                placeholder="Enter OTP"
                keyboardType="number-pad"
                maxLength={6}
              />
              
              {/* Resend button */}
              <View style={styles.resendContainer}>
                {resendTimer > 0 ? (
                  <Text style={styles.timerText}>
                    Resend OTP in {Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, '0')}
                  </Text>
                ) : (
                  <Pressable 
                    style={[styles.resendButton, !canResend && styles.resendButtonDisabled]}
                    onPress={handleResendOtp}
                    disabled={!canResend}
                  >
                    <Text style={styles.resendButtonText}>Resend OTP</Text>
                  </Pressable>
                )}
              </View>
              
              {otpError ? (
                <Text style={styles.errorText}>{otpError}</Text>
              ) : null}
            </View>
          )}
        </View>

        {/* Submit */}
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </Pressable>

        <Text style={styles.footerText}>Hello, {role}!</Text>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    marginTop: 100,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
    marginBottom: 20,
  },
  selector: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  selectorText: {
    fontSize: 16,
    fontWeight: "600",
  },
  formContainer: {
    width: "100%",
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  inputStyle: {
    backgroundColor: "#f2f2f2",
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 15,
  },
  otpButton: {
    backgroundColor: "#17e95d",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginLeft: 10,
    marginBottom: 15,
  },
  otpButtonDisabled: {
    backgroundColor: "#a5a5a5",
  },
  otpButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  resendContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  resendButton: {
    backgroundColor: '#17e95d',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  resendButtonDisabled: {
    backgroundColor: '#a5a5a5',
  },
  resendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  timerText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    paddingHorizontal: 12,
  },
  submitButton: {
    backgroundColor: "#17e95d",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 20,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  linkText: {
    fontSize: 16,
    color: "#0c0a0a",
    marginBottom: 5,
    fontWeight: "600",
  },
  footerText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  datePickerButton: {
  backgroundColor: "#f2f2f2",
  height: 48,
  borderRadius: 8,
  paddingHorizontal: 12,
  fontSize: 14,
  marginBottom: 15,
  justifyContent: 'center',
},
// datePickerText: {
//   fontSize: 14,
//   color: dateOfBirth ? '#000' : '#999',
// },
});