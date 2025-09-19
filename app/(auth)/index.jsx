// error = token expired then ( refresh token )


// check phone dynamics and screen layout based on that , home screen button issue


import { Link, router } from 'expo-router';

import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const app = () => {
  // state defining for user and admin login
  const [role, setRole] = React.useState('user'); // 'user', 'admin', or 'guest'
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');

  // Get your computer's IP address - CHANGE THIS TO YOUR ACTUAL IP
  const API_URL = 'http://192.168.29.152:5050';

  //testing function
  const testServerConnection = async () => {
    try {
      console.log('Testing connection to:', API_URL);
      
      const response = await fetch(`${API_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout
        timeout: 10000,
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Server connection successful:', data);
      
      // You can show an alert or update state to indicate success
      alert(`Server connection successful! Status: ${data.status}`);
      
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      
      // Show detailed error information
      alert(`Cannot connect to server. Error: ${error.message}\n\nMake sure:\n1. Server is running on ${API_URL}\n2. Your phone and computer are on the same WiFi\n3. Firewall allows connections on port 5050`);
      
      return false;
    }
  };

  // Login function
  const handleLogin = async () => {
    if (!userName || !password) {
      alert('Please enter both username and password');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userName,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Login successful! Welcome ${data.user.username}`);
        // Navigate based on role
        // You can add navigation logic here
        if(role === 'user'){    // post "/user/signIn"  bearer token async storage 
          router.replace("/(app)/(user)/userClassEnrolled");
        }
        if(role === 'admin'){             // "/admin/signIn"
          router.replace("/(app)/(admin)/adminClassSelector");
        }
      } else {
        alert(`Login failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(`Login failed: ${error.message}`);
    }
  };

  const shortcutLink = () => {
    if(role === "user"){
      router.push("/(user)");
    }
    else if(role ==="admin"){
      router.push("/(admin)");
    }
  };
  return (
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
          />
        </View>
        <View>
          <TextInput style = {styles.inputStyle}
            onChangeText={text => setPassword(text)}
            value={password}
            placeholder='Password'
            secureTextEntry = {true}
          />
        </View>

      {/* Login Button */}
      <Pressable style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </Pressable>

      <Link href = "/(auth)/signup">
        <Text style = {styles.link}> New Registration ? Sign up</Text>
      </Link>
      <Text>Hello, {role}!</Text>

      {/* Test Server Connection Button */}
      <Pressable
        style={styles.testButton}
        onPress={testServerConnection}
      >
        <Text style={styles.testButtonText}>Test Server Connection</Text>
      </Pressable>

      <TouchableOpacity style={styles.testButton} onPress={shortcutLink}>
        <Text style={styles.testButtonText}>Shortcut Button</Text>
      </TouchableOpacity>

    </View>
  )
}

export default app

const styles = StyleSheet.create({
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