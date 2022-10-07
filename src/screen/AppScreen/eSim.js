import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { useTheme } from '@/Hooks'
import { useSelector } from 'react-redux'
import { Button, Dialog, Icon } from '@rneui/themed'
import CalendarPicker from 'react-native-calendar-picker'
import moment from 'moment'
import { useGetPriceMutation } from '@/Services/api'

function Esim({ navigation }) {
  // NOTE: 1. Define Variables
  const { Common, Layout, Images, Gutters, Fonts } = useTheme()
  const theme = useSelector(state => state.theme)
  const userDate = useSelector(state => state.user.userData)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [IMEINumber, setIMEINumber] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [number, setNumber] = useState('')
  const [price, setPrice] = useState('')
  const [dialog, setDialog] = useState(false)

  const [IMEIError, setIMEIError] = useState(false)
  const [EmailError, setEmailError] = useState(false)

  const [imeiLoading, setIMEILoading] = useState(false)
  const [priceIsLoading, setPriceIsLoading] = useState(false)

  const validDate = (startDate === '' && endDate === '') || endDate === null

  let formattedEndingDate = new global.Date(endDate)
  let formattedStartingDate = new global.Date(startDate)

  let minDate = new global.Date()
  var duration = moment.duration({ days: 59 })
  let maxDate = moment(formattedStartingDate).add(duration)

  const withoutFormateNumber = String(number).replace(/\D/g, '')

  const finalDate =
    startDate && endDate
      ? `${formattedStartingDate
          .toISOString()
          .substring(0, 10)} to ${formattedEndingDate
          .toISOString()
          .substring(0, 10)}`
      : 'Please Select Date Rang'

  var a = moment(formattedEndingDate)
  var b = moment(formattedStartingDate)
  let totalDay = a.diff(b, 'days') + 1

  let allDataIsValid =
    !validDate &&
    IMEINumber !== '' &&
    firstName !== '' &&
    lastName !== '' &&
    email !== '' &&
    number.length === 14

  const [
    getPrice,
    { data: priceData, isLoading: priceLoading, error: priceError },
  ] = useGetPriceMutation()

  // NOTE: 2. Handler Method

  const onBuyNowHandler = () => {
    navigation.navigate('Checkout', {
      amount: price.price.slice(17),
      phone_number: withoutFormateNumber,
      formattedNumber: String(number),
      totalAmount: price.price.slice(17),
      navigateFor: 'eSim',
    })
  }

  const GetPriceHandler = () => {
    if (!validDate && totalDay >= 61) {
      Alert.alert('', 'Please Select date under 60 days')
      setPrice('')
      return
    } else if (!validDate) {
      getPrice({
        body: {
          pid: 'ATT-ESIM-US-CA-MEX',
          end_date: formattedEndingDate.toISOString().substring(0, 10),
          start_date: formattedStartingDate.toISOString().substring(0, 10),
        },
        token: '577|oIBmnTxn7pjuxyn1NB6MqpOKl7wKEnhyDJAkQ6nk',
        // token: userDate.token,
      })
    }
  }

  const onCheckIMEINumber = () => {
    setIMEIError(true)
    console.log('IMEI On Blur')
  }

  const Date = (date, type) => {
    if (type === 'END_DATE') {
      setEndDate(date)
    } else {
      setEndDate(null)
      setStartDate(date)
    }
  }

  // NOTE: 3. Life Cycle Method

  useEffect(() => {
    if (priceData) {
      setPrice(priceData)
    }
  }, [priceData])

  useEffect(() => {
    if (priceLoading) {
      setPriceIsLoading(true)
    } else {
      setPriceIsLoading(false)
    }
  }, [priceLoading])

  useEffect(() => {
    if (priceError) {
      Alert.alert('Error!', `Server Down ${priceError.originalStatus}`)
    }
  }, [priceError])

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
      headerTitle: () => (
        <Image
          source={Images.Logo}
          style={[Gutters.headerWidthWidth, Common.resizeModeContain]}
        />
      ),
      headerTitleAlign: 'center',
    })
  }, [navigation, theme])

  // NOTE: 4. Render Method

  let selectDate = (
    <View>
      <Dialog
        isVisible={dialog}
        onBackdropPress={() => {
          setDialog(false)
        }}
        overlayStyle={[
          Common.offWhiteBackground,
          Common.borderRadiusTen,
          { width: '95%' },
        ]}
      >
        <CalendarPicker
          startFromMonday={false}
          allowRangeSelection={true}
          minDate={minDate}
          maxDate={maxDate}
          todayBackgroundColor="#f2e6ff"
          selectedDayColor="#DB006A"
          selectedDayTextColor="#FFFFFF"
          onDateChange={Date}
          disableArrowLeft={true}
          previousTitleStyle={{ color: 'black' }}
          nextTitleStyle={{ color: 'black' }}
        />

        <Dialog.Actions>
          <Dialog.Button
            title="CONFIRM"
            disabled={validDate}
            onPress={() => {
              setDialog(false)
              GetPriceHandler()
            }}
            titleStyle={[Common.black]}
          />
        </Dialog.Actions>
      </Dialog>
    </View>
  )

  return (
    <SafeAreaView style={[Layout.fill, Common.backgroundPrimary]}>
      <ScrollView style={[Layout.fill, Common.backgroundPrimary]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[Gutters.twentyHMargin]}
        >
          <Image source={Images.LeftArrow} />
        </Pressable>
        <View style={[Gutters.twentyFourHMargin, Gutters.tenTMargin]}>
          <Text
            style={[
              { textAlign: 'center' },
              Common.titleText,
              Fonts.fontSizeMedium,
              Fonts.fontWeightSmall,
            ]}
          >
            AT&T eSIM Unlimited Talk (calls) and Internet for USA, Canada and
            Mexico and Puerto Rico (ATT Prepaid)
          </Text>
          <Text
            style={[
              { textAlign: 'center' },
              Common.titleText,
              Fonts.fontSizeExtraSmall,
              Fonts.fontWeightSmall,
              Gutters.tenVMargin,
            ]}
          >
            Unlimited talk (calls) and data for USA, Canada and Mexico and
            Puerto Rico
          </Text>
          <Text
            style={[
              { textAlign: 'center' },
              Common.titleText,
              Fonts.fontSizeExtraSmall,
              Fonts.fontWeightSmall,
              Gutters.tenBMargin,
            ]}
          >
            Unlimited talk (calls) and data in the USA, Canada and Mexico and
            Puerto Rico Pay for the days you use We blocked outgoing SMS in this
            product due fraud activities. Please use data-based messages apps.
          </Text>
        </View>
        <View style={[{ justifyContent: 'center' }, Gutters.twentyFourHMargin]}>
          {selectDate}
          <Pressable
            android_ripple={8}
            onPress={() => setDialog(true)}
            style={[
              {
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
              },
              Common.primaryBlue,
              Common.borderRadius,
              Common.offWhiteBackground,
              Gutters.tenVMargin,
              Gutters.fiftysixHeight,
              Gutters.tenHPadding,
            ]}
          >
            <Text
              style={[
                startDate && endDate
                  ? Common.primaryBlue
                  : Common.placeHolderText,
                Fonts.fontWeightSmall,
                Fonts.fontSizeSmall,
                Fonts.fontFamilyPrimary,
              ]}
            >
              {finalDate}
            </Text>
            <Icon
              onPress={() => setDialog(true)}
              name={'calendar-alt'}
              type="font-awesome-5"
              color="#517fa4"
            />
          </Pressable>
          <TextInput
            value={IMEINumber}
            placeholder="Enter IMEI Number"
            keyboardType="phone-pad"
            onBlur={() => onCheckIMEINumber()}
            placeholderTextColor={Common.placeHolderText.color}
            onChangeText={text => setIMEINumber(text)}
            style={[
              Common.primaryBlue,
              Fonts.fontWeightSmall,
              Common.borderRadius,
              Common.offWhiteBackground,
              IMEIError && Common.errorBorder,
              Gutters.tenVMargin,
              Gutters.fiftysixHeight,
              Fonts.fontSizeSmall,
              Fonts.fontFamilyPrimary,
              Gutters.tenHPadding,
            ]}
          />
          <TextInput
            value={firstName}
            placeholder="First Name"
            placeholderTextColor={Common.placeHolderText.color}
            onChangeText={text => setFirstName(text)}
            style={[
              Common.primaryBlue,
              Fonts.fontWeightSmall,
              Common.borderRadius,
              Common.offWhiteBackground,
              Gutters.tenVMargin,
              Gutters.fiftysixHeight,
              Fonts.fontSizeSmall,
              Fonts.fontFamilyPrimary,
              Gutters.tenHPadding,
            ]}
          />
          <TextInput
            value={lastName}
            placeholder="Last Name"
            placeholderTextColor={Common.placeHolderText.color}
            onChangeText={text => setLastName(text)}
            style={[
              Common.primaryBlue,
              Fonts.fontWeightSmall,
              Common.borderRadius,
              Common.offWhiteBackground,
              Gutters.tenVMargin,
              Gutters.fiftysixHeight,
              Fonts.fontSizeSmall,
              Fonts.fontFamilyPrimary,
              Gutters.tenHPadding,
            ]}
          />
          <TextInput
            value={email}
            placeholder="Email"
            placeholderTextColor={Common.placeHolderText.color}
            onChangeText={text => setEmail(text)}
            keyboardType="email-address"
            style={[
              Common.primaryBlue,
              Fonts.fontWeightSmall,
              Common.borderRadius,
              Common.offWhiteBackground,
              EmailError && Common.errorBorder,
              Gutters.tenVMargin,
              Gutters.fiftysixHeight,
              Fonts.fontSizeSmall,
              Fonts.fontFamilyPrimary,
              Gutters.tenHPadding,
            ]}
          />
          <View style={[Layout.row, Gutters.hundredPWidth]}>
            <TextInput
              defaultValue="+1"
              editable={false}
              style={[
                Common.primaryBlue,
                Fonts.fontWeightSmall,
                Fonts.fontSizeMedium,
                Fonts.textCenter,
                Fonts.fontFamilyPrimary,
                Common.offWhiteBackground,
                Common.borderTopLeftRadius,
                Common.borderBottomLeftRadius,
                Gutters.twentyPWidth,
                Gutters.fiftysixHeight,
                Gutters.tenVMargin,
              ]}
            />
            <TextInput
              value={number}
              placeholder="(415) 333-3333"
              maxLength={14}
              keyboardType="numeric"
              onChangeText={num => setNumber(num)}
              placeholderTextColor={Common.placeHolderText.color}
              style={[
                Common.primaryBlue,
                Fonts.fontWeightSmall,
                Fonts.fontSizeMedium,
                Fonts.fontFamilyPrimary,
                Common.offWhiteBackground,
                Common.borderTopRightRadius,
                Common.borderBottomRightRadius,
                Gutters.eightyPWidth,
                Gutters.fiftysixHeight,
                Layout.alignItemsCenter,
                Gutters.tenVMargin,
              ]}
            />
          </View>
        </View>
        <View
          style={[
            Gutters.twentyFourHMargin,
            Layout.justifyContentCenter,
            Layout.alignItemsCenter,
          ]}
        >
          {priceIsLoading ? (
            // <LinearProgress
            //   style={[Gutters.tenMargin, Gutters.seventyPWidth]}
            //   color={
            //     theme.darkMode ? Common.white.color : Common.primaryPink.color
            //   }
            //   value={10}
            //   variant="indeterminate"
            // />
            <ActivityIndicator size="small" color={Common.primaryPink.color} />
          ) : (
            <Text style={[Common.titleText]}>
              {price !== '' ? `${price.price}` : ''}
            </Text>
          )}
        </View>
        <View
          style={[
            { justifyContent: 'center', marginVertical: 15 },
            Gutters.twentyFourHMargin,
          ]}
        >
          <Button
            title={'Buy Now'}
            onPress={() => onBuyNowHandler()}
            disabled={!allDataIsValid}
            disabledStyle={[Common.whiteColor, Common.greyBackground]}
            disabledTitleStyle={[Common.whiteColor, Gutters.zeroOsevenOpacity]}
            buttonStyle={[
              {
                borderRadius: 5,
                height: 50,
              },
              Common.primaryPinkBackground,
            ]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Esim