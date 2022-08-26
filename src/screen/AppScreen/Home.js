import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={{ color: 'black' }}>Home</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})

export default Home
