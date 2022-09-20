import React, { useEffect } from 'react'
import { View, Text, Image, SafeAreaView, BackHandler } from 'react-native'
import { useSelector } from 'react-redux'
import { useTheme } from '@/Hooks'
import Button from '@/Components/UI/Button'

const PaymentFailed = ({ navigation, route }) => {
  //NOTE: 1. Define Variables
  //   const params = route.params
  const theme = useSelector(state => state.theme)
  const { Common, Layout, Images, Gutters, Fonts } = useTheme()

  //NOTE: 2. Helper Method
  const onContinueHandler = () => {
    navigation.goBack()
  }

  //NOTE: 3. Render Method
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
        <Text
          style={[
            Common.primaryBlueMode,
            Fonts.fontSizeRegular,
            Fonts.fontWeightRegular,
            Fonts.fontFamilyPrimary,
            Gutters.twentyVMargin,
          ]}
        >
          Order failed
        </Text>
        <Text
          style={[
            Fonts.fontSizeSmall,
            Fonts.textCenter,
            Fonts.fontWeightSmall,
            Common.innerText,
            Fonts.fontFamilyPrimary,
          ]}
        >
          Your payment couldn’t be processed.
        </Text>
        <Text
          style={[
            Fonts.fontSizeSmall,
            Fonts.textCenter,
            Fonts.fontWeightSmall,
            Common.innerText,
            Gutters.thirtyVMargin,
            Fonts.fontFamilyPrimary,
          ]}
        >
          Please check the information you’ve entered is correct or try with a
          different payment method.
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
          title={'Continue'}
          size="sm"
          fontSize={Fonts.fontSizeMedium.fontSize}
          backgroundColor={Common.primaryPink.color}
          disabled={false}
        />
      </View>
    </SafeAreaView>
  )
}

export default PaymentFailed
