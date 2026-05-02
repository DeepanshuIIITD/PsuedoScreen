import DateTimePicker from '@react-native-community/datetimepicker';
import Constants from 'expo-constants';
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
  const [otpVerified, setOtpVerified] = React.useState(false);
  const [dateOfBirth, setDateOfBirth] = React.useState("");
  const [isOtpLoading, setIsOtpLoading] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [otpError, setOtpError] = React.useState('');
  const [resendTimer, setResendTimer] = React.useState(0);
  const [canResend, setCanResend] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const insets = useSafeAreaInsets();

  const API = Constants.expoConfig?.extra?.API_URL ;

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
        // headers: { 'Content-Type': 'application/json' },
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
        console.error('OTP sending failed:', data);
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
    if (!otp || otp.length !== 4) {
      alert("Please enter a valid 4-digit OTP");
      return;
    }

    setIsVerifying(true);
    setOtpError('');

    try {
      console.log('Verifying OTP...');
      const otpVerifyResponse = await fetch(`${API}/user/verifyOTP`, {
        method: 'POST',
        // headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: mobile, otp: otp }),
      });
      const otpVerifyData = await otpVerifyResponse.json();
      
      if (!otpVerifyResponse.ok) {
        throw new Error(otpVerifyData.error || 'Invalid OTP');
      }
      
      console.log('OTP verified successfully');
      setOtpVerified(true);
      alert("OTP verified successfully! You can now submit your registration.");
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

  const handleSubmit = async () => {
    if (!userName || !password || !email || !mobile || !dateOfBirth) {
      alert("Please fill all fields");
      return;
    }
    
    if (!otpSent) {
      alert("Please request OTP first");
      return;
    }
    
    if (!otpVerified) {
      alert("Please verify your OTP before submitting");
      return;
    }

    try {
      console.log('Proceeding with signup...');

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

      const response = await fetch(`${API}/${role}/signUp`, {
        method: 'POST',
        // headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Signup successful:', data);
      alert(`Signup successful! Welcome ${data.user.username}`);
      router.replace("/(auth)");
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
                    maxLength={10}
                    editable={!otpVerified}
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

                {otpSent && !otpVerified && (
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
                    
                    {/* Verify OTP Button */}
                    <Pressable
                      style={[styles.verifyButton, isVerifying && styles.verifyButtonDisabled]}
                      onPress={handleVerifyOtp}
                      disabled={isVerifying || !otp || otp.length !== 4}
                    >
                      <Text style={styles.verifyButtonText}>
                        {isVerifying ? "Verifying..." : "Verify OTP"}
                      </Text>
                    </Pressable>
                    
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

                {/* OTP Verified Message */}
                {otpVerified && (
                  <View style={styles.verifiedContainer}>
                    <Text style={styles.verifiedText}>✓ OTP Verified Successfully</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Submit Button */}
            <Pressable 
              style={[
                styles.submitButton,
                !otpVerified && styles.submitButtonDisabled
              ]} 
              onPress={handleSubmit}
              disabled={!otpVerified}
            >
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
    paddingBottom: 40,
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
    marginTop: 10,
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
  submitButtonDisabled: {
    backgroundColor: "#a5a5a5",
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
