import Constants from "expo-constants";
import { router } from "expo-router";
import React from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ForgotPassword = () => {
  const insets = useSafeAreaInsets();
  const API = Constants.expoConfig.extra.API_URL;

  const [phone, setPhone] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const [otpSent, setOtpSent] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  /* ---------------- SEND OTP ---------------- */
  const handleSendOtp = async () => {
    if (phone.length < 10) {
      Alert.alert("Invalid Number", "Enter a valid 10-digit mobile number");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`${API}/user/sendOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "OTP failed");

      setOtpSent(true);
      Alert.alert("OTP Sent", "Check your SMS / WhatsApp");
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- RESET PASSWORD ---------------- */
  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      Alert.alert("Missing Fields", "Enter OTP and new password");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`${API}/user/resetPassword`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: Number(phone),
          otp: Number(otp),
          newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Reset failed");

      Alert.alert("Success", data.message);
      router.replace("/(auth)/index");
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Forgot Password</Text>

          {/* Phone */}
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          {!otpSent && (
            <Pressable style={styles.primaryBtn} onPress={handleSendOtp}>
              <Text style={styles.btnText}>
                {isLoading ? "Sending..." : "Get OTP"}
              </Text>
            </Pressable>
          )}

          {/* OTP + New Password */}
          {otpSent && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
                maxLength={6}
              />

              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />

              <Pressable style={styles.primaryBtn} onPress={handleResetPassword}>
                <Text style={styles.btnText}>
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Text>
              </Pressable>
            </>
          )}

          <Pressable onPress={() => router.back()}>
            <Text style={styles.link}>Back to Login</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 48,
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  primaryBtn: {
    backgroundColor: "#17e95d",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    marginTop: 20,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});
