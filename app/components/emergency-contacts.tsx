import { StyleSheet, Text, } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

const EmergencyContacts = () => {
  return (
      <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
        <Text>EmergencyContacts</Text>
            </SafeAreaView>
        </SafeAreaProvider>
  )
}

export default EmergencyContacts

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})