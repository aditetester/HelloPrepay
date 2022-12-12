import React, { useEffect } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { useTheme } from '@/Hooks'

const RefillHistory = ({ navigation, route }) => {
  //#region NOTE: 1. Define Variables
  const params = route.params
  const theme = useSelector(state => state.theme)
  const { Common, Layout, Images, Gutters, Fonts } = useTheme()

  //#endregion

  //#region NOTE: 2. Helper Method

  const onBackHandler = () => {
    navigation.goBack()
  }

  //#endregion

  //#region NOTE: 3. Life Cycle

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
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
    })
  }, [navigation, theme])

  //#endregion

  //NOTE: 4. Render Method

  return (
    <View style={[Layout.fill, Common.backgroundPrimary]}>
      <TouchableOpacity
        style={[Gutters.fifteenPWidth, Gutters.fiveTMargin, Gutters.tenHMargin]}
        onPress={onBackHandler}
      >
        <Image source={Images.LeftArrow} />
      </TouchableOpacity>
      <View style={[Layout.center, Layout.fill]}>
        <Text style={[Common.normalText, Fonts.fontFamilyPrimary]}>
          Refill Transaction Id is {params.refillTransactionId}
        </Text>
      </View>
    </View>
  )
}

export default RefillHistory
