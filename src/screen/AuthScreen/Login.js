import React, { useState } from 'react'
import { View, Text, SafeAreaView, TextInput, Alert } from 'react-native'
import { useTheme } from '@/Hooks'
import { useEffect } from 'react'
import auth from '@react-native-firebase/auth'
import { Button, Dialog, CheckBox, Icon } from '@rneui/themed'
import {
  useGetVerifyUserMutation,
  useSendEmailCodeMutation,
} from '../../Services/api'

const Login = ({ navigation }) => {
  //NOTE: 1. Define Variables
  const { Common, Layout, Fonts, Gutters } = useTheme()
  const [number, setNumber] = useState('')
  const [buttonLoading, setButtonLoading] = useState(false)
  const [errors, setErrors] = useState('')
  const withoutFormateNumber = number.replace(/\D/g, '')
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState()
  const [dialog, setDialog] = useState(false)
  const [sms, setSms] = useState(true)
  const [email, setEmail] = useState(false)
  const [registrationDialogs, setRegistrationDialogs] = useState(false)

  const [getVerifyUser, { data, isLoading, error }] = useGetVerifyUserMutation()

  const [
    sendEmailCode,
    { data: emailData, isLoading: emailIsLoading, error: emailError },
  ] = useSendEmailCodeMutation()

  useEffect(() => {
    if (emailData && emailData.success === true) {
      navigation.navigate('Otp', {
        navigateFor: 'Login',
        OTP: data.otp,
        phone_number: withoutFormateNumber,
        flag: 2,
      })
      setDialog(false)
      setSms(true)
      setEmail(false)
    } else if (emailData && emailData.success === false) {
      Alert.alert('Opps!', 'Email is not registered')
    }
  }, [emailData])

  useEffect(() => {
    if (emailError) {
      Alert.alert('Opps!!!', 'Server Down \n Please try again')
      console.log(JSON.stringify('Email Error', emailError.data))
    }
  }, [emailError])

  useEffect(() => {
    if (emailIsLoading) {
      setButtonLoading(true)
    } else {
      setButtonLoading(false)
    }
  }, [emailIsLoading])

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
      setDialog(true)
      setButtonLoading(false)
      console.log(data)
    } else if (data && data.status !== 'active') {
      setRegistrationDialogs(true)
      // signInUsingFirebase(withoutFormateNumber, 'Registration')
      setRegistrationDialogs(true)
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

  useEffect(() => {
    if (error) {
      Alert.alert('Error!', 'Server Down')
    }
  }, [error])

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

  const signInUsingFirebase = async (phoneNumber, mode) => {
    setButtonLoading(true)
    setDialog(false)
    setRegistrationDialogs(false)
    await auth()
      .signInWithPhoneNumber(`+1${phoneNumber}`)
      .then(res => {
        setButtonLoading(true)
        setErrors('')
        // setConfirm(res)
        console.log('RESPONSE', res)
        navigation.navigate('Otp', {
          navigateFor: mode,
          phone_number: withoutFormateNumber,
          OTP: res,
          flag: 1,
        })
        setButtonLoading(false)
        setNumber('')
        setDialog(false)
        setSms(true)
        setEmail(false)
      })
      .catch(err => {
        setButtonLoading(false)
        setDialog(false)
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

  const onConfirmMode = () => {
    if (sms) {
      signInUsingFirebase(withoutFormateNumber, 'Login')
    } else if (email) {
      sendEmailCode({ phone_number: withoutFormateNumber })
    }
    setDialog(false)
  }

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
    navigation.setOptions({
      headerLeft: () => null,
    })
  }, [navigation])

  let registrationDialog = (
    <View>
      <Dialog
        isVisible={registrationDialogs}
        onBackdropPress={() => setRegistrationDialogs(false)}
        overlayStyle={[Common.offWhiteBackground, Common.borderRadiusTen]}
      >
        {/* <Dialog.Title title="Opps!!" titleStyle={[{}, Common.black]} /> */}
        <Text
          style={[Fonts.fontWeightSmall, Fonts.fontSizeSmall, Common.black]}
        >{`You'r not registered with this number +1 ${withoutFormateNumber} click on continue to register`}</Text>

        <Dialog.Actions>
          <Dialog.Button
            title="CONTINUE"
            onPress={() =>
              signInUsingFirebase(withoutFormateNumber, 'Registration')
            }
            titleStyle={[Common.black]}
          />
          <Dialog.Button
            title="CANCEL"
            onPress={() => setRegistrationDialogs(false)}
            titleStyle={[Common.black]}
          />
        </Dialog.Actions>
      </Dialog>
    </View>
  )

  let selectDialog = (
    <View>
      <Dialog
        isVisible={dialog}
        onBackdropPress={() => setDialog(false)}
        overlayStyle={[Common.offWhiteBackground, Common.borderRadiusTen]}
      >
        <Dialog.Title
          title="Select Verification mode for Login"
          titleStyle={[{}, Common.black, Fonts.textCenter]}
        />
        <CheckBox
          title={'SMS'}
          textStyle={[sms && Common.white, !sms && Common.black]}
          containerStyle={[
            sms && Common.primaryPinkBackground,
            Common.borderRadiusTen,
            Common.borderWidthFour,
          ]}
          checkedIcon={
            <Icon
              name="check-circle"
              type="font-awesome-5"
              size={20}
              color={sms ? 'white' : 'white'}
            />
          }
          uncheckedIcon={
            <Icon
              name="circle"
              type="font-awesome-5"
              size={20}
              color={!sms ? 'grey' : '#DB006A'}
            />
          }
          checked={sms}
          onPress={() => {
            if (email) {
              setEmail(false)
              setSms(true)
            }
          }}
        />
        <CheckBox
          title={'Email'}
          textStyle={[email && Common.white, !email && Common.black]}
          containerStyle={[
            email && Common.primaryPinkBackground,
            Common.borderRadiusTen,
            Common.borderWidthFour,
          ]}
          checkedIcon={
            <Icon
              name="check-circle"
              type="font-awesome-5"
              size={20}
              color={email ? 'white' : 'white'}
            />
          }
          uncheckedIcon={
            <Icon
              name="circle"
              type="font-awesome-5"
              size={20}
              color={!email ? 'grey' : '#DB006A'}
            />
          }
          checked={email}
          onPress={() => {
            if (sms) {
              setSms(false)
              setEmail(true)
            }
          }}
        />

        <Dialog.Actions>
          <Dialog.Button
            title="CONFIRM"
            onPress={() => onConfirmMode()}
            titleStyle={[Common.black]}
          />
          <Dialog.Button
            title="CANCEL"
            onPress={() => setDialog(false)}
            titleStyle={[Common.black]}
          />
        </Dialog.Actions>
      </Dialog>
    </View>
  )

  return (
    <SafeAreaView style={Layout.fill}>
      <View style={[Common.backgroundPrimary, Layout.fill]}>
        {selectDialog}
        {registrationDialog}
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
