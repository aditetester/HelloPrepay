import React, { useEffect } from 'react'
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Appearance,
  SafeAreaView,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/Hooks'
import { Brand } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import AuthNavigation from '@/Navigators/Navigation/AuthNavigation'
import AppNavigation from '../Navigators/Navigation/AppNavigation'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { changeTheme } from '@/Store/Theme'

const StartupContainer = () => {
  const { Common } = useTheme()
  const user = useSelector(state => state.user)
  const colorScheme = Appearance.getColorScheme()
  const dispatch = useDispatch()

  const { t } = useTranslation()

  // const init = async () => {
  //   await new Promise(resolve =>
  //     setTimeout(() => {
  //       resolve(true)
  //     }, 2000),
  //   )
  //   await setDefaultTheme({ theme: 'default', darkMode: false })
  // }

  // useEffect(() => {
  //   init()
  //   console.log(Appearance.getColorScheme())
  // })

  if (colorScheme === 'dark') {
    dispatch(changeTheme({ darkMode: true }))
  } else {
    dispatch(changeTheme({ darkMode: false }))
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.container, Common.backgroundPrimary]}>
        {!user.isAuth ? <AuthNavigation /> : <AppNavigation />}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  textCenter: {
    color: 'black',
  },
})

export default StartupContainer
