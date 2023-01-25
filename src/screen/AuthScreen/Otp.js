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
import Timer from '@/Components/UI/Timer'
import {
  useGetLoginUserMutation,
  useGetVerifyUserMutation,
  useSendEmailCodeMutation,
} from '@/Services/api'
import auth from '@react-native-firebase/auth'
import Spinner from 'react-native-loading-spinner-overlay'
import { scale, verticalScale } from 'react-native-size-matters'

const Otp = ({ navigation, route }) => {
  const [params, setParams] = useState(route.params)
  // console.log('Params', params)
  const dispatch = useDispatch()
  const theme = useSelector(state => state.theme)
  const { Common, Images, Layout, Gutters, Fonts } = useTheme()
  const [buttonLoading, setButtonLoading] = useState(false)
  const [sendCodeAgainSpinner, setSendCodeAgainSpinner] = useState(false)
  const [key1, setKey1] = useState('')
  const [key2, setKey2] = useState('')
  const [key3, setKey3] = useState('')
  const [key4, setKey4] = useState('')
  const [key5, setKey5] = useState('')
  const [key6, setKey6] = useState('')
  const [OTPCode, setOTPCode] = useState('')
  console.log('OTPCode', OTPCode)

  const [
    sendMailCode,
    {
      data: sendMailCodeData,
      isLoading: sendMailCodeIsLoading,
      error: sendMailCodeError,
    },
  ] = useSendEmailCodeMutation()

  const [
    getLogin,
    {
      data,
      isLoading,
      error,
      isSuccess,
      isUninitialized,
      originalArgs,
      status,
    },
  ] = useGetLoginUserMutation()

  useEffect(() => {
    if (isLoading) {
      setButtonLoading(true)
    } else {
      setButtonLoading(false)
    }
  }, [isLoading])

  useEffect(() => {
    if (error) {
      Alert.alert(
        'Error!!',
        `Something Went Wrong Try After Some Time \n Status Code:- ${error.originalStatus}`,
        [{ text: 'Ok', onPress: () => navigation.navigate('Login') }],
      )
    }
  }, [error])

  // console.log(data)

  useEffect(() => {
    if (data && data.message === 'otp has been expired') {
      Alert.alert('Otp Expired', 'Otp has been expired !!')
      return
    }
    if (data && data.success === false) {
      Alert.alert('Wrong Otp', 'You Entered Wrong Otp EMAIL')
      setButtonLoading(false)
      setKey1('')
      setKey2('')
      setKey3('')
      setKey4('')
      setKey5('')
      setKey6('')
      setOTPCode('')
      return
    }
    if (data && data.success === true) {
      if (data.carrier_id === null) {
        navigation.navigate('SelectCarrier', {
          token: data.token,
          first_name: data.first_name,
          data: data,
        })
        setButtonLoading(false)
      } else {
        dispatch(setUser({ userData: data, isAuth: true, perpos: 'Login' }))
        setButtonLoading(false)
      }
    }
  }, [data])

  useEffect(() => {
    setOTPCode(key1 + key2 + key3 + key4 + key5 + key6)
  }, [key1, key2, key3, key4, key5, key6])

  //---------------------------------------
  // const [initializing, setInitializing] = useState(true)
  // const [user, setUser] = useState()

  // useEffect(() => {
  //   const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
  //   return subscriber
  // }, [])

  // function onAuthStateChanged(users) {
  //   setUser(users)
  //   console.log('User user user ---------------', users)
  //   if (initializing) {
  //     setInitializing(false)
  //   }
  // }
  //------------------------------------

  const onContinueHandler = async PARAMS => {
    setButtonLoading(true)
    if (PARAMS.navigateFor === 'Login') {
      setButtonLoading(true)
      if (params.flag === 1) {
        try {
          setButtonLoading(true)
          await PARAMS.OTP.confirm(OTPCode)
          getLogin({
            phone_number: PARAMS.phone_number,
            otp: OTPCode,
            flag: params.flag,
          })
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
      } else if (params.flag === 2) {
        getLogin({
          phone_number: PARAMS.phone_number,
          otp: OTPCode,
          flag: params.flag,
        })
      }
    } else if (PARAMS.navigateFor === 'Registration') {
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

    setButtonLoading(false)
    return
  }

  //----------START = Send-Code-Again---------------//
  //--Registration--//
  const signInUsingFirebase = async () => {
    setSendCodeAgainSpinner(true)
    await auth()
      .signInWithPhoneNumber(`+1${params.phone_number}`)
      .then(res => {
        setParams({
          navigateFor: 'Registration',
          phone_number: params.phone_number,
          OTP: res,
          flag: 1,
        })
        setSendCodeAgainSpinner(false)
      })
      .catch(err => {
        setSendCodeAgainSpinner(false)
        if (err.code === 'auth/invalid-phone-number') {
          console.log('Invalid Number')
        } else if (err.code === 'auth/too-many-requests') {
          console.log('Too Many Requests Wait a Moment')
        } else if (err.code === 'auth/app-not-authorized') {
          console.log(
            'This app is not authorized to use Firebase Authentication. Please verify that the correct package name and SHA-1 are configured in the Firebase Console.',
          )
        } else {
          console.log(err)
          setSendCodeAgainSpinner(false)
        }
      })
  }
  //-------Registration---------//

  //------Login-----------//
  const [
    getVerifyUser,
    {
      data: verifyUserData,
      isLoading: verifyUserIsLoading,
      // isError: verifyUserIsError,
      // isSuccess: verifyUserIsSuccess,
      // isUninitialized: verifyUserIsUninitialized,
      // originalArgs: verifyUserOriginalArgs,
      // status: verifyUserStatus,
    },
  ] = useGetVerifyUserMutation()

  useEffect(() => {
    if (verifyUserIsLoading) {
      setButtonLoading(true)
    } else {
      setButtonLoading(false)
    }
  }, [verifyUserIsLoading])

  useEffect(() => {
    if (verifyUserData && verifyUserData.status === 'active') {
      console.log('verifyUserData', verifyUserData)
      setParams({
        navigateFor: 'Login',
        OTP: verifyUserData.otp,
        phone_number: route.params.phone_number,
        flag: 2,
      })
      setSendCodeAgainSpinner(false)
    } else if (verifyUserData && verifyUserData) {
      setSendCodeAgainSpinner(false)
      console.log('Something Went Wrong...', verifyUserData)
    }
  }, [verifyUserData])

  useEffect(() => {
    if (sendMailCodeData && sendMailCodeData.success === true) {
      setParams({
        navigateFor: 'Login',
        OTP: verifyUserData.otp,
        phone_number: route.params.phone_number,
        flag: 2,
      })
    }
  }, [])

  useEffect(() => {
    if (sendMailCodeIsLoading) {
      setSendCodeAgainSpinner(true)
    } else {
      setSendCodeAgainSpinner(false)
    }
  }, [sendMailCodeIsLoading])
  //--------Login--------//

  const onSendCodeAgainHandler = () => {
    setSendCodeAgainSpinner(true)
    if (params.flag == 1) {
      signInUsingFirebase()
    } else if (params.flag == 2) {
      setSendCodeAgainSpinner(true)
      // getVerifyUser({ phone_number: route.params.phone_number })
      sendMailCode({ phone_number: params.phone_number })
    }
  }

  //------------END = Send-Code-Again--------------//

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

  let loading = (
    <>
      <Spinner
        visible={sendCodeAgainSpinner}
        textContent={''}
        textStyle={{ color: '#FFF' }}
      />
    </>
  )

  return (
    <SafeAreaView style={[Layout.fill, Common.backgroundPrimary]}>
      {loading}
      <View style={Layout.fill}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[Gutters.twentyHMargin]}
        >
          <Image
            source={Images.LeftArrow}
            style={{ height: verticalScale(19), width: '10%' }}
            resizeMode="cover"
          />
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
            We’ve sent you a 6 digit code through{' '}
            {params.flag === 1 ? 'SMS' : 'Email'}.
          </Text>
        </View>
        <View
          style={[
            { width: '30%', alignSelf: 'center' },
            Common.textColor,
            Layout.row,
            Layout.flexTwo,
            Layout.alignItemsCenter,
            Layout.justifyContentAround,
            // Gutters.ofzHMargin,
            Gutters.twentyVMargin,
          ]}
        >
          <View
            style={[
              Layout.center,
              { height: verticalScale(50), width: scale(40) },
            ]}
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
                style={[
                  { width: scale(10), height: verticalScale(10) },
                  Layout.selfCenter,
                ]}
              />
            )}
          </View>
          <View
            style={[
              Layout.center,
              { height: verticalScale(50), width: scale(40) },
            ]}
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
                style={[
                  { width: scale(10), height: verticalScale(10) },
                  Layout.selfCenter,
                ]}
              />
            )}
          </View>
          <View
            style={[
              Layout.center,
              { height: verticalScale(50), width: scale(40) },
            ]}
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
                style={[
                  { width: scale(10), height: verticalScale(10) },
                  Layout.selfCenter,
                ]}
              />
            )}
          </View>
          <View
            style={[
              Layout.center,
              { height: verticalScale(50), width: scale(40) },
            ]}
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
                style={[
                  { width: scale(10), height: verticalScale(10) },
                  Layout.selfCenter,
                ]}
              />
            )}
          </View>
          <View
            style={[
              Layout.center,
              { height: verticalScale(50), width: scale(40) },
            ]}
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
                style={[
                  { width: scale(10), height: verticalScale(10) },
                  Layout.selfCenter,
                ]}
              />
            )}
          </View>
          <View
            style={[
              Layout.center,
              {
                height: verticalScale(50),
                width: scale(40),
              },
            ]}
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
                style={[
                  { width: scale(10), height: verticalScale(10) },
                  Layout.selfCenter,
                ]}
              />
            )}
          </View>
        </View>

        <TouchableOpacity style={[Layout.alignItemsCenter, Layout.flexTwo]}>
          <Timer
            maxRange={59}
            onPress={() => {
              console.log('send code again')
              onSendCodeAgainHandler()
            }}
            beforeText="Send code again"
            afterText="Send code again in"
          />
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
                // { backgroundColor: '#45484A' },
                pressed && Common.primaryPinkBackground,
                Gutters.twentyninePWidth,
                Gutters.eightyfivePHeight,
                Layout.fill,
                // !pressed && Common.offWhiteBackground,
                !pressed && Common.keyboardBackGround,
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
                    // !pressed && Common.primaryBlue,
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
                // !pressed && Common.offWhiteBackground,
                !pressed && Common.keyboardBackGround,
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
                    // !pressed && Common.primaryBlue,
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
                // !pressed && Common.offWhiteBackground,
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
                    // !pressed && Common.primaryBlue,
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
                // !pressed && Common.offWhiteBackground,
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
                    // !pressed && Common.primaryBlue,
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
                // !pressed && Common.offWhiteBackground,
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
                    // !pressed && Common.primaryBlue,
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
                // !pressed && Common.offWhiteBackground,
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
                    // !pressed && Common.primaryBlue,
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
                // !pressed && Common.offWhiteBackground,
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
                    // !pressed && Common.primaryBlue,
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
                // !pressed && Common.offWhiteBackground,
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
                    // !pressed && Common.primaryBlue,
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
                // !pressed && Common.offWhiteBackground,
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
                    // !pressed && Common.primaryBlue,
                    !pressed && Common.keyboardText,
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
            />
            <Pressable
              style={({ pressed }) => [
                pressed && Common.primaryPinkBackground,
                Gutters.twentyninePWidth,
                Gutters.eightyfivePHeight,
                Layout.fill,
                // !pressed && Common.offWhiteBackground,
                !pressed && Common.keyboardBackGround,
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
                    // !pressed && Common.primaryBlue,
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
                // !pressed && Common.offWhiteBackground,
                !pressed && Common.keyboardBackGround,
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
                  { height: verticalScale(25), width: scale(25) },
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
          <Button
            title="Continue"
            loading={buttonLoading}
            onPress={() => {
              onContinueHandler(params)
            }}
            loadingProps={[{ size: 'small' }, Common.whiteColor]}
            titleStyle={[
              Fonts.fontSize12,
              Fonts.fontWeightRegular,
              Fonts.fontFamilyPrimary,
            ]}
            buttonStyle={[
              { height: verticalScale(55) },
              Common.primaryPinkBackground,
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
