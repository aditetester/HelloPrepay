import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
} from 'react-native'
import { useTheme } from '@/Hooks'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button } from '@rneui/themed'

const AddMoney = ({ navigation, route }) => {
  //NOTE: 1. Define Variables
  let params = route.params
  console.log('🚀 ~ file: AddMoney.js ~ line 18 ~ AddMoney ~ params', params)
  const { Common, Images, Layout, Gutters, Fonts } = useTheme()
  const theme = useSelector(state => state.theme)

  const [keyValue, setKeyvalue] = useState('')
  const [numFormat, setNumFormat] = useState('')
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(keyValue)

  //NOTE: 2. Helper Method

  const onContinueHandler = () => {
    navigation.navigate('Checkout', {
      amount: numFormat,
      phone_number: params.phone_number,
      formattedNumber: params.formattedNumber,
    })
    return
  }

  const onKeyPress = key => {
    if (
      keyValue.split('.')[1] !== undefined &&
      keyValue.split('.')[1].length === 2
    ) {
      return
    }
    if (keyValue.length < 1 && key === '.') {
      return
    }
    if (key === '.' && keyValue.includes('.')) {
      return
    }
    setKeyvalue(() => keyValue.concat(key.toString()))
  }

  const onDeleteValue = () => {
    setKeyvalue(keyValue.slice(0, -1))
  }

  const onBackHandler = () => {
    navigation.goBack()
  }

  //NOTE: 3. Life Cycle

  useEffect(() => {
    setNumFormat(format)
  }, [format])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerStyle: {
        backgroundColor: Common.backgroundPrimary.backgroundColor,
        height: 70,
      },
      headerTitle: () => (
        <Image
          style={[Gutters.headerWidthWidth, Common.resizeModeContain]}
          source={Images.Logo}
        />
      ),

      headerTitleAlign: 'center',
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    })
  }, [navigation, theme])

  //NOTE: 4. Render Method

  return (
    <SafeAreaView style={[Layout.fill, Common.backgroundPrimary]}>
      <View style={Layout.fill}>
        <TouchableOpacity
          style={[
            Gutters.fifteenPWidth,
            Gutters.fiveTMargin,
            Gutters.tenHMargin,
          ]}
          onPress={onBackHandler}
        >
          <Image source={Images.LeftArrow} />
        </TouchableOpacity>
        <View
          style={[
            Layout.alignItemsCenter,
            Gutters.tenVMargin,
            Gutters.fivePadding,
            Layout.flexSix,
          ]}
        >
          <Text
            style={[
              Common.titleText,
              Fonts.fontWeightRegular,
              Fonts.fontSizeLarge,
              Fonts.fontFamilyPrimary,
            ]}
          >
            How much you
          </Text>
          <Text
            style={[
              Common.titleText,
              Fonts.fontWeightRegular,
              Fonts.fontSizeLarge,
              Fonts.fontFamilyPrimary,
            ]}
          >
            want to add?
          </Text>
        </View>

        <View
          style={[
            Common.textColor,
            Layout.row,
            Layout.flexThree,
            Layout.alignItemsCenter,
            Layout.justifyContentAround,
            Gutters.twentyVMargin,
            Gutters.eightyPWidth,
            Layout.selfCenter,
          ]}
        >
          <Text
            style={[
              Common.titleText,
              Fonts.fontWeightSmall,
              Fonts.fontSizeLarge,
              Fonts.fontFamilyPrimary,
            ]}
          >
            {numFormat}
          </Text>
        </View>

        <View
          style={[
            Gutters.ninetyPWidth,
            Gutters.tenPadding,
            Layout.justifyContentCenter,
            Layout.selfCenter,
            Layout.flexEighteen,
          ]}
        >
          <View style={[Layout.row, Layout.justifyContentBetween, Layout.fill]}>
            <Pressable
              style={({ pressed }) => [
                Common.borderRadius,
                Layout.fill,
                Layout.center,
                Gutters.twentyninePWidth,
                Gutters.eightyfivePHeight,
                Gutters.tenVMargin,
                Gutters.tenHMargin,
                // !pressed && Common.offWhiteBackground,
                !pressed && Common.keyboardBackGround,
                pressed && Common.primaryPinkBackground,
              ]}
              onPress={() => onKeyPress(1)}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    pressed && Common.white,
                    Fonts.fontSizeRegular,
                    Fonts.fontFamilyPrimary,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.keyboardText,
                  ]}
                >
                  1
                </Text>
              )}
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                pressed && Common.primaryPinkBackground,
                Gutters.twentyninePWidth,
                Gutters.eightyfivePHeight,
                Layout.fill,
                !pressed && Common.keyboardBackGround,
                // !pressed && Common.offWhiteBackground,
                Common.borderRadius,
                Layout.center,
                Gutters.tenVMargin,
                Gutters.tenHMargin,
              ]}
              onPress={() => onKeyPress(2)}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    pressed && Common.white,
                    Fonts.fontSizeRegular,
                    Fonts.fontFamilyPrimary,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.keyboardText,
                  ]}
                >
                  2
                </Text>
              )}
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                pressed && Common.primaryPinkBackground,
                Gutters.twentyninePWidth,
                Gutters.eightyfivePHeight,
                Layout.fill,
                !pressed && Common.keyboardBackGround,
                Common.borderRadius,
                Layout.center,
                Gutters.tenVMargin,
                Gutters.tenHMargin,
              ]}
              onPress={() => onKeyPress(3)}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    pressed && Common.white,
                    Fonts.fontSizeRegular,
                    Fonts.fontFamilyPrimary,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.keyboardText,
                  ]}
                >
                  3
                </Text>
              )}
            </Pressable>
          </View>
          <View style={[Layout.row, Layout.justifyContentBetween, Layout.fill]}>
            <Pressable
              style={({ pressed }) => [
                pressed && Common.primaryPinkBackground,
                Gutters.twentyninePWidth,
                Gutters.eightyfivePHeight,
                Layout.fill,
                !pressed && Common.keyboardBackGround,
                Common.borderRadius,
                Layout.center,
                Gutters.tenVMargin,
                Gutters.tenHMargin,
              ]}
              onPress={() => onKeyPress(4)}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    pressed && Common.white,
                    Fonts.fontSizeRegular,
                    Fonts.fontFamilyPrimary,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.keyboardText,
                  ]}
                >
                  4
                </Text>
              )}
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                pressed && Common.primaryPinkBackground,
                Gutters.twentyninePWidth,
                Gutters.eightyfivePHeight,
                Layout.fill,
                !pressed && Common.keyboardBackGround,
                Common.borderRadius,
                Layout.center,
                Gutters.tenVMargin,
                Gutters.tenHMargin,
              ]}
              onPress={() => onKeyPress(5)}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    pressed && Common.white,
                    Fonts.fontSizeRegular,
                    Fonts.fontFamilyPrimary,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.keyboardText,
                  ]}
                >
                  5
                </Text>
              )}
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                pressed && Common.primaryPinkBackground,
                Gutters.twentyninePWidth,
                Gutters.eightyfivePHeight,
                Layout.fill,
                !pressed && Common.keyboardBackGround,
                Common.borderRadius,
                Layout.center,
                Gutters.tenVMargin,
                Gutters.tenHMargin,
              ]}
              onPress={() => onKeyPress(6)}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    pressed && Common.white,
                    Fonts.fontSizeRegular,
                    Fonts.fontFamilyPrimary,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.keyboardText,
                  ]}
                >
                  6
                </Text>
              )}
            </Pressable>
          </View>
          <View style={[Layout.row, Layout.justifyContentBetween, Layout.fill]}>
            <Pressable
              style={({ pressed }) => [
                pressed && Common.primaryPinkBackground,
                Gutters.twentyninePWidth,
                Gutters.eightyfivePHeight,
                Layout.fill,
                !pressed && Common.keyboardBackGround,
                Common.borderRadius,
                Layout.center,
                Gutters.tenVMargin,
                Gutters.tenHMargin,
              ]}
              onPress={() => onKeyPress(7)}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    pressed && Common.white,
                    Fonts.fontSizeRegular,
                    Fonts.fontFamilyPrimary,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.keyboardText,
                  ]}
                >
                  7
                </Text>
              )}
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                pressed && Common.primaryPinkBackground,
                Gutters.twentyninePWidth,
                Gutters.eightyfivePHeight,
                Layout.fill,
                !pressed && Common.keyboardBackGround,
                Common.borderRadius,
                Layout.center,
                Gutters.tenVMargin,
                Gutters.tenHMargin,
              ]}
              onPress={() => onKeyPress(8)}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    pressed && Common.white,
                    Fonts.fontSizeRegular,
                    Fonts.fontFamilyPrimary,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.keyboardText,
                  ]}
                >
                  8
                </Text>
              )}
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                pressed && Common.primaryPinkBackground,
                Gutters.twentyninePWidth,
                Gutters.eightyfivePHeight,
                Layout.fill,
                !pressed && Common.keyboardBackGround,
                Common.borderRadius,
                Layout.center,
                Gutters.tenVMargin,
                Gutters.tenHMargin,
              ]}
              onPress={() => onKeyPress(9)}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    pressed && Common.white,
                    Fonts.fontSizeRegular,
                    Fonts.fontFamilyPrimary,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.keyboardText,
                  ]}
                >
                  9
                </Text>
              )}
            </Pressable>
          </View>
          <View style={[Layout.row, Layout.justifyContentBetween, Layout.fill]}>
            <Pressable
              style={({ pressed }) => [
                pressed && Common.primaryPinkBackground,
                Gutters.twentyninePWidth,
                Gutters.eightyfivePHeight,
                Layout.fill,
                !pressed && Common.keyboardBackGround,
                Common.borderRadius,
                Layout.center,
                Gutters.tenVMargin,
                Gutters.tenHMargin,
              ]}
              onPress={() => onKeyPress(0)}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    pressed && Common.white,
                    Fonts.fontSizeRegular,
                    Fonts.fontFamilyPrimary,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.keyboardText,
                  ]}
                >
                  0
                </Text>
              )}
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                pressed && Common.primaryPinkBackground,
                Gutters.twentyninePWidth,
                Gutters.eightyfivePHeight,
                Layout.fill,
                !pressed && Common.keyboardBackGround,
                Common.borderRadius,
                Layout.center,
                Gutters.tenVMargin,
                Gutters.tenHMargin,
              ]}
              onPress={() => onKeyPress('.')}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    pressed && Common.white,
                    Fonts.fontSizeRegular,
                    Fonts.fontFamilyPrimary,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.keyboardText,
                  ]}
                >
                  .
                </Text>
              )}
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                pressed && Common.primaryPinkBackground,
                Gutters.twentyninePWidth,
                Gutters.eightyfivePHeight,
                Layout.fill,
                !pressed && Common.keyboardBackGround,
                Common.borderRadius,
                Layout.center,
                Gutters.tenVMargin,
                Gutters.tenHMargin,
              ]}
              onPress={onDeleteValue}
            >
              {({ pressed }) => (
                <Image
                  source={Images.delete}
                  style={[
                    Gutters.thirtyHeight,
                    Gutters.thirtyWidth,
                    Layout.selfCenter,
                  ]}
                />
              )}
            </Pressable>
          </View>
        </View>
        <View
          style={[
            Layout.center,
            Gutters.ninetyPWidth,
            Layout.selfCenter,
            Layout.flexFour,
            Gutters.tenVMargin,
          ]}
        >
          {/* <Button
            title="Continue"
            loading={false}
            onPress={() => {
              onContinueHandler()
            }}
            loadingProps={[{ size: 'small' }, Common.whiteColor]}
            titleStyle={[
              Fonts.fontWeightRegular,
              Fonts.fontFamilyPrimary,
              Gutters.fiftyLMargin,
            ]}
            buttonStyle={[
              Common.primaryPinkBackground,
              Gutters.fiftyfiveHeight,
              Common.borderRadius,
              Layout.justifyContentBetween,
            ]}
            containerStyle={[
              Gutters.ninetyfivePWidth,
              Layout.selfCenter,
              Common.borderRadius,
            ]}
            disabled={false}
            disabledStyle={[Common.whiteColor, Common.greyBackground]}
            disabledTitleStyle={[Common.whiteColor, Gutters.zeroOsevenOpacity]}
          /> */}
          <Button
            title="Continue"
            loading={false}
            disabled={false}
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
            disabledStyle={[Common.whiteColor, Common.greyBackground]}
            disabledTitleStyle={[Common.whiteColor, Gutters.zeroOsevenOpacity]}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AddMoney
