import { useAuth } from "@/app/contexts/AuthContext";
import { Link, router } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";


const AdminClassSelector = () => {
  const {apiCall} = useAuth();
  const API =  "https://streak-app-uxyv.onrender.com";
  const [classes, setClasses] = React.useState([
    // { id: 1, title: "Math 101" },
    // { id: 2, title: "Physics Basics" },
    // { id: 3, title: "History of India" },
  ]);

  useEffect()

  const redirectToClass = async (classId) => {
    // router.push(`/(admin)/adminHome/${classId}`);
    
    // get awailabe classes and store that in classes
    const getClassDetails = await apiCall(`${API}/admin/classList`,{
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    setClasses = [getClassDetails];

    console.log("Class Details are as follows")
    console.log(getClassDetails);
    router.push(`/(admin)/adminHome/${classId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Classes</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {classes.map((item) => (
          <Pressable
            key={item.id}
            style={styles.classCard}
            onPress={() => redirectToClass(item.id)}
          >
            <Text style={styles.classText}>{item.title}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Create new class button */}
      <Link href={"/adminClassRegistration"} style={styles.createClassButton}>
        <Text style={styles.createClassText}> Register New Class</Text>
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
});
