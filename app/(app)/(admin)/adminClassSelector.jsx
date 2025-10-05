// import { useAuth } from "@/app/contexts/AuthContext";
// import { Link, router } from "expo-router";
// import React, { useEffect } from "react";
// import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

// console.log("🔴 ADMIN CLASS SELECTOR - Mounting");
// const AdminClassSelector = () => {
//   console.log("🔴 ADMIN CLASS SELECTOR - Rendering");
//   const {apiCall} = useAuth();
//   const API =  "https://streak-app-uxyv.onrender.com";
//   const [classes, setClasses] = React.useState([
//     // { id: 1, title: "Math 101" },
//     // { id: 2, title: "Physics Basics" },
//     // { id: 3, title: "History of India" },
//   ]);

//   useEffect(() => {
//     console.log("🔴 ADMIN CLASS SELECTOR - useEffect ran");
//   }, []);

//   const redirectToClass = async (classId) => {
//     // router.push(`/(admin)/adminHome/${classId}`);
    
//     // get awailabe classes and store that in classes
//     const getClassDetails = await apiCall(`${API}/admin/classList`,{
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     });

//     console.log("Class Details are as follows")

//     router.push(`/(admin)/adminHome`);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>My Classes</Text>

//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {classes.map((item) => (
//           <Pressable
//             key={item.id}
//             style={styles.classCard}
//             onPress={() => redirectToClass(item.id)}
//           >
//             <Text style={styles.classText}>{item.title}</Text>
//           </Pressable>
//         ))}
//       </ScrollView>

//       {/* Create new class button */}
//       <Link href={"/adminClassRegistration"} style={styles.createClassButton}>
//         <Text style={styles.createClassText}> Register New Class</Text>
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
// });



import { useAuth } from "@/app/contexts/AuthContext";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

console.log("🔴 ADMIN CLASS SELECTOR - Mounting");

const AdminClassSelector = () => {
  console.log("🔴 ADMIN CLASS SELECTOR - Rendering");
  const { apiCall } = useAuth();
  const API = "https://streak-app-uxyv.onrender.com";
  
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch classes on component mount
  useEffect(() => {
    console.log("🔴 ADMIN CLASS SELECTOR - useEffect ran");
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiCall(`${API}/admin/classList`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      console.log("Class Details response:", response);

      // Assuming the response has a classList property
      if (response && response.classList) {
        setClasses(response.classList);
      } else {
        // If the response structure is different, adjust accordingly
        setClasses(response);
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Failed to load classes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToClass = (classId) => {
    // Navigate to specific class page
    router.push(`/(admin)/adminHome/${classId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#17e95d" />
        <Text style={styles.loadingText}>Loading classes...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchClasses}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Classes</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {classes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No classes found.</Text>
            <Text style={styles.emptySubtext}>
              Create your first class to get started!
            </Text>
          </View>
        ) : (
          classes.map((item) => (
            <Pressable
              key={item.id || item._id}
              style={styles.classCard}
              onPress={() => redirectToClass(item.id || item._id)}
            >
              <Text style={styles.classText}>
                {item.title || item.name || item.className || "Untitled Class"}
              </Text>
              {item.description && (
                <Text style={styles.classDescription}>{item.description}</Text>
              )}
            </Pressable>
          ))
        )}
      </ScrollView>

      {/* Create new class button */}
      <Link href={"/adminClassRegistration"} style={styles.createClassButton}>
        <Text style={styles.createClassText}>Register New Class</Text>
      </Link>
    </View>
  );
};

export default AdminClassSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0c0a0a",
    marginBottom: 20,
    textAlign: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  classCard: {
    backgroundColor: "#e0f7fa",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
  classText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#004d40",
  },
  classDescription: {
    fontSize: 14,
    color: "#00695c",
    marginTop: 5,
  },
  createClassButton: {
    backgroundColor: "#17e95d",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  createClassText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#17e95d",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});