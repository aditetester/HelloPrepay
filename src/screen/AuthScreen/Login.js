import React, { useState } from 'react'
import { View, Text, SafeAreaView, TextInput } from 'react-native'
import { useTheme } from '@/Hooks'
import { useEffect } from 'react'
import auth from '@react-native-firebase/auth'
import { Button } from '@rneui/themed'
import { useGetVerifyUserMutation } from '../../Services/api'

const Login = ({ navigation }) => {
  const { Common, Layout, Fonts, Gutters } = useTheme()
  const [number, setNumber] = useState('')
  const [buttonLoading, setButtonLoading] = useState(false)
  const [errors, setErrors] = useState('')
  const withoutFormateNumber = number.replace(/\D/g, '')
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState()

  const [
    getVerifyUser,
    {
      data,
      isLoading,
      isError,
      isSuccess,
      isUninitialized,
      originalArgs,
      status,
    },
  ] = useGetVerifyUserMutation()

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    })
  }, [navigation])

  useEffect(() => {
    function phoneFormat(input) {
      input = input.replace(/\D/g, '').substring(0, 10)
      var size = input.length
      if (size > 0) {
        input = '(' + input
      }
      if (size > 3) {
        input = input.slice(0, 4) + ') ' + input.slice(4)
      }
      if (size > 6) {
        input = input.slice(0, 9) + '-' + input.slice(9)
      }
      return setNumber(input)
    }
    phoneFormat(number)
  }, [number])

  useEffect(() => {
    if (isLoading) {
      setButtonLoading(true)
    } else {
      setButtonLoading(false)
    }
  }, [isLoading])

  useEffect(() => {
    setErrors('')
    if (data && data.status === 'active') {
      navigation.navigate('Otp', {
        navigateFor: 'Login',
        OTP: data.otp,
        phone_number: withoutFormateNumber,
      })
      setButtonLoading(false)
    } else if (data && data.status !== 'active') {
      signInUsingFirebase(withoutFormateNumber)
    } else if (
      data &&
      data.message.phone_number[0] ===
        'The phone number must be between 5 and 10 digits.'
    ) {
      setErrors('The phone number must be 10 digits.')
    } else if (data && data.message) {
      setErrors('Something Went Wrong...')
    }
  }, [data])

  const onContinueHandler = async () => {
    setButtonLoading(true)
    setErrors('')
    getVerifyUser({ phone_number: withoutFormateNumber })
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [])

  function onAuthStateChanged(users) {
    setUser(users)
    if (initializing) {
      setInitializing(false)
    }
  }

  const signInUsingFirebase = async phoneNumber => {
    setButtonLoading(true)
    await auth()
      .signInWithPhoneNumber(`+1${phoneNumber}`)
      .then(res => {
        setButtonLoading(true)
        setErrors('')
        // setConfirm(res)
        console.log('RESPONSE', res)
        navigation.navigate('Otp', {
          navigateFor: 'Registration',
          phone_number: withoutFormateNumber,
          OTP: res,
        })
        setButtonLoading(false)
        setNumber('')
      })
      .catch(err => {
        setButtonLoading(false)
        if (err.code === 'auth/invalid-phone-number') {
          setErrors('Invalid Number')
        } else if (err.code === 'auth/too-many-requests') {
          setErrors('Too Many Requests Wait a Moment')
        } else if (err.code === 'auth/app-not-authorized') {
          setErrors(
            'This app is not authorized to use Firebase Authentication. Please verify that the correct package name and SHA-1 are configured in the Firebase Console.',
          )
        } else if (err.code === 'auth/quota-exceeded') {
          setErrors('QUOTA_EXCEEDED : Exceeded quota')
        } else {
          console.log(err)
          setErrors('Something went wrong...')
        }
      })
  }

  return (
    <SafeAreaView style={Layout.fill}>
      <View style={[Common.backgroundPrimary, Layout.fill]}>
        <View style={[Gutters.tenTMargin, Gutters.twentyfiveLMargin]}>
          <Text
            style={[
              Common.titleText,
              Fonts.fontWeightRegular,
              Fonts.fontSizeLarge,
              Fonts.fontFamilyPrimary,
            ]}
          >
            Log in to
          </Text>
          <Text
            style={[
              Common.titleText,
              Fonts.fontWeightRegular,
              Fonts.fontSizeLarge,
              Fonts.fontFamilyPrimary,
            ]}
          >
            start refilling
          </Text>
        </View>
        <View
          style={[
            Common.backgroundPrimary,
            Gutters.fortyTMargin,
            Gutters.twentyHMargin,
          ]}
        >
          <Text
            style={[
              Common.innerText,
              Gutters.tenVMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            Phone Number
          </Text>
          <View style={[Layout.row, Gutters.hundredPWidth]}>
            <TextInput
              defaultValue="+1"
              editable={false}
              style={[
                Common.secondaryGrey,
                Fonts.fontWeightSmall,
                Fonts.fontSizeRegular,
                Fonts.textCenter,
                Fonts.fontFamilyPrimary,
                Common.offWhiteBackground,
                Common.borderTopLeftRadius,
                Common.borderBottomLeftRadius,
                Gutters.twentyPWidth,
                Gutters.fiftysixHeight,
              ]}
            />
            <TextInput
              value={number}
              autoFocus={true}
              editable={!buttonLoading}
              placeholder="(415) 333-3333"
              maxLength={14}
              keyboardType="numeric"
              onChangeText={num => setNumber(num)}
              placeholderTextColor={Common.placeHolderText.color}
              style={[
                Common.secondaryGrey,
                Fonts.fontWeightSmall,
                Fonts.fontSizeRegular,
                Fonts.fontFamilyPrimary,
                Common.offWhiteBackground,
                Common.borderTopRightRadius,
                Common.borderBottomRightRadius,
                Gutters.eightyPWidth,
                Gutters.fiftysixHeight,
                Layout.alignItemsCenter,
              ]}
            />
          </View>
        </View>
        <View
          style={[
            Layout.selfCenter,
            Gutters.ninetyfivePWidth,
            Gutters.twentyFourVMargin,
          ]}
        >
          <Button
            title="Continue"
            loading={buttonLoading}
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
              Layout.selfCenter,
              Common.borderRadius,
            ]}
            disabled={!(number.length === 14) || buttonLoading}
            disabledStyle={[Common.whiteColor, Common.greyBackground]}
            disabledTitleStyle={[Common.whiteColor, Gutters.zeroOsevenOpacity]}
          />
        </View>
        <View style={[Layout.center, Gutters.twentyBMargin]}>
          <Text
            style={[
              Common.errorColor,
              Fonts.fontSizeExtraSmall,
              Gutters.twentyHMargin,
            ]}
          >
            {errors}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Login
