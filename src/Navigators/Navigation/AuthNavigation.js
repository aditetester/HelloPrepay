import React from 'react'
import { SafeAreaView, StatusBar, Image } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Tutorial from '@/screen/AuthScreen/Tutorial'
import { useTheme } from '@/Hooks'
import Login from '@/screen/AuthScreen/Login'
import { useSelector } from 'react-redux'
import SelectCarrier from '@/screen/AuthScreen/SelectCarrier'
import Otp from '@/screen/AuthScreen/Otp'
import EnterMobileNumber from '@/screen/AuthScreen/MobileNumber'
import About from '@/screen/AuthScreen/About'
import Welcome from '@/screen/AuthScreen/Welcome'

const Stack = createStackNavigator()
const AuthNavigation = () => {
  const theme = useSelector(state => state.theme)
  const { Common, Layout, Images } = useTheme()
  return (
    <SafeAreaView style={Layout.fill}>
      <NavigationContainer>
        <StatusBar
          backgroundColor={Common.backgroundPrimary.backgroundColor}
          barStyle={theme.darkMode ? 'light-content' : 'dark-content'}
        />

        <Stack.Navigator
          initialRouteName="Tutorial"
          screenOptions={{
            headerStyle: {
              backgroundColor: Common.backgroundPrimary.backgroundColor,
              height: 70,
            },
            headerTitle: () => (
              <Image
                source={Images.Logo}
                style={{
                  width: 139.13,
                  height: '100%',
                  alignSelf: 'center',
                  resizeMode: 'contain',
                }}
              />
            ),
            headerTitleAlign: 'center',
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Tutorial" component={Tutorial} />
          <Stack.Screen name="Otp" component={Otp} />
          <Stack.Screen name="SelectCarrier" component={SelectCarrier} />
          <Stack.Screen
            name="EnterMobileNumber"
            component={EnterMobileNumber}
          />
          <Stack.Screen name="About" component={About} />
          <Stack.Screen name="Welcome" component={Welcome} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default AuthNavigation
