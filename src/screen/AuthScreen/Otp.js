import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  Alert,
} from 'react-native'
import { useTheme } from '@/Hooks'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button } from '@rneui/themed'
import { useDispatch } from 'react-redux'
import { setUser } from '@/Store/User'
import axios from 'axios'
import { BASE_URL } from '@/Config'
import Timer from '@/Components/UI/Timer'

const Otp = ({ navigation, route }) => {
  let params = route.params
  console.log(params)
  const dispatch = useDispatch()
  const theme = useSelector(state => state.theme)

  const { Common, Images, Layout, Gutters, Fonts } = useTheme()
  const [buttonLoading, setButtonLoading] = useState(false)
  const [counter, setCounter] = useState(15)
  const [key1, setKey1] = useState('')
  const [key2, setKey2] = useState('')
  const [key3, setKey3] = useState('')
  const [key4, setKey4] = useState('')
  const [key5, setKey5] = useState('')
  const [key6, setKey6] = useState('')
  const [OTPCode, setOTPCode] = useState('')

  useEffect(() => {
    setOTPCode(key1 + key2 + key3 + key4 + key5 + key6)
  }, [key1, key2, key3, key4, key5, key6])

  const onContinueHandler = async PARAMS => {
    setButtonLoading(true)
    if (PARAMS.navigateFor === 'Registration') {
      try {
        setButtonLoading(true)
        await PARAMS.OTP.confirm(OTPCode)
        navigation.navigate('About', { phone_number: PARAMS.phone_number })
        setButtonLoading(false)
        return
      } catch (error) {
        setButtonLoading(false)
        Alert.alert('Invalid Code', 'You Entered Invalid Code')
        setKey1('')
        setKey2('')
        setKey3('')
        setKey4('')
        setKey5('')
        setKey6('')
        setOTPCode('')
        return
      }
    }
    if (PARAMS.navigateFor === 'Login') {
      setButtonLoading(true)
      axios
        .post(`${BASE_URL}login`, {
          phone_number: PARAMS.phone_number,
          otp: OTPCode,
        })
        .then(res => {
          setButtonLoading(true)
          let data = JSON.stringify(res.data)
          let obj = JSON.parse(data)
          if (obj.success === true) {
            if (obj.carrier_id === null) {
              navigation.navigate('SelectCarrier', {
                token: obj.token,
                first_name: obj.first_name,
                obj: obj,
              })
              setButtonLoading(false)
              return
            } else {
              dispatch(setUser({ userData: obj, isAuth: true }))
              setButtonLoading(false)
            }
          } else if (obj.success === false) {
            setButtonLoading(false)
            Alert.alert('', obj.message)
            setKey1('')
            setKey2('')
            setKey3('')
            setKey4('')
            setKey5('')
            setKey6('')
            setOTPCode('')
          }
        })
        .catch(() => {
          setButtonLoading(false)
          Alert.alert('Error!', 'Something Went Wrong...')
        })
    }
    setButtonLoading(false)
    return
  }

  const onSendCodeAgainHandler = () => {
    // onContinueHandler(params)
    setCounter(10)
  }

  useEffect(() => {
    if (OTPCode.length === 6) {
      setButtonLoading(true)
      onContinueHandler(params)
    }
  }, [OTPCode])

  const onKeyPress = keyvalue => {
    if (key1 === '') {
      setKey1(keyvalue.toString())
    } else if (key2 === '') {
      setKey2(keyvalue.toString())
    } else if (key3 === '') {
      setKey3(keyvalue.toString())
    } else if (key4 === '') {
      setKey4(keyvalue.toString())
    } else if (key5 === '') {
      setKey5(keyvalue.toString())
    } else if (key6 === '') {
      setKey6(keyvalue.toString())
    }
  }

  const onDeleteValue = () => {
    if (key6 !== '') {
      setKey6('')
    } else if (key5 !== '') {
      setKey5('')
    } else if (key4 !== '') {
      setKey4('')
    } else if (key3 !== '') {
      setKey3('')
    } else if (key2 !== '') {
      setKey2('')
    } else if (key1 !== '') {
      setKey1('')
    }
  }

  const onBackHandler = () => {
    navigation.goBack()
  }

  //-----------------------------------------

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
            Please confirm
          </Text>
          <Text
            style={[
              Common.titleText,
              Fonts.fontWeightRegular,
              Fonts.fontSizeLarge,
              Fonts.fontFamilyPrimary,
            ]}
          >
            your number
          </Text>
        </View>
        <View style={[Layout.alignItemsCenter, Layout.flexTwo]}>
          <Text
            style={[
              Common.innerText,
              Common.primaryGrey,
              Fonts.fontWeightSmall,
              Fonts.fontSizeSmall,
              Fonts.fontFamilyPrimary,
            ]}
          >
            We’ve sent you a 6 digit code through SMS.
          </Text>
        </View>
        <View
          style={[
            Common.textColor,
            Layout.row,
            Layout.flexTwo,
            Layout.alignItemsCenter,
            Layout.justifyContentAround,
            Gutters.ofzHMargin,
            Gutters.twentyVMargin,
          ]}
        >
          <View
            style={[Gutters.thirtyWidth, Gutters.fiftyHeight, Layout.center]}
          >
            {key1 ? (
              <Text
                style={[
                  Common.primaryPink,
                  Fonts.fontSizeRegular,
                  Fonts.fontWeightRegular,
                  Layout.selfCenter,
                  Fonts.fontFamilyPrimary,
                ]}
              >
                {key1}
              </Text>
            ) : (
              <Image
                source={Images.otpPlaceHolder}
                style={[Gutters.tenWidth, Gutters.tenHeight, Layout.selfCenter]}
              />
            )}
          </View>
          <View
            style={[Gutters.thirtyWidth, Gutters.fiftyHeight, Layout.center]}
          >
            {key2 ? (
              <Text
                style={[
                  Common.primaryPink,
                  Fonts.fontSizeRegular,
                  Fonts.fontWeightRegular,
                  Layout.selfCenter,
                  Fonts.fontFamilyPrimary,
                ]}
              >
                {key2}
              </Text>
            ) : (
              <Image
                source={Images.otpPlaceHolder}
                style={[Gutters.tenWidth, Gutters.tenHeight, Layout.selfCenter]}
              />
            )}
          </View>
          <View
            style={[Gutters.thirtyWidth, Gutters.fiftyHeight, Layout.center]}
          >
            {key3 ? (
              <Text
                style={[
                  Common.primaryPink,
                  Fonts.fontSizeRegular,
                  Fonts.fontWeightRegular,
                  Layout.selfCenter,
                  Fonts.fontFamilyPrimary,
                ]}
              >
                {key3}
              </Text>
            ) : (
              <Image
                source={Images.otpPlaceHolder}
                style={[Gutters.tenWidth, Gutters.tenHeight, Layout.selfCenter]}
              />
            )}
          </View>
          <View
            style={[Gutters.thirtyWidth, Gutters.fiftyHeight, Layout.center]}
          >
            {key4 ? (
              <Text
                style={[
                  Common.primaryPink,
                  Fonts.fontSizeRegular,
                  Fonts.fontWeightRegular,
                  Layout.selfCenter,
                  Fonts.fontFamilyPrimary,
                ]}
              >
                {key4}
              </Text>
            ) : (
              <Image
                source={Images.otpPlaceHolder}
                style={[Gutters.tenWidth, Gutters.tenHeight, Layout.selfCenter]}
              />
            )}
          </View>
          <View
            style={[Gutters.thirtyWidth, Gutters.fiftyHeight, Layout.center]}
          >
            {key5 ? (
              <Text
                style={[
                  Common.primaryPink,
                  Fonts.fontSizeRegular,
                  Fonts.fontWeightRegular,
                  Layout.selfCenter,
                  Fonts.fontFamilyPrimary,
                ]}
              >
                {key5}
              </Text>
            ) : (
              <Image
                source={Images.otpPlaceHolder}
                style={[Gutters.tenWidth, Gutters.tenHeight, Layout.selfCenter]}
              />
            )}
          </View>
          <View
            style={[Gutters.thirtyWidth, Gutters.fiftyHeight, Layout.center]}
          >
            {key6 ? (
              <Text
                style={[
                  Common.primaryPink,
                  Fonts.fontSizeRegular,
                  Fonts.fontWeightRegular,
                  Layout.selfCenter,
                  Fonts.fontFamilyPrimary,
                ]}
              >
                {key6}
              </Text>
            ) : (
              <Image
                source={Images.otpPlaceHolder}
                style={[Gutters.tenWidth, Gutters.tenHeight, Layout.selfCenter]}
              />
            )}
          </View>
        </View>
        {/* <Text
          style={[
            Common.titleText,
            Layout.selfCenter,
            Layout.flexTwo,
            Fonts.fontSizeSmall,
            Fonts.textDecorationLineUnderline,
            Fonts.fontWeightRegular,
            Gutters.twentyBMargin,
            Fonts.fontFamilyPrimary,
          ]}
        >
          Send code again
        </Text> */}
        <TouchableOpacity
          style={[Layout.alignItemsCenter, Layout.flexTwo]}
          onPress={() => onSendCodeAgainHandler()}
        >
          {/* <Text
            style={[
              Common.titleText,
              Layout.selfCenter,
              // Layout.flexTwo,
              Fonts.fontSizeSmall,
              Fonts.textDecorationLineUnderline,
              Fonts.fontWeightRegular,
              Fonts.fontFamilyPrimary,
            ]}
          >
            Send code again
          </Text> */}
          <Timer maxRange={counter} />
        </TouchableOpacity>
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
                    Fonts.fontFamilyPrimary,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.primaryBlue,
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
                    Fonts.fontFamilyPrimary,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.primaryBlue,
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
                    Fonts.fontFamilyPrimary,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.primaryBlue,
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
                    Fonts.fontFamilyPrimary,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.primaryBlue,
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
                    Fonts.fontFamilyPrimary,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.primaryBlue,
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
                    Fonts.fontFamilyPrimary,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.primaryBlue,
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
                    Fonts.fontFamilyPrimary,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.primaryBlue,
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
                    Fonts.fontFamilyPrimary,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.primaryBlue,
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
                    Fonts.fontFamilyPrimary,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.primaryBlue,
                  ]}
                >
                  9
                </Text>
              )}
            </Pressable>
          </View>
          <View style={[Layout.row, Layout.justifyContentBetween, Layout.fill]}>
            <View
              style={[
                Gutters.twentyninePWidth,
                Gutters.eightyfivePHeight,
                Layout.fill,
                Common.backgroundPrimary,
                Common.borderRadius,
                Layout.center,
                Gutters.tenVMargin,
                Gutters.tenHMargin,
              ]}
            ></View>
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
              onPress={() => onKeyPress('0')}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    pressed && Common.white,
                    Fonts.fontSizeRegular,
                    Fonts.fontFamilyPrimary,
                    !pressed && Fonts.fontWeightSmall,
                    !pressed && Common.primaryBlue,
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
                !pressed && Common.offWhiteBackground,
                Common.borderRadius,
                Layout.center,
                Gutters.tenVMargin,
                Gutters.tenHMargin,
              ]}
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
            Layout.flexFive,
            Gutters.tenVMargin,
          ]}
        >
          {/* <Button
            onPress={() => {
              onContinueHandler()
            }}
            title={'Continue'}
            size="sm"
            fontSize={16}
            backgroundColor={
              OTPCode.length === 6
                ? Common.primaryPink.color
                : Common.greyColor.color
            }
            disabled={!(OTPCode.length === 6)}
          /> */}
          <Button
            title="Continue"
            loading={buttonLoading}
            onPress={() => {
              onContinueHandler(params)
            }}
            loadingProps={[{ size: 'small' }, Common.whiteColor]}
            titleStyle={[Fonts.fontWeightRegular]}
            buttonStyle={[
              Common.primaryPinkBackground,
              Gutters.fiftyfiveHeight,
              Common.borderRadius,
              // Layout.fullHeight,
            ]}
            containerStyle={[
              Gutters.ninetyfivePWidth,
              Layout.selfCenter,
              Common.borderRadius,
            ]}
            disabled={!(OTPCode.length === 6)}
            disabledStyle={[Common.whiteColor, Common.greyBackground]}
            disabledTitleStyle={[Common.whiteColor, Gutters.zeroOsevenOpacity]}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Otp
