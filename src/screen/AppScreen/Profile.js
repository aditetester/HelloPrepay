import React, { useEffect } from 'react'
import { View, Text, Image, SafeAreaView, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme } from '@/Hooks'
import Button from '@/Components/UI/Button'
import { setUser } from '@/Store/User'
import auth from '@react-native-firebase/auth'

const Profile = ({ navigation, route }) => {
  //   const params = route.params
  const theme = useSelector(state => state.theme)
  const dispatch = useDispatch()
  const { Common, Layout, Images, Gutters, Fonts } = useTheme()

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerStyle: {
        backgroundColor: Common.backgroundPrimary.backgroundColor,
        height: 70,
      },
      headerTitle: () =>
        !theme.darkMode ? (
          <Image
            source={Images.whiteThemeLogo}
            style={[{ resizeMode: 'contain' }, Gutters.headerWidthWidth]}
          />
        ) : (
          <Image
            source={Images.darkThemeLogo}
            style={[
              { resizeMode: 'contain' },
              Gutters.headerHeight,
              Gutters.headerWidthWidth,
            ]}
          />
        ),

      headerTitleAlign: 'center',
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    })
  }, [navigation, theme])

  const onLogoutHandler = async () => {
    auth()
      .signOut()
      .then(dispatch(setUser({ isAuth: false })))
      .catch(err => console.log(err))
  }

  const onBackHandler = () => {
    navigation.goBack()
  }

  return (
    <SafeAreaView style={[Common.backgroundPrimary, Layout.fill]}>
      <TouchableOpacity
        style={[Gutters.fifteenPWidth, Gutters.fiveTMargin, Gutters.tenHMargin]}
        onPress={onBackHandler}
      >
        {!theme.darMode ? (
          <Image source={Images.greyLeftArrow} />
        ) : (
          <Image source={Images.whiteLeftArrow} />
        )}
      </TouchableOpacity>
      <View
        style={[
          Layout.selfCenter,
          Layout.center,
          Gutters.ninetyPWidth,
          Gutters.fiftyHeight,
          Gutters.twofivezeroTMargin,
        ]}
      >
        <Button
          onPress={onLogoutHandler}
          title={'Logout'}
          size="sm"
          fontSize={Fonts.fontSizeMedium.fontSize}
          backgroundColor={'red'}
          disabled={false}
        />
      </View>
    </SafeAreaView>
  )
}

export default Profile
