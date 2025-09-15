import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const explore = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Explore Screen</Text>
    </View>
  )
}

export default explore


const styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#922f2fff',
  },
  text: {
    color: '#0c0a0aff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
  },

})