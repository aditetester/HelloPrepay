import React, { useEffect } from 'react'
import { View, Text, Image, SafeAreaView, BackHandler } from 'react-native'
import { useSelector } from 'react-redux'
import { useTheme } from '@/Hooks'
import Button from '@/Components/UI/Button'
import * as Animatable from 'react-native-animatable'

const PaymentSuccess = ({ navigation, route }) => {
  //NOTE: 1. Define Variables
  const theme = useSelector(state => state.theme)
  const { Common, Layout, Images, Gutters, Fonts } = useTheme()

  //NOTE: 2. Helper Method

  const handleBackButtonClick = () => {
    navigation.navigate('Home')
    return true
  }

  const onContinueHandler = () => {
    navigation.navigate('Home')
  }

  //NOTE: 3. Life Cycle

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

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      )
    }
  }, [])

  //NOTE: 4. Render Method

  return (
    <SafeAreaView style={[Common.backgroundPrimary, Layout.fullHeight]}>
      <View
        style={[
          Common.backgroundPrimary,
          Layout.center,
          Gutters.twentyFourHMargin,
          Gutters.eightyTMargin,
        ]}
      >
        {!theme.darkMode === false ? (
          <Animatable.Image
            animation="rotate"
            duration={2000}
            source={Images.whitecheckcircle}
            style={[
              Gutters.eightyWidth,
              Gutters.eightyHeight,
              Gutters.twentyVMargin,
            ]}
          />
        ) : (
          <Image
            source={Images.checkcircle}
            style={[
              Gutters.eightyWidth,
              Gutters.eightyHeight,
              Gutters.twentyVMargin,
            ]}
          />
        )}

        <Text
          style={[
            Common.primaryBlueMode,
            Fonts.fontSizeRegular,
            Fonts.fontWeightRegular,
            Fonts.fontFamilyPrimary,
            Gutters.twentyVMargin,
          ]}
        >
          Payment successful
        </Text>
        <Text
          style={[
            Fonts.fontSizeSmall,
            Fonts.textCenter,
            Fonts.fontWeightSmall,
            Common.innerText,
            Gutters.twentyVMargin,
            Fonts.fontFamilyPrimary,
          ]}
        >
          Thank you for trusting CarrierApp. Your money will be available
          immediately.
        </Text>
      </View>
      <View
        style={[
          Layout.selfCenter,
          Gutters.fortyBMargin,
          Gutters.twentyMTMargin,
          Gutters.sixtyHeight,
          Gutters.ninetyPWidth,
        ]}
      >
        <Button
          onPress={() => {
            onContinueHandler()
          }}
          title={'Back to Home'}
          size="sm"
          fontSize={Fonts.fontSizeMedium.fontSize}
          backgroundColor={Common.primaryPink.color}
          disabled={false}
        />
      </View>
    </SafeAreaView>
  )
}

export default PaymentSuccess
