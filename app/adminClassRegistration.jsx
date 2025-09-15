import { router } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const AdminClassRegistration = () => {

  const [title, setTitle] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [timings, setTimings] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleSubmit = () => {
    // Send { title, location, timings, description } to backend
    alert('Class registered successfully!');
    router.push('/(admin)/adminHome');
  }


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
            <TextInput style={styles.inputStyle} placeholder="Location" value={location} onChangeText={setLocation}/>
            <TextInput style={styles.inputStyle} placeholder="Timings" value={timings} onChangeText={setTimings}/>
            <TextInput style={styles.inputStyle} placeholder="Class Description"  value={description} onChangeText={setDescription}/>
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