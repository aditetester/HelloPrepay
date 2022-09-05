import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native'
import { useTheme } from '@/Hooks'
import { useEffect } from 'react'
import PhoneInput from 'react-native-phone-number-input'
import auth from '@react-native-firebase/auth'
import { Button } from '@rneui/themed'

const Login = ({ navigation }) => {
  const { Common, Layout, Fonts, Images, Gutters } = useTheme()
  const [value, setValue] = useState('')
  const [buttonLoading, setButtonLoading] = useState(false)
  const [formattedValue, setFormattedValue] = useState('')
  const [error, setError] = useState('')
  const phoneInput = useRef(null)
  const [code, setCode] = useState('+1')

  //-------------------------------

  const [initializing, setInitializing] = useState(true)
  const [confirm, setConfirm] = useState(null)
  const [otpCode, setOtpCode] = useState('')

  const [user, setUser] = useState()

  // Handle user state changes
  function onAuthStateChanged(users) {
    console.log('users', users)
    setUser(users)
    if (initializing) setInitializing(false)
  }

  useEffect(() => {
    function phoneFormat(input) {
      //returns (###) ###-####
      input = input.replace(/\D/g, '').substring(0, 10) //Strip everything but 1st 10 digits
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

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    // return subscriber // unsubscribe on unmount
  }, [])

  const signIn = async phoneNumber => {
    setButtonLoading(true)
    const confirmation = await auth()
      .signInWithPhoneNumber(`+1${phoneNumber}`)
      .then(res => {
        setError('')
        setButtonLoading(false)
        setConfirm(res)
        navigation.navigate('Otp', {
          navigateFrom: 'Login',
          countyCode: code,
          mobileNumber: value,
          confirm: confirm,
        })
      })
      .catch(err => {
        setButtonLoading(false)
        console.log(err)
        if (err.code === 'auth/invalid-phone-number') {
          setError('Invalid Number')
        } else if (err.code === 'auth/too-many-requests') {
          setError('Too Many Requests Wait a Moment')
        } else {
          setError('Something went wrong...')
        }
      })
  }

  //-------------------------------

  const onContinueHandler = () => {
    setError('')
    if (value.length !== 0) {
      setButtonLoading(true)
      signIn(value)
    }
    // navigation.navigate('Otp', {
    //   navigateFrom: 'Login',
    //   countyCode: code,
    //   mobileNumber: value,
    // })
  }

  const onRegistrationHandler = () => {
    navigation.navigate('SelectCarrier')
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    })
  }, [navigation])

  console.log(value)

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
            { marginHorizontal: 20 },
            Common.backgroundPrimary,
            Gutters.fortyTMargin,
            // Layout.selfCenter,
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
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
            }}
          >
            <TextInput
              defaultValue="+1"
              editable={false}
              style={[
                {
                  width: '20%',
                  height: 56,
                  borderTopLeftRadius: 4,
                  borderBottomLeftRadius: 4,
                  textAlign: 'center',
                  fontWeight: '500',
                },
                Common.secondaryGrey,
                Fonts.fontWeightSmall,
                Fonts.fontSizeRegular,
                Fonts.fontFamilyPrimary,
                // Common.offWhiteBorder,
                Common.offWhiteBackground,
              ]}
            />
            <TextInput
              autoFocus={true}
              placeholder="(123) 456-7890"
              maxLength={14}
              keyboardType="numeric"
              onChangeText={num => setValue(num)}
              value={value}
              style={[
                {
                  width: '80%',
                  height: 56,
                  borderTopRightRadius: 4,
                  borderBottomRightRadius: 4,
                  alignItems: 'center',
                },
                Common.secondaryGrey,
                Fonts.fontWeightSmall,
                Fonts.fontSizeRegular,
                Fonts.fontFamilyPrimary,
                Common.offWhiteBackground,
              ]}
            />
          </View>
          {/* <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            defaultCode="US"
            layout="second"
            onChangeText={text => {
              setValue(text)
            }}
            onChangeFormattedText={text => {
              setFormattedValue(text)
            }}
            onChangeCountry={text => {
              setCode(`+${text.callingCode.toString()}`)
            }}
            containerStyle={[
              Common.offWhiteBorder,
              Common.offWhiteBackground,
              Gutters.ninetyPWidth,
              Gutters.fiftyfiveHeight,
            ]}
            textInputStyle={[
              Common.secondaryGrey,
              Fonts.fontWeightSmall,
              Fonts.fontSizeRegular,
              Gutters.seventyHeight,
              Fonts.fontFamilyPrimary,
            ]}
            showSoftInputOnFocus={true}
            // withShadow
            // autoFocus
            withDarkTheme
            placeholder="(123) 456-7890"
            textInputProps={{
              placeholderTextColor: Common.placeHolderText.color,
            }}
            textContainerStyle={Common.offWhiteColor}
          /> */}
        </View>
        <View
          style={[
            Layout.selfCenter,
            Gutters.ninetyfivePWidth,
            Gutters.twentyFourVMargin,
            // Gutters.seventyHeight,
            // Gutters.fiftyBMargin,
          ]}
        >
          {/* <Button
            onPress={() => {
              onContinueHandler()
            }}
            title={'continue'}
            size="sm"
            fontSize={Fonts.fontSizeMedium.fontSize}
            backgroundColor={
              phoneInput.current?.isValidNumber(value)
                ? Common.primaryPink.color
                : Common.greyColor.color
            }
            // disabled={!phoneInput.current?.isValidNumber(value)}
            disabled={false}
          /> */}
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
            disabled={!(value.length === 14)}
            disabledStyle={[Common.whiteColor, Common.greyBackground]}
            disabledTitleStyle={[Common.whiteColor, Gutters.zeroOsevenOpacity]}
          />
        </View>
        <View style={[Layout.center, Gutters.twentyBMargin]}>
          <Text
            style={[
              Common.errorColor,
              Fonts.fontSizeExtraSmall,
              // Gutters.zeroOsevenOpacity,
            ]}
          >
            {error}
          </Text>
        </View>
        {/* <View style={[Layout.row, Layout.justifyContentCenter]}>
          <Text
            style={[
              Common.innerText,
              Fonts.fontSizeSmall,
              Fonts.fontWeightSmall,
              Fonts.fontFamilyPrimary,
            ]}
          >
            First time here?
          </Text>
          <TouchableOpacity onPress={onRegistrationHandler}>
            <Text
              style={[
                Common.primaryPink,
                Fonts.fontSizeSmall,
                Fonts.fontWeightSmall,
                Fonts.textDecorationLineUnderline,
                Fonts.fontFamilyPrimary,
              ]}
            >
              {' '}
              Register your number
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </SafeAreaView>
  )
}

export default Login
