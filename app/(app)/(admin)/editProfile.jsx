// import {API} from '@env';
import { useAuth } from '@/app/contexts/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const USE_MOCK = true; // Toggle mocked profile update

const EditProfile = () => {
  const { user, apiCall } = useAuth();
  const insets = useSafeAreaInsets();
  
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const API = 'https://streak-app-production.up.railway.app';

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      if (USE_MOCK) {
        // Expected backend API (commented)
        // PUT `${API}/user/profile`
        // Body:
        // { "firstName": string, "lastName": string, "email"?: string, "phone"?: string }
        // Response 200:
        // { "user": { "id": string, "firstName": string, "lastName": string, "email": string, "phone": string } }
        await new Promise(res => setTimeout(res, 500));
        Alert.alert("Success", "Profile updated successfully!", [ { text: "OK", onPress: () => router.back() } ]);
      } else {
        await apiCall(`${API}/user/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName, lastName, email, phone })
        });
        Alert.alert("Success", "Profile updated successfully!", [ { text: "OK", onPress: () => router.back() } ]);
      }
    } catch (e) {
      Alert.alert("Error", e.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer}>
        {/* Profile Picture Section */}
        <View style={styles.profilePictureSection}>
          <View style={styles.profilePictureContainer}>
            {/* TODO: Replace with actual image when backend supports profile pictures */}
            {/* {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : ( */}
              <View style={styles.profileImagePlaceholder}>
                <MaterialCommunityIcons name="account-circle" size={80} color="#9ca3af" />
              </View>
            {/* )} */}
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={() => {
                // TODO: Implement image picker when backend is ready
                Alert.alert("Coming Soon", "Profile picture upload will be available soon");
              }}
            >
              <MaterialCommunityIcons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.changePictureButton}
            onPress={() => {
              // TODO: Implement image picker when backend is ready
              Alert.alert("Coming Soon", "Profile picture upload will be available soon");
            }}
          >
            <Text style={styles.changePictureText}>Change Picture</Text>
          </TouchableOpacity>
          <Text style={styles.pictureHint}>
            Tap to upload a profile picture (feature coming soon)
          </Text>
        </View>

        {/* Form Fields */}
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
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  placeholder: {
    width: 40,
  },
  screen: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  profilePictureSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  profilePictureContainer: {
    position: "relative",
    marginBottom: 12,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#e5e7eb",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#e5e7eb",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2563eb",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  changePictureButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#e0f2fe",
    marginBottom: 8,
  },
  changePictureText: {
    color: "#0284c7",
    fontWeight: "600",
    fontSize: 14,
  },
  pictureHint: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    fontStyle: "italic",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#111827",
  },
  saveButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

