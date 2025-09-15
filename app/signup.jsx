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

  const handleGetOtp = () => {
    if (mobile.length >= 10) {
      setOtpSent(true);
      // here you can trigger OTP logic, for now hardcode "123456"
      alert("OTP sent successfully");
    } else {
      alert("Enter a valid mobile number");
    }
  };

  const handleSubmit = () => {
    if (!userName || !password || !email || !mobile || !dateOfBirth) {
      alert("Please fill all fields");
      return;
    }
    if (otp !== "123456") {
      alert("Invalid OTP");
      return;
    }
    // Proceed with signup logic
    alert("Signup successful");
    if (role === "user") {
      router.push("/userClassEnrolled");
    }
    else if (role === "admin") {
      router.push("/adminClassSelector");
    }

};


  return (
  <KeyboardAvoidingView
    style={{flex:1}}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={60} // adjust this value as needed
  >
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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

          <TextInput
            style={styles.inputStyle}
            onChangeText={(text) => setDateOfBirth(text)}
            value={dateOfBirth}
            placeholder="DD/MM/YYYY"
            
          />

          {/* Mobile row */}
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.inputStyle, { flex: 1 }]}
                onChangeText={(text) => setMobile(text)}
                value={mobile}
                placeholder="Mobile number"
                keyboardType="phone-pad"
              />
              <Pressable style={styles.otpButton} onPress={handleGetOtp}>
                <Text style={styles.otpButtonText}>Get OTP</Text>
              </Pressable>
            </View>

          {/* OTP input shown only after request */}
          {otpSent && (
            <TextInput
              style={styles.inputStyle}
              onChangeText={(text) => setOtp(text)}
              value={otp}
              placeholder="Enter OTP"
              keyboardType="number-pad"
            />
          )}
        </View>

        {/* Submit */}

          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </Pressable>

        {/* Messages */}
        {/* <Text style={styles.title}>Welcome to the SignUp</Text>
        <Link href={"/userClassEnrolled"}>
          <Text style={styles.linkText}>Successfully User</Text>
        </Link>
        <Link href={"/adminClassSelector"}>
          <Text style={styles.linkText}>Successfully Admin</Text>
        </Link> */}
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
  otpButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
});
