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
import { scale, verticalScale } from 'react-native-size-matters'

const Stack = createStackNavigator()
const AuthNavigation = () => {
  const theme = useSelector(state => state.theme)
  const startupScreen = useSelector(state => state.user.startupScreen)
  console.log(startupScreen)
  const { Common, Layout, Images } = useTheme()
  return (
    <SafeAreaView style={Layout.fill}>
      <NavigationContainer>
        <StatusBar
          backgroundColor={Common.backgroundPrimary.backgroundColor}
          barStyle={theme.darkMode ? 'light-content' : 'dark-content'}
        />

        <Stack.Navigator
          initialRouteName={startupScreen}
          screenOptions={{
            headerStyle: {
              backgroundColor: Common.backgroundPrimary.backgroundColor,
              height: verticalScale(50),
            },
            headerTitle: () => (
              <Image
                source={Images.Logo}
                style={[{ width: scale(100) }, Common.resizeModeContain]}
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
