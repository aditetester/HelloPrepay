import React, { useEffect, useState, useRef } from 'react'
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
  TouchableOpacity,
} from 'react-native'
import { useTheme } from '@/Hooks'
import { useSelector } from 'react-redux'
import { Button, Dialog, Icon } from '@rneui/themed'
import CalendarPicker from 'react-native-calendar-picker'
import moment from 'moment'
import { useCheckIMEINumberMutation, useGetPriceMutation } from '@/Services/api'
import * as Animatable from 'react-native-animatable'
import Spinner from 'react-native-loading-spinner-overlay'
import { verticalScale, scale } from 'react-native-size-matters'

function Esim({ navigation }) {
  //############################################################
  //NOTE: DEFINE VARIABLE
  //############################################################
  const { Common, Layout, Images, Gutters, Fonts } = useTheme()
  const theme = useSelector(state => state.theme)
  const userData = useSelector(state => state.user.userData)
  const [scrollRef, setScrollRef] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [IMEINumber, setIMEINumber] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [number, setNumber] = useState('')
  const [price, setPrice] = useState('')
  const [dialog, setDialog] = useState(false)

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  let emailIsValid = emailRegex.test(email)

  const [IMEIError, setIMEIError] = useState(true)
  const [EmailError, setEmailError] = useState(false)

  const [priceIsLoading, setPriceIsLoading] = useState(false)

  const validDate = (startDate === '' && endDate === '') || endDate === null

  let formattedEndingDate = new global.Date(endDate)
  let formattedStartingDate = new global.Date(startDate)

  let minDate = new global.Date()
  var duration = moment.duration({ days: 59 })
  let maxDate = moment(formattedStartingDate).add(duration)

  const withoutFormateNumber = String(number).replace(/\D/g, '')

  let simpleStartDate = moment(startDate).format('YYYY-MM-DD')
  let simpleEndDate = moment(endDate).format('YYYY-MM-DD')

  const finalDate = `${simpleStartDate} to ${simpleEndDate}`

  var a = moment(formattedEndingDate)
  var b = moment(formattedStartingDate)
  let totalDay = a.diff(b, 'days') + 1

  let allDataIsValid =
    !validDate &&
    IMEINumber !== '' &&
    IMEIError !== false &&
    firstName !== '' &&
    lastName !== '' &&
    emailIsValid &&
    number.length === 14

  console.log('allDataIsValid', allDataIsValid)

  const [
    getPrice,
    { data: priceData, isLoading: priceLoading, error: priceError },
  ] = useGetPriceMutation()

  const [
    checkIMEI,
    { data: IMEIData, isLoading: IMEIIsLoading, error: IMEIErrors },
  ] = useCheckIMEINumberMutation()

  //############################################################
  //NOTE: HELPER METHOD
  //############################################################

  const onBuyNowHandler = () => {
    try {
      navigation.navigate('Checkout', {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: withoutFormateNumber,
        sku: 'ATT-ESIM-US-CA-MEX',
        start_date: simpleStartDate,
        end_date: simpleEndDate,
        IMEINumber: '353974107950262',
        amount: String(price.price.split(',')[1].trim().slice(7)),
        formattedNumber: String(number),
        totalAmount: price.price.slice(17),
        navigateFor: 'eSimOrder',
        FullPlanName: `Esim ${price.price.slice(17)}`,
      })
    } catch {
      Alert.alert('Opps!', 'Please select date again')
    }
  }

  const onScrollHandle = () => {
    scrollRef.scrollTo({
      x: 0,
      y: 500,
      animation: true,
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
          // pid: 'ATT-ESIM-US-CA-MEX',
          end_date: formattedEndingDate.toISOString().substring(0, 10),
          start_date: formattedStartingDate.toISOString().substring(0, 10),
        },
        // token: '577|oIBmnTxn7pjuxyn1NB6MqpOKl7wKEnhyDJAkQ6nk',
        token: userData.token,
      })
    }
  }

  const onCheckIMEINumber = () => {
    if (IMEINumber.length === 0) {
      return
    }
    checkIMEI({ body: { imei: IMEINumber }, token: userData.token })
  }

  const Date = (date, type) => {
    if (type === 'END_DATE') {
      setEndDate(date)
    } else {
      setEndDate(null)
      setStartDate(date)
    }
  }

  const emailCheck = () => {
    if (emailIsValid) {
      setEmailError(false)
    } else {
      setEmailError(true)
    }
  }

  //############################################################
  //NOTE: LIFE CYCLE METHOD
  //############################################################

  useEffect(() => {
    if (priceData) {
      setPrice(priceData)
      onScrollHandle()
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
      headerStyle: {
        backgroundColor: Common.backgroundPrimary.backgroundColor,
        height: verticalScale(50),
      },
      headerLeft: () => (
        <TouchableOpacity
          style={[
            // Gutters.fifteenPWidth,
            Gutters.fiveTMargin,
            Gutters.tenHMargin,
          ]}
          onPress={() => navigation.navigate('Home')}
        >
          <Image
            source={Images.LeftArrow}
            style={{ height: verticalScale(20), width: scale(30) }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <Image
          source={Images.Logo}
          style={[{ width: scale(100) }, Common.resizeModeContain]}
        />
      ),
      headerTitleAlign: 'center',
    })
  }, [navigation, theme])

  useEffect(() => {
    if (IMEIData && IMEIData.status === 'error') {
      setIMEIError(false)
      Alert.alert('Invalid IMEI Number', IMEIData.message, ['OK'])
    } else if (IMEIData && IMEIData.status === 'success') {
      setIMEIError(true)
    }
  }, [IMEIData])

  useEffect(() => {
    if (IMEIErrors || priceError) {
      Alert.alert(
        'Opps!',
        'Something went wrong...\nPlease check your internet connection or \nTry again later',
      )
    }
  }, [IMEIErrors, priceError])

  //############################################################
  //NOTE: RENDER METHOD
  //############################################################

  const loadingSpinner = (
    <Spinner
      visible={IMEIIsLoading || priceLoading}
      textContent={'Loading...'}
      textStyle={{ color: '#FFF', alignItems: 'center' }}
    />
  )

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
          todayBackgroundColor="#ffafcc"
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
            titleStyle={[Fonts.fontSize12, Common.black]}
          />
        </Dialog.Actions>
      </Dialog>
    </View>
  )

  //#endregion

  return (
    <SafeAreaView style={[Layout.fill, Common.backgroundPrimary]}>
      <ScrollView
        style={[Layout.fill, Common.backgroundPrimary]}
        ref={ref => setScrollRef(ref)}
      >
        {loadingSpinner}
        <View style={[Gutters.twentyFourHMargin, Gutters.tenTMargin]}>
          <Text
            style={[
              { textAlign: 'center' },
              Common.titleText,
              Fonts.fontSizeMedium,
              Fonts.fontWeightSmall,
            ]}
          >
            {userData.carrier_name} eSIM Unlimited Talk (calls) and Internet for
            USA, Canada and Mexico and Puerto Rico (ATT Prepaid)
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
            onPress={() => {
              setDialog(true)
              setStartDate('')
              setEndDate('')
            }}
            style={[
              {
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
                height: verticalScale(56),
              },
              Common.primaryBlue,
              Common.borderRadius,
              Common.offWhiteBackground,
              Gutters.tenVMargin,
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
              {startDate && endDate ? finalDate : 'Please Select Date Rang..'}
            </Text>
            <Icon
              // onPress={() => setDialog(true)}
              size={scale(20)}
              name={'calendar-alt'}
              type="font-awesome-5"
              color="#517fa4"
            />
          </Pressable>
          <TextInput
            value={IMEINumber}
            // defaultValue="353974107950262"
            placeholder="Enter IMEI Number"
            keyboardType="phone-pad"
            onBlur={() => onCheckIMEINumber()}
            placeholderTextColor={Common.placeHolderText.color}
            onChangeText={text => setIMEINumber(text)}
            style={[
              { height: verticalScale(56) },
              Common.primaryBlue,
              Fonts.fontWeightSmall,
              Common.borderRadius,
              Common.offWhiteBackground,
              !IMEIError && Common.errorBorder,
              Gutters.tenVMargin,
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
              { height: verticalScale(56) },
              Common.primaryBlue,
              Fonts.fontWeightSmall,
              Common.borderRadius,
              Common.offWhiteBackground,
              Gutters.tenVMargin,
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
              {
                height: verticalScale(56),
              },
              Common.primaryBlue,
              Fonts.fontWeightSmall,
              Common.borderRadius,
              Common.offWhiteBackground,
              Gutters.tenVMargin,
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
            onBlur={() => emailCheck()}
            keyboardType="email-address"
            style={[
              {
                height: verticalScale(56),
              },
              Common.primaryBlue,
              Fonts.fontWeightSmall,
              Common.borderRadius,
              Common.offWhiteBackground,
              EmailError && Common.errorBorder,
              Gutters.tenVMargin,
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
                { height: verticalScale(56) },
                Common.primaryBlue,
                Fonts.fontWeightSmall,
                Fonts.fontSizeMedium,
                Fonts.textCenter,
                Fonts.fontFamilyPrimary,
                Common.offWhiteBackground,
                Common.borderTopLeftRadius,
                Common.borderBottomLeftRadius,
                Gutters.twentyPWidth,
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
                { height: verticalScale(56) },
                Common.primaryBlue,
                Fonts.fontWeightSmall,
                Fonts.fontSizeMedium,
                Fonts.fontFamilyPrimary,
                Common.offWhiteBackground,
                Common.borderTopRightRadius,
                Common.borderBottomRightRadius,
                Gutters.eightyPWidth,
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
            <ActivityIndicator size="small" color={Common.primaryPink.color} />
          ) : (
            <Animatable.Text
              animation="bounceIn"
              duration={1000}
              style={[
                Common.errorColor,
                Fonts.fontWeightSmall,
                Fonts.fontSizeSmall,
              ]}
            >
              {price !== '' ? `${price.price}` : 'Select Date'}
            </Animatable.Text>
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
            titleStyle={[Fonts.fontSizeSmall]}
            disabled={!allDataIsValid}
            disabledStyle={[Common.whiteColor, Common.greyBackground]}
            disabledTitleStyle={[Common.whiteColor, Gutters.zeroOsevenOpacity]}
            raised={false}
            buttonStyle={[
              { borderRadius: 5, height: scale(50) },
              Common.primaryPinkBackground,
            ]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Esim
