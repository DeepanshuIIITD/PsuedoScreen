import { useAuth } from '@/app/contexts/AuthContext';
import { router } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const AdminClassRegistration = () => {

  const [title, setTitle] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');

  // const authContext = useAuth();
  // console.log("AuthContext inside createClass:", authContext);
  // const {user , access_token} = authContext;
  const { apiCall } = useAuth();
  

  // const [description, setDescription] = React.useState('');

  const API =  "https://streak-app-uxyv.onrender.com";

  const handleSubmit = async () => {
  if (!email || !phone || !title) {
    alert("Please fill all fields");
    return;
  }

  try {
    console.log("Creating Class...");

    // const userId = user?.id || user?._id;
    // if (!userId) {
    //             console.log("No user ID found, user object:", user);
    //             throw new Error("User ID not available");
    //         }

    //         if (!access_token) {
    //             console.log("No access token found");
    //             throw new Error("Access token not available");
    //         }

    //         console.log("First import user ki details ");
    //         console.log("user ki id:", userId);
    //         console.log("access token exists:", !!access_token);

    // const createClassResponse = await fetch(`${API}/admin/createClass`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     name: title,
    //     phone,
    //     email,
    //   }),
    // });

    const createClassResponse = await apiCall(`${API}/admin/createClass`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: title,
        phone,
        email,
      }),
    });

    const createClassData = await createClassResponse.json();

    if (!createClassResponse.ok) {
      throw new Error(createClassData.error || createClassData.message ||  "Error creating class");
    }

    console.log("Class Created Successfully:", createClassData);
    alert(`${createClassData.message} with ClassId ${createClassData.class_id}`);
    router.push("/adminClassSelector");
  } catch (err) {
    console.error("Class Creation Error:", err);
    alert(`Class creation failed: ${err.message}`);
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