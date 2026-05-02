import { Link } from 'expo-router';
import React, { useContext } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// importing login element
import Constants from "expo-constants";
import { AuthContext } from '../contexts/AuthContext';

// console.log("Index file mounting");
const app = () => {
  // console.log("Index file rendering");
  // state defining for user and admin login
  const [role, setRole] = React.useState('user'); // 'user', 'admin', or 'guest'
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const insets = useSafeAreaInsets();
  const API = Constants.expoConfig.extra.API_URL;

  // new claude suggestions
  const [isLoggingIn, setIsLoggingIn] = React.useState(false); // Add this

  const { login, isLoading } = useContext(AuthContext); // Get isLoading

  const handleLogin = async () => {

    if (isLoggingIn) return; // Prevent multiple calls
    setIsLoggingIn(true);

    const res = await login(role,userName, password);
    // console.log(res.role);
    console.log("Login response:", res);
    if(res.success){
      console.log("Login Successfully");
    }
    else{
      alert(res.error);
    }
  };

  // Show loading screen while auth is being checked
  if (isLoading) {
    return (
      <View style={[styles.safeContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading...</Text>
      </View>
    );
  }
  


  return (
    <View style={[styles.safeContainer, {paddingTop: insets.top}]}>
    <View style = {styles.container}>
      <View style= {{width: '100%', alignItems: 'center', marginBottom: 20}}>
        <TouchableOpacity style = {[styles.selector, {backgroundColor: role ==='user' ? '#51e6ebff' : '#fff'}]} onPress={() => setRole('user')}>
          <Text style={styles.selectorText}> User </Text>
        </TouchableOpacity>
        <TouchableOpacity style = {[styles.selector, {backgroundColor: role ==='admin' ? '#51e6ebff' : '#fff'}]} onPress={() => setRole('admin')}>
          <Text style={styles.selectorText}> Admin </Text>
        </TouchableOpacity>
      </View>
        <View>
          <TextInput style = {styles.inputStyle}
            onChangeText={text=> setUserName(text)}
            value={userName}
            placeholder='Username'
            placeholderTextColor={'#687076'}
          />
        </View>
        <View>
          <TextInput style = {styles.inputStyle}
            onChangeText={text => setPassword(text)}
            value={password}
            placeholder='Password'
            secureTextEntry = {true}
            placeholderTextColor={'#687076'}
          />
        </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Link href = "/(auth)/signup">
        <Text style = {styles.link}> New Registration ? Sign up</Text>
      </Link>

      <Link href = "/(auth)/forgotPassword">
        <Text style = {styles.forgotPasswordLink}> Forgot Password ? Reset here</Text>
      </Link>
      {/* <Text>Hello, {role}!</Text> */}
    </View>
    </View>
  )
}

export default app

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "lightgold",
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#922f2fff',
  },
  text:{
    color: '#c7babaff',
    textAlign: 'center',
    // alignContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontWeight: 'bold',
    fontSize: 30,
    // backgroundColor: 'rgba(15, 14, 14, 0.5)',
    // marginBottom: 20,
  },
  link:{
    color: '#da407dff',
    textAlign: 'center',
    textDecorationLine: 'underline',
    textDecorationColor: '#3838bcff',
    marginVertical: 5,
  },
  forgotPasswordLink:{
    color: '#3838bcff',
    textAlign: 'right',
    textDecorationLine: 'underline',
    textDecorationColor: '#3838bcff',
    marginVertical: 5,
    width: 250, 
  },
  selector:{
    // backgroundColor: '#51e6ebff',
    width: '50%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom : 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  selectorText:{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0c0a0aff',
  },
  inputStyle:{
    backgroundColor: '#ffffffaa',
    width: 300,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  inputTextStyle:{
    fontSize: 18,
    fontWeight: 'bold',
    color: '#040403e8',
  },
  loginButton: {
    backgroundColor: '#51e6ebff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 15,
  },
  loginButtonText: {
    color: '#0c0a0aff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  testButton: {
    backgroundColor: '#ff9500',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  testButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
})



