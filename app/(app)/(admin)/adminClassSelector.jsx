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
// import { useClass } from "../../contexts/ClassContext";

// // console.log("🔴 ADMIN CLASS SELECTOR - Mounting");

// const AdminClassSelector = () => {
//   // console.log("🔴 ADMIN CLASS SELECTOR - Rendering");
//   const { apiCall,user,access_token } = useAuth();
//   const { selectClass } = useClass();
  
//   const [classes, setClasses] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const API = Constants.expoConfig.extra.API_URL;

//   // Fetch classes on component mount
//   useEffect(() => {
//     // console.log("🔴 ADMIN CLASS SELECTOR - useEffect ran");
//     fetchClasses();
//   }, []);

//   const fetchClasses = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//         const response = await apiCall(`${API}/admin/classList`, {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         });
//         // console.log("Class Details response:", response);
//         if (response && response.classList) {
//           setClasses(response.classList);
//         } else if (Array.isArray(response)) {
//           setClasses(response);
//         } else {
//           setClasses([]);
//         }
//     } catch (err) {
//       console.error("Error fetching classes:", err);
//       setError("Failed to load classes. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const redirectToClass = (classItem) => {
//     // Navigate to adminHome with full class data
//     // router.push({
//     //   pathname: "/(admin)/(tabs)/adminHome",
//     //   params: { 
//     //     classId: classItem.ID,
//     //     className: classItem.Name,
//     //     classCode: classItem.ClassCode,
//     //     email: classItem.Email,
//     //     phone: classItem.Phone,
//     //   }
//     // });
//     selectClass(classItem);
//     // console.log("From Class Selector You pressed this button ");
//     // console.log("Class details ", classItem);
//     router.push("/(admin)/(tabs)/adminHome");
//   };


//   // Helper function to get unique key for each class
//   const getClassKey = (item) => {
//     return item.ID || item.id || item._id; // handle mixed casing
//   };

//   // Helper function to get class ID
//   const getClassId = (item) => {
//     return item.ID || item.id || item._id; // handle mixed casing
//   };

//   // Helper function to get class name
//   const getClassName = (item) => {
//     return item.Name || item.name || item.className || "Untitled Class"; // handle mixed casing
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#17e95d" />
//         <Text style={styles.loadingText}>Loading classes...</Text>
//       </View>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <View style={styles.centerContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//         <Pressable style={styles.retryButton} onPress={fetchClasses}>
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </Pressable>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
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

//       {/* Create new class button */}
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
//   classDescription: {
//     fontSize: 14,
//     color: "#00695c",
//     marginTop: 5,
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


import { useAuth } from "@/app/contexts/AuthContext";
import Constants from "expo-constants";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useClass } from "../../contexts/ClassContext";

const AdminClassSelector = () => {
  const { apiCall } = useAuth();
  const { selectClass } = useClass();
  // FIX: use safe area insets so content doesn't hide behind camera notch
  const insets = useSafeAreaInsets();
  
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const API = Constants.expoConfig.extra.API_URL;

  useEffect(() => {
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
      if (response && response.classList) {
        setClasses(response.classList);
      } else if (Array.isArray(response)) {
        setClasses(response);
      } else {
        setClasses([]);
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
      setError("Unable to load your classes. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToClass = (classItem) => {
    selectClass(classItem);
    router.push("/(admin)/(tabs)/adminHome");
  };

  const getClassKey = (item) => item.ID || item.id || item._id;
  const getClassName = (item) => item.Name || item.name || item.className || "Untitled Class";

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#17e95d" />
        <Text style={styles.loadingText}>Loading classes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchClasses}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    // FIX: paddingTop from insets ensures content clears the camera notch
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
              key={getClassKey(item)}
              style={styles.classCard}
              onPress={() => redirectToClass(item)}
            >
              <Text style={styles.classText}>
                {getClassName(item)}
              </Text>
              <Text style={styles.classCode}>
                Code: {item.ClassCode || item.classCode || '—'}
              </Text>
              <View style={styles.classDetails}>
                <Text style={styles.classDetailText}>📧 {item.Email || item.email || '—'}</Text>
                <Text style={styles.classDetailText}>📱 {item.Phone || item.phone || '—'}</Text>
              </View>
              <Text style={styles.classDate}>
                Created: {new Date(item.CreatedAt || item.createdAt || item.UpdatedAt || item.updatedAt || Date.now()).toLocaleDateString()}
              </Text>
            </Pressable>
          ))
        )}
      </ScrollView>

      <Link href={"/(admin)/adminClassRegistration"} style={styles.createClassButton}>
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
    marginBottom: 8,
  },
  classCode: {
    fontSize: 14,
    color: "#00796b",
    fontWeight: "600",
    marginBottom: 8,
    backgroundColor: "#b2dfdb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  classDetails: {
    marginTop: 4,
    marginBottom: 8,
  },
  classDetailText: {
    fontSize: 13,
    color: "#00695c",
    marginBottom: 2,
  },
  classDate: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
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
    lineHeight: 24,
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