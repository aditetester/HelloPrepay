import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  Linking,
} from 'react-native'
import { useTheme } from '@/Hooks'
import { useSelector } from 'react-redux'
import { CheckBox } from '@rneui/themed'
import { Button } from '@rneui/themed'
import { useGetRegisterUserMutation } from '@/Services/api'
import { scale, verticalScale } from 'react-native-size-matters'

const About = ({ navigation, route }) => {
  //NOTE: 1. Define Variables
  let params = route.params
  const [buttonLoading, setButtonLoading] = useState(false)
  const { Common, Fonts, Layout, Images, Gutters } = useTheme()
  const [formattedNumber, setFormattedNumber] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [check, setCheck] = useState(false)
  var onlyAlphabet = /[^a-zA-Z]/
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  let emailIsValid = emailRegex.test(email)
  let firstNameIsValid = !onlyAlphabet.test(firstName) && firstName !== ''
  let lastNameIsValid = !onlyAlphabet.test(lastName) && lastName !== ''
  let valid = check && firstNameIsValid && lastNameIsValid && emailIsValid

  //NOTE: 2. Helper Method

  const onBackHandler = () => {
    navigation.goBack()
  }

  const [getRegister, { data, isLoading, error }] = useGetRegisterUserMutation()

  const onContinueHandler = () => {
    getRegister({
      phone_number: params.phone_number,
      first_name: firstName,
      last_name: lastName,
      email: email,
    })
  }

  const onFirstNameBlur = () => {
    setFirstName(firstName.trim())
  }
  const onLastNameBlur = () => {
    setLastName(lastName.trim())
  }
  const onEmailBlur = () => {
    setEmail(email.trim())
  }

  //NOTE: 3. Life Cycle

  useEffect(() => {
    if (isLoading) {
      setButtonLoading(true)
    } else {
      setButtonLoading(false)
    }
  }, [isLoading])

  useEffect(() => {
    if (data && data.register === 'Registration successful') {
      navigation.navigate('SelectCarrier', {
        token: data.token,
        first_name: firstName,
        data: data,
      })
      return
    } else {
      if (data) {
        console.log(data)
        try {
          if (
            String(data.message.email[0]) === 'Email Should Be Unique ' ||
            String(data.message.email[0]) ===
              'The email has already been taken.'
          ) {
            Alert.alert(
              'Email !!',
              'This Email is already in use!! \n Use Different Email',
            )
          } else if (
            String(data.message.phone_number[0]) ===
            'The phone number has already been taken.'
          ) {
            Alert.alert(
              'Phone Number !!',
              'The phone number has already been taken.',
            )
          } else {
            console.log(error && error)
            console.log(data && data)
            Alert.alert('Opps!!', 'Something went wrong')
          }
        } catch (err) {
          Alert.alert('Opps!!', 'Something went wrong try')
        }
      }
    }
  }, [data])

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
      return setFormattedNumber(input)
    }
    phoneFormat(params.phone_number)
  }, [params.phone_number])

  //NOTE: 4. Render Method

  return (
    <SafeAreaView style={[Layout.fill, Common.backgroundPrimary]}>
      <ScrollView contentContainerStyle={Layout.fill}>
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
            About you
          </Text>
        </View>
        <View style={Layout.flexFifteen}>
          <Text
            style={[
              Common.titleText,
              Fonts.fontWeightSmall,
              Fonts.fontSizeExtraSmall,
              Gutters.tenLMargin,
              Gutters.fiveVMargin,
              Layout.fill,
              Fonts.fontFamilyPrimary,
            ]}
          >
            First Name
          </Text>
          <TextInput
            value={firstName}
            style={[
              { height: verticalScale(56), paddingLeft: 15 },
              !firstNameIsValid && Common.errorBorder,
              Common.offWhiteBackground,
              Common.borderRadius,
              Common.primaryBlue,
              Layout.selfCenter,
              Layout.flexTwo,
              Gutters.tenHMargin,
              Gutters.ninetyfivePWidth,
              Gutters.tenHPadding,
              Fonts.fontSizeSmall,
              Fonts.fontWeightSmall,
              Fonts.fontFamilyPrimary,
            ]}
            onBlur={onFirstNameBlur}
            onChangeText={text => setFirstName(text)}
          />
          <Text
            style={[
              Common.titleText,
              Fonts.fontWeightSmall,
              Fonts.fontSizeExtraSmall,
              Gutters.tenLMargin,
              Gutters.fiveVMargin,
              Layout.fill,
              Fonts.fontFamilyPrimary,
            ]}
          >
            Last name
          </Text>
          <TextInput
            value={lastName}
            style={[
              { height: verticalScale(56), paddingLeft: 15 },
              Common.offWhiteBackground,
              Common.borderRadius,
              Gutters.tenHMargin,
              Layout.selfCenter,
              Gutters.ninetyfivePWidth,
              Layout.flexTwo,
              Fonts.fontSizeSmall,
              Fonts.fontWeightSmall,
              Common.primaryBlue,
              Fonts.fontFamilyPrimary,
              Gutters.tenHPadding,
              !lastNameIsValid && Common.errorBorder,
            ]}
            onBlur={onLastNameBlur}
            onChangeText={text => setLastName(text)}
          />
          <Text
            style={[
              Common.titleText,
              Fonts.fontWeightSmall,
              Fonts.fontSizeExtraSmall,
              Gutters.tenLMargin,
              Gutters.fiveVMargin,
              Layout.fill,
              Fonts.fontFamilyPrimary,
            ]}
          >
            Email
          </Text>
          <TextInput
            keyboardType="email-address"
            value={email}
            style={[
              { height: verticalScale(56), paddingLeft: 15 },
              Common.offWhiteBackground,
              Common.borderRadius,
              Gutters.tenHMargin,
              Layout.selfCenter,
              Gutters.ninetyfivePWidth,
              Layout.flexTwo,
              Fonts.fontSizeSmall,
              Fonts.fontWeightSmall,
              Common.primaryBlue,
              Fonts.fontFamilyPrimary,
              Gutters.tenHPadding,
              !emailIsValid && Common.errorBorder,
            ]}
            onBlur={onEmailBlur}
            onChangeText={e => setEmail(e)}
          />
          <Text
            style={[
              Common.titleText,
              Fonts.fontWeightSmall,
              Fonts.fontSizeExtraSmall,
              Gutters.tenLMargin,
              Gutters.fiveVMargin,
              Layout.fill,
              Fonts.fontFamilyPrimary,
            ]}
          >
            Phone number
          </Text>
          <View
            style={[
              Common.offWhiteBackground,
              Common.borderRadius,
              Gutters.tenHMargin,
              Layout.selfCenter,
              Gutters.ninetyfivePWidth,
              Layout.row,
              Layout.center,
              Layout.justifyContentBetween,
              Layout.flexTwo,
              Gutters.fiveBMargin,
            ]}
          >
            <Text
              style={[
                Fonts.fontSizeSmall,
                Layout.fill,
                Gutters.tenHMargin,
                Common.greyColor,
                Fonts.fontFamilyPrimary,
              ]}
            >
              +1 {formattedNumber}
            </Text>
            <Image
              source={Images.verified}
              resizeMode="contain"
              style={[
                Gutters.fourtyfivePHeight,
                Gutters.twentyfivePWidth,
                Gutters.tenHMargin,
              ]}
            />
          </View>
        </View>
        <View style={[Layout.flexTen]}>
          <View
            style={[
              Layout.center,
              Layout.fill,
              Gutters.sixteenHMargin,
              Gutters.tenVMargin,
              Gutters.eightyPWidth,
            ]}
          >
            <Text
              style={[
                Fonts.fontWeightSmall,
                Common.textColor,
                Common.innerText,
                Fonts.fontSizeExtraSmall,
                Fonts.fontFamilyPrimary,
              ]}
            >
              By sending this information you are agreeing the{' '}
              <Text
                onPress={() => Linking.openURL('https://www.google.com/')}
                style={[
                  Common.textColor,
                  Common.innerText,
                  Fonts.fontWeightRegular,
                  Fonts.textDecorationLineUnderline,
                  Fonts.fontFamilyPrimary,
                ]}
              >
                Terms and Conditions
              </Text>{' '}
              stated by CarrierApp.
            </Text>
          </View>
          <View
            style={[Common.backgroundPrimary, Layout.row, Layout.fullWidth]}
          >
            <CheckBox
              containerStyle={[
                Common.backgroundPrimary,
                Layout.fullWidth,
                Layout.fill,
                Gutters.tenLMargin,
                Layout.justifyContentCenter,
              ]}
              textStyle={[
                Common.primaryBlueMode,
                Fonts.fontWeightRegular,
                Fonts.fontSizeExtraSmall,
                Fonts.fontFamilyPrimary,
              ]}
              checkedIcon={
                <Image
                  source={Images.check}
                  resizeMode="contain"
                  style={[{ height: verticalScale(25), width: scale(25) }]}
                />
              }
              uncheckedIcon={
                <Image
                  source={Images.uncheck}
                  resizeMode="contain"
                  style={[{ height: verticalScale(25), width: scale(25) }]}
                />
              }
              title="I agree to terms and conditions"
              checked={check}
              onPress={() => setCheck(!check)}
            />
          </View>

          <View
            style={[
              Layout.center,
              Gutters.ninetyfivePWidth,
              Layout.selfCenter,
              Layout.fill,
              Gutters.tenVMargin,
            ]}
          >
            <Button
              title="Save and continue"
              loading={buttonLoading}
              onPress={() => {
                onContinueHandler()
              }}
              loadingProps={[{ size: 'small' }, Common.whiteColor]}
              titleStyle={[Fonts.fontSize12, Fonts.fontFamilyPrimary]}
              buttonStyle={[
                { height: verticalScale(55) },
                Common.primaryPinkBackground,
                Common.borderRadius,
              ]}
              containerStyle={[
                Gutters.ninetyfivePWidth,
                Layout.selfCenter,
                Common.borderRadius,
              ]}
              disabled={!valid}
              disabledStyle={[Common.whiteColor, Common.greyBackground]}
              disabledTitleStyle={[
                Common.whiteColor,
                Gutters.zeroOsevenOpacity,
              ]}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default About
