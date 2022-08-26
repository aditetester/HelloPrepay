import React, { useState, useRef } from 'react'
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import { useTheme } from '@/Hooks'
import { useEffect } from 'react'
import PhoneInput from 'react-native-phone-number-input'
import Button from '@/Components/UI/Button'

const Login = ({ navigation }) => {
  const { Common, Layout, Fonts, Images, Gutters } = useTheme()
  const [value, setValue] = useState('')
  const [formattedValue, setFormattedValue] = useState('')
  const phoneInput = useRef(null)
  const [code, setCode] = useState('+1')

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    })
  }, [navigation])

  const onContinueHandler = () => {
    navigation.navigate('Otp', {
      navigateFrom: 'Login',
      countyCode: code,
      mobileNumber: value,
    })
  }

  const onRegistrationHandler = () => {
    navigation.navigate('SelectCarrier')
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
            ]}
          >
            Log in to
          </Text>
          <Text
            style={[
              Common.titleText,
              Fonts.fontWeightRegular,
              Fonts.fontSizeLarge,
            ]}
          >
            start refilling
          </Text>
        </View>
        <View
          style={[
            Common.backgroundPrimary,
            Gutters.fortyTMargin,
            Layout.selfCenter,
          ]}
        >
          <Text style={[Common.innerText, Gutters.tenVMargin]}>
            Phone Number
          </Text>
          <PhoneInput
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
              Fonts.fontSizeSmall,
              Gutters.seventyHeight,
            ]}
            // withShadow
            withDarkTheme
            // autoFocus
            placeholder="1234567890"
            textInputProps={{ placeholderTextColor: Common.greyColor }}
            textContainerStyle={Common.offWhiteColor}
          />
        </View>
        <View
          style={[
            Layout.selfCenter,
            Gutters.ninetyfivePWidth,
            Gutters.seventyHeight,
            Gutters.fiftyBMargin,
          ]}
        >
          <Button
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
            disabled={!phoneInput.current?.isValidNumber(value)}
          />
        </View>
        <View style={[Layout.row, Layout.justifyContentCenter]}>
          <Text
            style={[
              Common.innerText,
              Fonts.fontSizeSmall,
              Fonts.fontWeightSmall,
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
              ]}
            >
              {' '}
              Register your number
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Login
