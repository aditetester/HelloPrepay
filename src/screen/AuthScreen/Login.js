import React, { useState } from 'react'
import { View, Text, SafeAreaView, TextInput } from 'react-native'
import { useTheme } from '@/Hooks'
import { useEffect } from 'react'
import auth from '@react-native-firebase/auth'
import { Button } from '@rneui/themed'
import { BASE_URL } from '@/Config'
import axios from 'axios'
import { useGetVerifyUserMutation } from '../../Services/api'

const Login = ({ navigation }) => {
  const { Common, Layout, Fonts, Gutters } = useTheme()
  const [value, setValue] = useState('6666666666')
  const [buttonLoading, setButtonLoading] = useState(false)
  const [error, setError] = useState('')
  const withoutFormateNumber = value.replace(/\D/g, '')
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState()

  const [getVerifyUser, { data, isLoading, isSuccess }] =
    useGetVerifyUserMutation()

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
      return setValue(input)
    }
    phoneFormat(value)
  }, [value])

  console.log('🚀 ~ file: Login.js ~ line 89 ~ Login ~ data', data)
  const onContinueHandler = async () => {
    setButtonLoading(true)
    setError('')
    getVerifyUser({ phone_number: 8888888888 })
    // await axios
    //   .post(`${BASE_URL}verify`, { phone_number: withoutFormateNumber })
    //   .then(res => {
    //     let data = JSON.stringify(res.data)
    //     let obj = JSON.parse(data)
    //     if (obj.status === 'active') {
    //       navigation.navigate('Otp', {
    //         navigateFor: 'Login',
    //         OTP: obj.otp,
    //         phone_number: withoutFormateNumber,
    //       })
    //       setButtonLoading(false)
    //     } else {
    //       signInUsingFirebase(withoutFormateNumber)
    //     }
    //   })
    //   .catch(() => {
    //     setButtonLoading(false)
    //     setError('Something Went Wrong...')
    //   })
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
        setError('')
        // setConfirm(res)
        console.log('RESPONSE', res)
        navigation.navigate('Otp', {
          navigateFor: 'Registration',
          phone_number: withoutFormateNumber,
          OTP: res,
        })
        setButtonLoading(false)
        // setValue('')
      })
      .catch(err => {
        setButtonLoading(false)
        if (err.code === 'auth/invalid-phone-number') {
          setError('Invalid Number')
        } else if (err.code === 'auth/too-many-requests') {
          setError('Too Many Requests Wait a Moment')
        } else {
          setError('Something went wrong...')
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
              value={value}
              autoFocus={true}
              editable={!buttonLoading}
              placeholder="(415) 333-3333"
              maxLength={14}
              keyboardType="numeric"
              onChangeText={num => setValue(num)}
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
            titleStyle={[Fonts.fontWeightRegular]}
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
            disabled={!(value.length === 14) || buttonLoading}
            disabledStyle={[Common.whiteColor, Common.greyBackground]}
            disabledTitleStyle={[Common.whiteColor, Gutters.zeroOsevenOpacity]}
          />
        </View>
        <View style={[Layout.center, Gutters.twentyBMargin]}>
          <Text style={[Common.errorColor, Fonts.fontSizeExtraSmall]}>
            {error}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Login
