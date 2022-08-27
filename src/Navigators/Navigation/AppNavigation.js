import React from 'react'
import { SafeAreaView, StatusBar, Image } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Home from '@/screen/AppScreen/Home'
import { useTheme } from '@/Hooks'
import { navigationRef } from '../utils'
import { useSelector } from 'react-redux'

const Stack = createStackNavigator()
const AuthNavigation = () => {
  const theme = useSelector(state => state.theme)
  const { Layout, darkMode, NavigationTheme, Images, Gutters, Common } =
    useTheme()
  const { colors } = NavigationTheme
  return (
    <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
      <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
        <StatusBar
          backgroundColor={Common.backgroundPrimary.backgroundColor}
          barStyle={theme.darkMode ? 'light-content' : 'dark-content'}
        />
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: Common.backgroundPrimary.backgroundColor,
              height: 70,
            },
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen name="Start" component={Home} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default AuthNavigation
