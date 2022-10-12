import React, { useState, useEffect } from 'react'
import { View, Appearance, SafeAreaView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import AuthNavigation from '@/Navigators/Navigation/AuthNavigation'
import AppNavigation from '../Navigators/Navigation/AppNavigation'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { changeTheme } from '@/Store/Theme'
import Toast from 'react-native-toast-message'
import { useNetInfo } from '@react-native-community/netinfo'

const StartupContainer = () => {
  const netInfo = useNetInfo()
  const [connection, setConnection] = useState('')
  const { Common, Layout } = useTheme()
  const user = useSelector(state => state.user)
  const colorScheme = Appearance.getColorScheme()
  const dispatch = useDispatch()

  const { t } = useTranslation()

  useEffect(() => {
    if (netInfo.isConnected === false) {
      errorToast()
      setConnection(false)
    }
  }, [netInfo.isConnected])

  useEffect(() => {
    if (connection === false && netInfo.isConnected === true) {
      successToast()
      setConnection(true)
    }
  }, [connection, netInfo.isConnected])

  const errorToast = () => {
    Toast.show({
      type: 'error',
      text1: 'No connection',
      text2: 'No Internet Connection',
      autoHide: true,
      visibilityTime: 4000,
      topOffset: 15,
    })
  }
  const successToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Back Online',
      text2: 'You Are Connected',
      autoHide: true,
      visibilityTime: 4000,
      topOffset: 15,
    })
  }
  useEffect(() => {
    if (colorScheme === 'dark') {
      dispatch(changeTheme({ darkMode: true }))
    } else {
      dispatch(changeTheme({ darkMode: false }))
    }
  }, [colorScheme])

  return (
    <SafeAreaView style={[Layout.fill]}>
      <View style={[Common.backgroundPrimary, Layout.fill]}>
        {!user.isAuth ? <AuthNavigation /> : <AppNavigation />}
        <Toast
          ref={ref => {
            Toast.setRef(ref)
          }}
        />
      </View>
    </SafeAreaView>
  )
}

export default StartupContainer
