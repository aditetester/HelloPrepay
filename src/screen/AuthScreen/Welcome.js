import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
const Welcome = () => {
  return (
    <View style={styles.container}>
      <Text style={{ color: 'black' }}>Welcome</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})

export default Welcome
