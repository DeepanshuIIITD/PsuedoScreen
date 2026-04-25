import { useAuth } from '@/app/contexts/AuthContext';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

// console.log("🔴 ADMIN CLASS REGISTRATION - Mounting");
const AdminClassRegistration = () => {

  const [title, setTitle] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { apiCall } = useAuth();
  // const API = 'https://streak-app-production.up.railway.app';
  const API = Constants.expoConfig.extra.API_URL;
  // console.log("🔴 ADMIN CLASS REGISTRATION - Rendering");


  const USE_MOCK = false; // Toggle mocked createClass API

  const handleSubmit = async () => {
  if (!email || !phone || !title) {
    alert("Please fill all fields");
    return;
  }

  try {
    // console.log("Creating Class...");
    // if (USE_MOCK) {
    //   // Expected backend API (commented)
    //   // POST `${API}/admin/createClass`
    //   // Body:
    //   // { "name": string, "phone": string, "email": string }
    //   // Response 201:
    //   // { "class_id": string, "class_code": string, "name": string, "email": string, "phone": string, "CreatedAt": ISOString }
    //   const createClassData = {
    //     class_id: 'c_999',
    //     class_code: 'NEW999',
    //     name: title,
    //     email,
    //     phone,
    //     CreatedAt: new Date().toISOString(),
    //   };
    //   console.log("Class Created Successfully (mock):", createClassData);
    //   Alert.alert(
    //     "✅ Class Created Successfully!",
    //     `${createClassData.name}\n\n📋 Class Code: ${createClassData.class_code}\n🆔 Class ID: ${createClassData.class_id}\n\n📧 ${createClassData.email}\n📱 ${createClassData.phone}`,
    //     [ { text: "View Classes", onPress: () => router.push("/adminClassSelector") } ]
    //   );
    //   return;
    // }

    const createClassData = await apiCall(`${API}/admin/createClass`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: title, phone, email }),
    });

      // console.log("Class Created Successfully:", createClassData);
      // Show success message with class details
      Alert.alert(
        "✅ Class Created Successfully!",
        `${createClassData.name}\n\n📋 Class Code: ${createClassData.class_code}\n🆔 Class ID: ${createClassData.class_id}\n\n📧 ${createClassData.email}\n📱 ${createClassData.phone}`,
        [
          {
            text: "View Classes",
            onPress: () => router.push("/adminClassSelector"),
          },
        ]
      );
    } catch (err) {
      console.error("Class Creation Error:", err);
      Alert.alert("Error", `Class creation failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
};



  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={60} // adjust this value as needed
    >
      <View style={styles.container}>
        <Text style={styles.title}>Class Registration</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <TextInput style={styles.inputStyle} placeholder="Class Title"  value={title} onChangeText={setTitle}/>
            <TextInput style={styles.inputStyle} placeholder="Class Email" value={email} onChangeText={setEmail}/>
            <TextInput style={styles.inputStyle} placeholder="Contact Number" value={phone} onChangeText={setPhone}/>
            {/* <TextInput style={styles.inputStyle} placeholder="Class Description"  value={description} onChangeText={setDescription}/> */}
          </View>
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </Pressable>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

export default AdminClassRegistration

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center',
    paddingHorizontal: 16,    // Add horizontal padding
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  formContainer: {
    width: 320,               // Fixed width for better appearance
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  inputStyle: {
    backgroundColor: "#f2f2f2",
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 15,
  },
  title: {
    fontSize: 32,             // Slightly smaller for mobile
    fontWeight: 'bold',
    color: '#0c0a0aff',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    color: '#0c0a0aff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
  },
  submitButton: {
    backgroundColor: "#17e95d",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 20,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})