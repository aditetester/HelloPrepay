import React, { useEffect } from 'react'
import { View, Image, SafeAreaView, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme } from '@/Hooks'
import { Button } from '@rneui/themed'
import { setUser } from '@/Store/User'

const Profile = ({ navigation, route }) => {
  //NOTE: 1. Define Variables
  //   const params = route.params
  const theme = useSelector(state => state.theme)
  const dispatch = useDispatch()
  const { Common, Layout, Images, Gutters, Fonts } = useTheme()

  //NOTE: 2. Helper Method

  const onLogoutHandler = async () => {
    dispatch(setUser({ userData: null, isAuth: false }))
  }

  const onBackHandler = () => {
    navigation.goBack()
  }

  //NOTE: 3. Life Cycle

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerStyle: {
        backgroundColor: Common.backgroundPrimary.backgroundColor,
        height: 70,
      },
      headerTitle: () => (
        <Image
          source={Images.Logo}
          style={[Gutters.headerWidthWidth, Common.resizeModeContain]}
        />
      ),

      headerTitleAlign: 'center',
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    })
  }, [navigation, theme])

  //NOTE: 4. Render Method

  return (
    <SafeAreaView style={[Common.backgroundPrimary, Layout.fill]}>
      <TouchableOpacity
        style={[Gutters.fifteenPWidth, Gutters.fiveTMargin, Gutters.tenHMargin]}
        onPress={onBackHandler}
      >
        <Image source={Images.LeftArrow} />
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
          title="Logout"
          loading={false}
          onPress={onLogoutHandler}
          loadingProps={[{ size: 'small' }, Common.whiteColor]}
          titleStyle={[Fonts.fontWeightRegular, Fonts.fontFamilyPrimary]}
          buttonStyle={[
            Common.errorBackground,
            Gutters.fiftyfiveHeight,
            Common.borderRadius,
          ]}
          containerStyle={[
            Gutters.ninetyfivePWidth,
            Gutters.twentyTMargin,
            Layout.selfCenter,
            Common.borderRadius,
          ]}
        />
      </View>
    </SafeAreaView>
  )
}

export default Profile
