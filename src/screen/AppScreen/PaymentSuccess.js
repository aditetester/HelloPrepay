import React, { useEffect } from 'react'
import { View, Text, Image, SafeAreaView, BackHandler } from 'react-native'
import { useSelector } from 'react-redux'
import { useTheme } from '@/Hooks'
import { Button } from '@rneui/themed'
import * as Animatable from 'react-native-animatable'
import { scale, verticalScale } from 'react-native-size-matters'

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
        <Animatable.Image
          animation="bounceIn"
          duration={2000}
          source={Images.checkCircle}
          style={[
            Gutters.eightyWidth,
            Gutters.eightyHeight,
            Gutters.twentyVMargin,
          ]}
        />

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
          title="Back to Home"
          loading={false}
          onPress={() => {
            onContinueHandler()
          }}
          loadingProps={[{ size: 'small' }, Common.whiteColor]}
          titleStyle={[Fonts.fontWeightRegular, Fonts.fontFamilyPrimary]}
          buttonStyle={[
            Common.primaryPinkBackground,
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

export default PaymentSuccess
