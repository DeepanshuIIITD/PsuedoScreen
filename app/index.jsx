import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const app = () => {
  // state defining for user and admin login
  const [role, setRole] = React.useState('user'); // 'user', 'admin', or 'guest'
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <View style = {styles.container}>
      <View style= {{width: '100%', alignItems: 'center', marginBottom: 20}}>
        <Pressable style = {[styles.selector, {backgroundColor: role ==='user' ? '#51e6ebff' : '#fff'}]} onPress={() => setRole('user')}>
          <Text style={styles.selectorText}> User </Text>
        </Pressable>
        <Pressable style = {[styles.selector, {backgroundColor: role ==='admin' ? '#51e6ebff' : '#fff'}]} onPress={() => setRole('admin')}>
          <Text style={styles.selectorText}> Admin </Text>
        </Pressable>
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
            onChangeText={text=> setPassword(text)}
            value={password}
            placeholder='Password'
          />
        </View>
      <Link href = "/signup">
        <Text style = {styles.link}> New Registration ? Sign up</Text>
      </Link>
      <Link href={"/userClassEnrolled"}>
        <Text style={styles.link} > If successfully login as user</Text>
      </Link>
    <Link href={"/adminClassSelector"}>
        <Text style={styles.link} > If successfully login as admin</Text>
    </Link>
    <Text>Hello, {role}!</Text>
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

})


// how to get mocci shop text in the center of the screen with background image?




