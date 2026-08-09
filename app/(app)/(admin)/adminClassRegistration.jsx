import { useAuth } from '@/app/contexts/AuthContext';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const AdminClassRegistration = () => {

  const [title, setTitle] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [workingDaysWeek, setworkingDaysWeek] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { apiCall } = useAuth();
  // const API = 'https://streak-app-production.up.railway.app';
  const API = Constants.expoConfig.extra.API_URL;
  // console.log("🔴 ADMIN CLASS REGISTRATION - Rendering");


  // const USE_MOCK = false; // Toggle mocked createClass API

  const handleSubmit = async () => {
  if (!email || !phone || !title || !workingDaysWeek) {
    alert("Please fill all fields");
    return;
  }

  try {
    const createClassData = await apiCall(`${API}/admin/createClass`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: title, phone, email,  numberOfWorkingDaysInWeek: Number(workingDaysWeek)}),
    });

      // console.log("Class Created Successfully:", createClassData);
      // Show success message with class details
      Alert.alert(
        "✅ Class Created Successfully!",
        `${createClassData.name}\n\n📋 Class Code: ${createClassData.class_code}\n🆔 Class ID: ${createClassData.class_id}\n\n📧 ${createClassData.email}\n📱 ${createClassData.phone}\n
          🗓️ Working Days/Week: ${createClassData.numberOfWorkingDaysInWeek}
        `,
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
            <TextInput style={styles.inputStyle} placeholder="Number of working days" value={workingDaysWeek} onChangeText={setworkingDaysWeek} keyboardType="numeric"/>
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



// import { useAuth } from "@/app/contexts/AuthContext";
// import Constants from "expo-constants";
// import { Link, router } from "expo-router";
// import { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useClass } from "../../contexts/ClassContext";

// const AdminClassSelector = () => {
//   const { apiCall } = useAuth();
//   const { selectClass } = useClass();
//   // FIX: use safe area insets so content doesn't hide behind camera notch
//   const insets = useSafeAreaInsets();
  
//   const [classes, setClasses] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const API = Constants.expoConfig.extra.API_URL;

//   useEffect(() => {
//     fetchClasses();
//   }, []);

//   const fetchClasses = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await apiCall(`${API}/admin/classList`, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });
//       if (response && response.classList) {
//         setClasses(response.classList);
//       } else if (Array.isArray(response)) {
//         setClasses(response);
//       } else {
//         setClasses([]);
//       }
//     } catch (err) {
//       console.error("Error fetching classes:", err);
//       setError("Unable to load your classes. Please check your connection and try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const redirectToClass = (classItem) => {
//     selectClass(classItem);
//     router.push("/(admin)/(tabs)/adminHome");
//   };

//   const getClassKey = (item) => item.ID || item.id || item._id;
//   const getClassName = (item) => item.Name || item.name || item.className || "Untitled Class";

//   if (isLoading) {
//     return (
//       <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
//         <ActivityIndicator size="large" color="#17e95d" />
//         <Text style={styles.loadingText}>Loading classes...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
//         <Text style={styles.errorText}>{error}</Text>
//         <Pressable style={styles.retryButton} onPress={fetchClasses}>
//           <Text style={styles.retryButtonText}>Try Again</Text>
//         </Pressable>
//       </View>
//     );
//   }

//   return (
//     // FIX: paddingTop from insets ensures content clears the camera notch
//     <View style={[styles.container, { paddingTop: insets.top }]}>
//       <Text style={styles.title}>My Classes</Text>

//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {classes.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No classes found.</Text>
//             <Text style={styles.emptySubtext}>
//               Create your first class to get started!
//             </Text>
//           </View>
//         ) : (
//           classes.map((item) => (
//             <Pressable
//               key={getClassKey(item)}
//               style={styles.classCard}
//               onPress={() => redirectToClass(item)}
//             >
//               <Text style={styles.classText}>
//                 {getClassName(item)}
//               </Text>
//               <Text style={styles.classCode}>
//                 Code: {item.ClassCode || item.classCode || '—'}
//               </Text>
//               <View style={styles.classDetails}>
//                 <Text style={styles.classDetailText}>📧 {item.Email || item.email || '—'}</Text>
//                 <Text style={styles.classDetailText}>📱 {item.Phone || item.phone || '—'}</Text>
//               </View>
//               <Text style={styles.classDate}>
//                 Created: {new Date(item.CreatedAt || item.createdAt || item.UpdatedAt || item.updatedAt || Date.now()).toLocaleDateString()}
//               </Text>
//             </Pressable>
//           ))
//         )}
//       </ScrollView>

//       <Link href={"/(admin)/adminClassRegistration"} style={styles.createClassButton}>
//         <Text style={styles.createClassText}>Register New Class</Text>
//       </Link>
//     </View>
//   );
// };

// export default AdminClassSelector;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#f9f9f9",
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f9f9f9",
//     padding: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#0c0a0a",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   classCard: {
//     backgroundColor: "#e0f7fa",
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   classText: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#004d40",
//     marginBottom: 8,
//   },
//   classCode: {
//     fontSize: 14,
//     color: "#00796b",
//     fontWeight: "600",
//     marginBottom: 8,
//     backgroundColor: "#b2dfdb",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//     alignSelf: "flex-start",
//   },
//   classDetails: {
//     marginTop: 4,
//     marginBottom: 8,
//   },
//   classDetailText: {
//     fontSize: 13,
//     color: "#00695c",
//     marginBottom: 2,
//   },
//   classDate: {
//     fontSize: 12,
//     color: "#666",
//     fontStyle: "italic",
//   },
//   createClassButton: {
//     backgroundColor: "#17e95d",
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 10,
//     marginBottom: 30,
//   },
//   createClassText: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: "#666",
//   },
//   errorText: {
//     fontSize: 16,
//     color: "#d32f2f",
//     textAlign: "center",
//     marginBottom: 20,
//     lineHeight: 24,
//   },
//   retryButton: {
//     backgroundColor: "#17e95d",
//     paddingHorizontal: 30,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingTop: 50,
//   },
//   emptyText: {
//     fontSize: 18,
//     color: "#666",
//     fontWeight: "600",
//     marginBottom: 8,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: "#999",
//     textAlign: "center",
//   },
// });