import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { useTheme } from '@/Hooks'

const RefillHistory = ({ navigation, route }) => {
  const params = route.params
  const theme = useSelector(state => state.theme)
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

  const onBackHandler = () => {
    navigation.goBack()
  }

  return (
    <View style={[Layout.fill, Common.backgroundPrimary]}>
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
      <View style={[Layout.center, Layout.fill]}>
        <Text style={[Common.normalText, Fonts.fontFamilyPrimary]}>
          Refill Transaction Id is {params.refillTransactionId}
        </Text>
      </View>
    </View>
  )
}

export default RefillHistory
