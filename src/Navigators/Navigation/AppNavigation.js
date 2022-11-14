import React, { useEffect, useState } from 'react'
import { SafeAreaView, StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Home from '@/screen/AppScreen/Home'
import { useTheme } from '@/Hooks'
import { useSelector } from 'react-redux'
import RefillHistory from '@/screen/AppScreen/Refillhistory'
import Selectplan from '@/screen/AppScreen/Selectplan'
import AddMoney from '@/screen/AppScreen/AddMoney'
import Checkout from '@/screen/AppScreen/Checkout'
import PaymentSuccess from '@/screen/AppScreen/PaymentSuccess'
import Profile from '@/screen/AppScreen/Profile'
import CarrierPlans from '@/Components/CarrierPlans'
import UserHistory from '@/Components/History'
import Esim from '@/screen/AppScreen/eSim'
import ChangeCarrier from '@/screen/AppScreen/ChangeCarrier'
import OrderHistory from '@/screen/AppScreen/OrderHistory'

const Stack = createStackNavigator()

const AuthNavigation = () => {
  const theme = useSelector(state => state.theme)
  const user = useSelector(state => state.user)
  const startingScreen = user.perpos === 'Login' ? 'ChangeCarrier' : 'Home'
  // const [startingScreens, setStartingScreen] = useState('')
  // console.log('User.Perpos', user.perpos)
  // console.log('startingScreen', startingScreen)
  const { Layout, NavigationTheme, Common } = useTheme()
  const { colors } = NavigationTheme

  const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  })

  return (
    <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
      <NavigationContainer>
        <StatusBar
          backgroundColor={Common.backgroundPrimary.backgroundColor}
          barStyle={theme.darkMode ? 'light-content' : 'dark-content'}
        />
        <Stack.Navigator
          initialRouteName={startingScreen}
          screenOptions={{
            headerStyle: {
              backgroundColor: Common.backgroundPrimary.backgroundColor,
              height: 70,
            },
            cardStyleInterpolator: forFade,
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen name="ChangeCarrier" component={ChangeCarrier} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="RefillHistory" component={RefillHistory} />
          <Stack.Screen name="Selectplan" component={Selectplan} />
          <Stack.Screen name="AddMoney" component={AddMoney} />
          <Stack.Screen name="Checkout" component={Checkout} />
          <Stack.Screen
            name="PaymentSuccess"
            component={PaymentSuccess}
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen name="CarrierPlans" component={CarrierPlans} />
          <Stack.Screen name="UserHistory" component={UserHistory} />
          <Stack.Screen name="Esim" component={Esim} />
          <Stack.Screen name="OrderHistory" component={OrderHistory} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default AuthNavigation
