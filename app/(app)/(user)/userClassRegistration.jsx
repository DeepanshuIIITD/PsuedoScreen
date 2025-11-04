import { useAuth } from "@/app/contexts/AuthContext";
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
const API = "https://streak-app-uxyv.onrender.com";

const userClassRegistration = () => {

  const [classCode, setClassCode] = React.useState('');
  const {apiCall} = useAuth();
  const redirectToClass = async (code) => {
      // router.push(`/(user)/userHome/${classId}`);
      if(code.trim() === '') {
        alert('Please enter a valid class code');
        return;
      }

      
      console.log("Calling Join Class API ----- @API" , `${API}/user/enroll/${code}`);
      const classResponse = await apiCall(`${API}/user/enroll/${code}`,{
        method : "POST",
        headers: { "Content-Type": "application/json" },
      });

      console.log("USER_CLASS_REGISTRATION , response ", classResponse);

      // router.push(`/(user)/userHome`);          // post "/user/enroll/:id"
      router.replace('/(app)/(user)/userClassEnrolled');
      alert('Successfully joined the class!');
  }
  


  return (
    <View style={styles.container}>
      {/* <Text style ={styles.title}>
        Register a new class here, class detials and all that
      </Text>
      <Link href={"/(user)/userHome"}> 
        <Text style={styles.text} > Users Home Class</Text>
      </Link> */}
      <View style={{alignItems: 'center'}}>
        <Text style ={styles.title}>Class Details</Text>
        <View style={styles.classDetailsContainer}>
            <TextInput 
                style={styles.inputStyle}
                onChangeText={setClassCode}
                value={classCode}
                placeholder="Enter Class Code"
            />
            <Pressable style={styles.submitButton} onPress={() => redirectToClass(classCode)}>
                <Text style={styles.submitText}>Submit</Text>
            </Pressable>
        </View>
      </View>
    </View>
  )
}

export default userClassRegistration


const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7c3c3ff',
    },
    classDetailsContainer: {
        width: '80%',
        backgroundColor: '#f7c3c3ff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
    },
    inputStyle: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    title:{
        fontSize: 42,
        fontWeight: 'bold',
        color: '#0c0a0aff',
        marginBottom: 20,
    },
    text: {
        color: '#0c0a0aff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 30,
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

})