import React, { useState, useRef } from 'react'
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
import Button from '@/Components/UI/Button'
import { useDispatch } from 'react-redux'
import { setUser } from '@/Store/User'
import PhoneInput from 'react-native-phone-number-input'

const EnterMobileNumber = ({ navigation }) => {
  const { Common, Images, Layout, Gutters, Fonts } = useTheme()
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [formattedNumber, setFormattedNumber] = useState()
  const theme = useSelector(state => state.theme)

  const [value, setValue] = useState('')
  const phoneInput = useRef(null)
  const [code, setCode] = useState('+1')

  useEffect(() => {
    let formatPhoneNumber = str => {
      let cleaned = ('' + str).replace(/\D/g, '')
      let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
      if (match) {
        return setValue('' + match[1] + ' ' + match[2] + '-' + match[3])
      }

      return null
    }
    formatPhoneNumber(value)
  }, [value])

  const onContinueHandler = () => {
    navigation.navigate('Otp', {
      navigateFrom: 'MobileNumber',
      countyCode: code,
      mobileNumber: value,
    })
    // dispatch(setUser({ isAuth: true }))
  }

  const onKeyPress = keyvalue => {
    setValue(val => [...val, keyvalue].splice(' ').join('').toString())
  }

  const onDeleteValue = () => {
    setValue(value.slice(0, -1))
  }

  const onBackHandler = () => {
    navigation.goBack()
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    })
  }, [navigation])

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
          {!theme.darMode ? (
            <Image source={Images.greyLeftArrow} />
          ) : (
            <Image source={Images.whiteLeftArrow} />
          )}
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
            Enter your
          </Text>
          <Text
            style={[
              Common.titleText,
              Fonts.fontWeightRegular,
              Fonts.fontSizeLarge,
              Fonts.fontFamilyPrimary,
            ]}
          >
            mobile number
          </Text>
        </View>

        <View
          style={[
            {
              backgroundColor: 'red',
              width: '95%',
              alignItems: 'center',
            },
            Common.backgroundPrimary,
            // Gutters.fortyTMargin,
            Layout.selfCenter,
          ]}
        >
          <PhoneInput
            ref={phoneInput}
            value={value}
            defaultCode="US"
            layout="second"
            onChangeText={text => {
              setValue(text)
            }}
            onChangeCountry={text => {
              setCode(`+${text.callingCode.toString()}`)
            }}
            containerStyle={[
              { height: 70 },
              Common.offWhiteBorder,
              Common.offWhiteBackground,
              Gutters.ninetyPWidth,
              // Gutters.fiftyfiveHeight,
            ]}
            textInputStyle={[
              Common.primaryBlue,
              Fonts.fontWeightSmall,
              Fonts.fontSizeLargeS,
              Gutters.seventyHeight,
              Fonts.fontFamilyPrimary,
            ]}
            flagButtonStyle={[
              Common.primaryBlue,
              Fonts.fontWeightSmall,
              Fonts.fontSizeLarge,
              Gutters.seventyHeight,
              Layout.selfCenter,
            ]}
            showSoftInputOnFocus={false}
            // withShadow
            withDarkTheme
            autoFocus
            placeholder="123 456-7890"
            textInputProps={{ placeholderTextColor: Common.greyColor.color }}
            textContainerStyle={Common.offWhiteColor}
          />
        </View>
        <View
          style={[
            Gutters.ninetyfivePWidth,
            Gutters.tenPadding,
            Layout.justifyContentCenter,
            Layout.selfCenter,
            Layout.flexEighteen,
          ]}
        >
          <View style={[Layout.row, Layout.justifyContentBetween, Layout.fill]}>
            <Pressable
              style={({ pressed }) => [
                pressed && Common.primaryPinkBackground,
                Gutters.twentyninePWidth,
                Gutters.eightyfivePHeight,
                Layout.fill,
                !pressed && Common.offWhiteBackground,
                Common.borderRadius,
                Layout.center,
                Gutters.tenVMargin,
                Gutters.tenHMargin,
              ]}
              onPress={() => onKeyPress(1)}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    pressed && Common.white,
                    Fonts.fontSizeRegular,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.primaryBlue,
                    Fonts.fontFamilyPrimary,
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
                !pressed && Common.offWhiteBackground,
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
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.primaryBlue,
                    Fonts.fontFamilyPrimary,
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
                !pressed && Common.offWhiteBackground,
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
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.primaryBlue,
                    Fonts.fontFamilyPrimary,
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
                !pressed && Common.offWhiteBackground,
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
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.primaryBlue,
                    Fonts.fontFamilyPrimary,
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
                !pressed && Common.offWhiteBackground,
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
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.primaryBlue,
                    Fonts.fontFamilyPrimary,
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
                !pressed && Common.offWhiteBackground,
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
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.primaryBlue,
                    Fonts.fontFamilyPrimary,
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
                !pressed && Common.offWhiteBackground,
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
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.primaryBlue,
                    Fonts.fontFamilyPrimary,
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
                !pressed && Common.offWhiteBackground,
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
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.primaryBlue,
                    Fonts.fontFamilyPrimary,
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
                !pressed && Common.offWhiteBackground,
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
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.primaryBlue,
                    Fonts.fontFamilyPrimary,
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
                !pressed && Common.offWhiteBackground,
                Common.primaryBlue,
                Common.borderRadius,
                Layout.center,
                Layout.fill,
                Gutters.tenHMargin,
                Gutters.tenVMargin,
                Gutters.otsLMargin,
                Gutters.eightyfivePHeight,
              ]}
              onPress={() => onKeyPress('0')}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    pressed && Common.white,
                    !pressed && Common.primaryBlue,
                    !pressed && Fonts.fontWeightSmall,
                    Fonts.fontSizeRegular,
                    Fonts.fontFamilyPrimary,
                  ]}
                >
                  0
                </Text>
              )}
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                pressed && Common.primaryPinkBackground,
                !pressed && Common.offWhiteBackground,
                Common.borderRadius,
                Layout.fill,
                Layout.center,
                Gutters.twentyninePWidth,
                Gutters.eightyfivePHeight,
                Gutters.tenVMargin,
                Gutters.tenHMargin,
              ]}
              delayLongPress={500}
              onLongPress={onDeleteValue}
              onPress={onDeleteValue}
            >
              <Image
                source={Images.delete}
                style={[
                  Gutters.thirtyHeight,
                  Gutters.thirtyWidth,
                  Layout.selfCenter,
                ]}
              />
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
          <Button
            onPress={() => {
              onContinueHandler()
            }}
            title={'Continue'}
            size="sm"
            fontSize={16}
            backgroundColor={
              phoneInput.current?.isValidNumber(value)
                ? Common.primaryPink.color
                : Common.greyColor.color
            }
            disabled={!phoneInput.current?.isValidNumber(value)}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default EnterMobileNumber
