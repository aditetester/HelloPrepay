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
} from 'react-native'
import { useTheme } from '@/Hooks'
import { useSelector } from 'react-redux'
import { CheckBox } from '@rneui/themed'
import Button from '@/Components/UI/Button'
import { firebase } from '@react-native-firebase/app'
import axios from 'axios'
import { BASE_URL } from '@/Config'
import { useDispatch } from 'react-redux'
import { setUser } from '@/Store/User'

const About = ({ navigation, route }) => {
  let params = route.params
  let dispatch = useDispatch()
  const { Common, Fonts, Layout, Images, Gutters } = useTheme()
  const [formattedNumber, setFormattedNumber] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const theme = useSelector(state => state.theme)
  const [check, setCheck] = useState(false)
  var onlyAlphabet = /[^a-zA-Z]/
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  let emailIsValid = emailRegex.test(email)
  let firstNameIsValid = !onlyAlphabet.test(firstName) && firstName !== ''
  let lastNameIsValid = !onlyAlphabet.test(lastName) && lastName !== ''
  let valid = check && firstNameIsValid && lastNameIsValid && emailIsValid

  const onBackHandler = () => {
    navigation.goBack()
  }

  const onContinueHandler = () => {
    axios
      .post(`${BASE_URL}register`, {
        phone_number: params.phone_number,
        first_name: firstName,
        last_name: lastName,
        email: email,
      })
      .then(res => {
        let json = JSON.stringify(res.data)
        let obj = JSON.parse(json)
        console.log('DATA', obj)
        if (obj.register === 'Registration successful') {
          navigation.navigate('SelectCarrier', {
            token: obj.token,
            first_name: firstName,
            obj: obj,
          })
          return
        } else if (obj.message.email[0] === 'Email Should Be Unique ') {
          Alert.alert('', 'Email Should Be Unique!!')
        }
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    })
  }, [navigation])

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
      return setFormattedNumber(input)
    }
    phoneFormat(params.phone_number)
  }, [params.phone_number])

  return (
    <SafeAreaView style={[Layout.fill, Common.backgroundPrimary]}>
      <ScrollView contentContainerStyle={Layout.fill}>
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
            style={[
              Common.offWhiteBackground,
              Common.borderRadius,
              Gutters.tenHMargin,
              Layout.selfCenter,
              Gutters.fiftysixHeight,
              Gutters.ninetyfivePWidth,
              Layout.flexTwo,
              Fonts.fontSizeSmall,
              Fonts.fontWeightSmall,
              Common.primaryBlue,
              Fonts.fontFamilyPrimary,
              !firstNameIsValid && Common.errorBorder,
            ]}
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
            style={[
              Common.offWhiteBackground,
              Common.borderRadius,
              Gutters.tenHMargin,
              Layout.selfCenter,
              Gutters.fiftysixHeight,
              Gutters.ninetyfivePWidth,
              Layout.flexTwo,
              Fonts.fontSizeSmall,
              Fonts.fontWeightSmall,
              Common.primaryBlue,
              Fonts.fontFamilyPrimary,
              !lastNameIsValid && Common.errorBorder,
            ]}
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
            style={[
              Common.offWhiteBackground,
              Common.borderRadius,
              Gutters.tenHMargin,
              Layout.selfCenter,
              Gutters.fiftysixHeight,
              Gutters.ninetyfivePWidth,
              Layout.flexTwo,
              Fonts.fontSizeSmall,
              Fonts.fontWeightSmall,
              Common.primaryBlue,
              Fonts.fontFamilyPrimary,
              !emailIsValid && Common.errorBorder,
            ]}
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
              +1{formattedNumber}
            </Text>
            <Image
              source={Images.verified}
              resizeMode="cover"
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
                onPress={() => console.log('pressed')}
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
                  style={[Gutters.twentyfiveHeight, Gutters.twentyfiveWidth]}
                />
              }
              uncheckedIcon={
                <Image
                  source={Images.uncheck}
                  style={[Gutters.twentyfiveHeight, Gutters.twentyfiveWidth]}
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
              onPress={() => {
                onContinueHandler()
              }}
              title={'Save and continue'}
              size="sm"
              fontSize={16}
              backgroundColor={
                valid ? Common.primaryPink.color : Common.greyColor.color
              }
              disabled={!valid}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default About
