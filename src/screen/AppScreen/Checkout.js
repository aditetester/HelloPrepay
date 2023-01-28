import React, { useEffect, useState, useRef, Fragment } from 'react'
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Modal,
  Pressable,
  Alert,
} from 'react-native'
import { useSelector } from 'react-redux'
import { useTheme } from '@/Hooks'
import { CheckBox, LinearProgress, Button, Icon } from '@rneui/themed'
import {
  CardNumberTextInput,
  CardDateTextInput,
} from 'rn-credit-card-textinput'
import GestureRecognizer from 'react-native-swipe-gestures'
import {
  useGetRechargeMutation,
  usePlaceEsimOrderMutation,
} from '@/Services/api'
import { scale, verticalScale } from 'react-native-size-matters'
// import { PaymentRequest } from 'react-native-payments'

const Checkout = ({ navigation, route }) => {
  //############################################################
  //NOTE: DEFINE VARIABLE
  //############################################################
  let params = route.params
  // console.log('🚀 Checkout', params)
  const platform = Platform.OS
  const theme = useSelector(state => state.theme)
  const userData = useSelector(state => state.user.userData)
  // console.log(userData.first_name)
  const token = String(userData.token)
  const { Common, Layout, Images, Gutters, Fonts } = useTheme()
  const [scrollRef, setScrollRef] = useState(null)

  const [spinner, setSpinner] = useState(false)
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardDate, setCardDate] = useState('')
  const [CVV, setCVV] = useState('')
  const [address, setAddress] = useState('')
  const [aptSuite, setAptSuite] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [useNumber, setUseNumber] = useState(false)
  const [agree, setAgree] = useState(false)
  const [number, setNumber] = useState(userData.phone_number)
  const [modalVisible, setModalVisible] = useState(false)

  const [cardNumberError, setCardNumberError] = useState(false)
  const [cardNameError, setCardNameError] = useState(false)
  const [cardDateError, setCardDateError] = useState(false)
  const [CVVError, setCVVError] = useState(false)
  const [addressError, setAddressError] = useState(false)
  const [aptSuiteError, setAptSuiteError] = useState(false)
  const [zipCodeError, setZipCodeError] = useState(false)
  const [cityError, setCityError] = useState(false)
  const [stateError, setStateError] = useState(false)
  const [phoneNumberError, setPhoneNumberError] = useState(false)
  const [agreeError, setAgreeError] = useState(false)

  const cardNameIsValid = cardName.length > 1
  const cardNumberIsValid = cardNumber.length > 10
  const cardDateIsValid = cardDate.length !== 0
  const CVVIsValid = CVV.length === 3
  const addressIsValid = address.length > 5
  const aptSuiteIsValid = aptSuite.length > 2
  const cityIsValid = city.length > 2
  const stateIsValid = state.length > 2
  const zipCodeIsValid = zipCode.length > 2
  const dataIsValid =
    cardNameIsValid &&
    cardNumberIsValid &&
    cardDateIsValid &&
    CVVIsValid &&
    addressIsValid &&
    aptSuiteIsValid &&
    cityIsValid &&
    stateIsValid &&
    agree &&
    zipCodeIsValid
  // console.log('cardNameIsValid', cardNameIsValid)
  const [
    getRecharge,
    { data: rechargeData, isLoading: rechargeIsLoading, error: rechargeError },
  ] = useGetRechargeMutation()

  const [
    getEsimOrder,
    { data: EsimOrderData, isLoading: EsimOrderLoading, error: EsimOrderError },
  ] = usePlaceEsimOrderMutation()

  //############################################################
  //NOTE: Apple Pay Configuration
  //############################################################

  //"react-native-payments": "^0.8.4",
  // const applePaymentSuccess = async () => {
  //   await setTimeout(() => {
  //     navigation.navigate('PaymentSuccess')
  //   }, 1000)
  // }

  // const applepayComponent = () => {
  //   const applePay = () => {
  //     const IOS_METHOD_DATA = [
  //       {
  //         supportedMethods: ['apple-pay'],
  //         data: {
  //           merchantIdentifier: 'merchant.com.prepaidiq.d2c',
  //           // merchantIdentifier: 'merchant.apple.test',
  //           supportedNetworks: ['visa', 'mastercard', 'amex'],
  //           countryCode: 'US',
  //           currencyCode: 'USD',
  //           // paymentMethodTokenizationParameters: {
  //           //   // parameters: {
  //           //   //   gateway: 'nmi',
  //           //   //   'nmi:publishableKey': 'STRIPE-PK-KEY',
  //           //   // },
  //           // },
  //         },
  //       },
  //     ]

  //     const IOS_DETAILS = {
  //       id: 'basic-example',
  //       displayItems: [
  //         {
  //           label: params.FullPlanName,
  //           amount: { currency: 'USD', value: params.amount.replace('$', '') },
  //         },
  //       ],

  //       total: {
  //         label: 'to Helloprepay',
  //         amount: {
  //           currency: 'USD',
  //           value: `${params.amount.replace('$', '')}`,
  //         },
  //       },
  //     }

  //     const paymentRequest = new PaymentRequest(IOS_METHOD_DATA, IOS_DETAILS)

  //     paymentRequest
  //       .canMakePayments()
  //       .then(canMakePayment => {
  //         if (canMakePayment) {
  //           paymentRequest
  //             .show()
  //             .then(paymentResponse => {
  //               // // Your payment processing code goes here
  //               console.log('Apple pay Success', paymentResponse)
  //               paymentResponse.complete('success')
  //               applePaymentSuccess()
  //             })
  //             .catch(errors => {
  //               // paymentRequest.abort()
  //               console.log('Apple pay Error', errors)
  //               // paymentRequest.complete('fail')
  //               // Alert.alert('Opps!', 'Something went wrong Apple-Pay', [
  //               //   { title: 'Ok' },
  //               // ])
  //               // setModalVisible(true)
  //             })
  //         } else {
  //           Alert.alert(
  //             'Apple Pay',
  //             'Apple Pay is not available in this device',
  //           )
  //         }
  //       })
  //       .catch(errors => {
  //         console.log('Can Make Payments Error', errors.message)
  //       })
  //   }
  //   return (
  //     <View>
  //       <TouchableOpacity
  //         onPress={() => applePay()}
  //         style={[
  //           { height: scale(60) },
  //           // Gutters.sixtyHeight,
  //           Layout.row,
  //           Gutters.fiveVMargin,
  //           Common.offWhiteSecondaryBorder,
  //         ]}
  //       >
  //         <ImageBackground
  //           source={Images.applepay}
  //           resizeMode="stretch"
  //           style={[Layout.fullSize, Common.borderRadius]}
  //         />
  //       </TouchableOpacity>
  //     </View>
  //   )
  // }

  //#endregion

  //#region Google Pay Configuration

  // const googlePayComponent = () => {
  //   const googlePay = () => {
  //     const ANDROID_METHOD_DATA = [
  //       {
  //         supportedMethods: ['android-pay'],
  //         data: {
  //           supportedNetworks: ['visa', 'mastercard', 'amex'],
  //           currencyCode: 'USD',
  //           environment: 'TEST', // defaults to production
  //           paymentMethodTokenizationParameters: {
  //             tokenizationType: 'NETWORK_TOKEN',
  //             parameters: {
  //               publicKey:
  //                 'BFEC244s+3h7MK8gNkvV1HwlnEpEl7cV5PHNdKRebxlmL6Qz+SCDnMc3SoWDsCX0YWGagDqk5eWhn19UvoeXILQ=',
  //             },
  //           },
  //         },
  //       },
  //     ]

  //     // const ANDROID_OPTIONS = {
  //     //   requestPayerName: true,
  //     //   requestPayerPhone: true,
  //     //   requestPayerEmail: true,
  //     //   requestShipping: true,
  //     // }

  //     const ANDROID_DETAILS = {
  //       id: 'basic-example',
  //       displayItems: [
  //         {
  //           label: 'Movie Ticket',
  //           amount: { currency: 'USD', value: '15.00' },
  //         },
  //       ],
  //       total: {
  //         label: 'Merchant Name',
  //         amount: { currency: 'USD', value: '15.00' },
  //       },
  //     }

  //     const ANDROIDPaymentRequest = new PaymentRequest(
  //       ANDROID_METHOD_DATA,
  //       ANDROID_DETAILS,
  //       // ANDROID_OPTIONS,
  //     )
  //     ANDROIDPaymentRequest.canMakePayments()
  //       .then(canMakePayment => {
  //         if (canMakePayment) {
  //           ANDROIDPaymentRequest.show()
  //             .then(paymentResponse => {
  //               // Your payment processing code goes here
  //               // const { transactionIdentifier, paymentData } =
  //               //   paymentResponse.details
  //               // console.log('paymentData', paymentData)
  //               // console.log('transactionIdentifier', transactionIdentifier)
  //               // paymentResponse.complete('success')
  //               console.log('Android Pay', paymentResponse)
  //               paymentResponse.complete('success')
  //             })
  //             .catch(error => {
  //               console.log('Show Error', error)
  //             })
  //         } else {
  //           Alert.alert(
  //             'Apple Pay',
  //             'Apple Pay is not available in this device',
  //           )
  //         }
  //       })
  //       .catch(error => {
  //         console.log('Can Make Payments Error', error.message)
  //       })
  //   }
  //   return (
  //     <View>
  //       <TouchableOpacity
  //         onPress={() => googlePay()}
  //         style={[
  //           { height: scale(60) },
  //           // Gutters.sixtyHeight,
  //           Layout.row,
  //           Gutters.fiveVMargin,
  //           Common.offWhiteSecondaryBorder,
  //         ]}
  //       >
  //         <ImageBackground
  //           source={Images.gpay}
  //           resizeMode="stretch"
  //           style={[Layout.fullSize, Common.borderRadius]}
  //         />
  //       </TouchableOpacity>
  //     </View>
  //   )
  // }

  //#endregion

  //#region Helper Method

  const onContinueHandler = async () => {
    if (params.navigateFor === 'planOrder') {
      //Call API for plan order
      getRecharge({
        first_name: userData.first_name,
        last_name: userData.last_name,
        contact: params.phone_number,
        name_on_card: cardName,
        card_number: cardNumber.split(' ').join(''),
        expiry_month: cardDate.split('/')[0],
        expiry_year: cardDate.split('/')[1],
        cvv: CVV,
        address: address,
        apt: aptSuite,
        city: city,
        state: state,
        plan_id: params.planId,
        price: params.amount.slice(1),
        token: token,
        zipcode: zipCode,
      })
    } else if (params.navigateFor === 'eSimOrder') {
      //Call API for eSim Order
      getEsimOrder({
        imei_number: params.IMEINumber,
        sku: params.sku,
        first_name: params.first_name,
        last_name: params.last_name,
        email: params.email,
        contact: params.phone_number,
        start_date: params.start_date,
        end_date: params.end_date,
        name_on_card: cardName,
        card_number: cardNumber.split(' ').join(''),
        expiry_month: cardDate.split('/')[0],
        expiry_year: cardDate.split('/')[1],
        cvv: CVV,
        address: address,
        apt: aptSuite,
        city: city,
        state: state,
        price: params.amount.slice(1),
        token: token,
        zipcode: zipCode,
      })
    } else {
      Alert.alert('Opps!', 'Something Went Wrong')
    }
  }

  const onScrollHandle = () => {
    scrollRef.scrollTo({
      x: 0,
      y: verticalScale(315),
      animated: true,
    })
  }

  //#endregion

  //#region Life Cycle

  useEffect(() => {
    if (rechargeData) {
      console.log(rechargeData)
      try {
        if (rechargeData.order.payment_status === 'success') {
          navigation.navigate('PaymentSuccess')
        } else if (rechargeData.order.payment_status === 'fail') {
          setModalVisible(true)
        }
      } catch (e) {
        console.log(e)
        setModalVisible(true)
      }
    }
  }, [rechargeData])

  useEffect(() => {
    if (rechargeError) {
      // console.log('rechargeError', rechargeError)
      setModalVisible(true)
      // Alert.alert('Server Problem!!', 'Server problem in plan purchasing')
    }
  }, [rechargeError])

  useEffect(() => {
    if (rechargeIsLoading || EsimOrderLoading) {
      setSpinner(true)
    } else {
      setSpinner(false)
    }
  }, [rechargeIsLoading, EsimOrderLoading])

  useEffect(() => {
    if (useNumber) {
      setPhoneNumber(number)
    } else if (!useNumber) {
      setPhoneNumber('')
    }
  }, [useNumber])

  useEffect(() => {
    if (EsimOrderData) {
      // console.log(EsimOrderData)
      try {
        if (EsimOrderData.order.payment_status === 'success') {
          navigation.navigate('PaymentSuccess')
        } else if (EsimOrderData.order.payment_status === 'fail') {
          setModalVisible(true)
        }
      } catch (e) {
        // console.log(e)
        setModalVisible(true)
      }
    }
  }, [EsimOrderData])

  useEffect(() => {
    if (EsimOrderError) {
      console.log(EsimOrderError)
      setModalVisible(true)
      // Alert.alert('Server Problem!!', 'Server down for Esim transaction!')
    }
  }, [EsimOrderError])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerStyle: {
        backgroundColor: Common.backgroundPrimary.backgroundColor,
        height: verticalScale(50),
      },
      headerTitle: () => (
        <Image
          source={Images.Logo}
          resizeMode="contain"
          style={[{ width: scale(90) }, Common.resizeModeContain]}
        />
      ),

      headerTitleAlign: 'center',
      headerShadowVisible: false,
      headerBackTitleVisible: false,
      gestureEnabled: false,
    })
  }, [navigation, theme])

  useEffect(() => {
    if (spinner) {
      navigation.setOptions({
        gestureEnabled: false,
      })
    } else {
      navigation.setOptions({
        gestureEnabled: true,
      })
    }
  }, [spinner])

  //#endregion

  //#region Render Method

  const CardsPayments = () => (
    <Fragment>
      <TouchableOpacity
        onPress={() => onScrollHandle()}
        style={[
          { height: scale(50) },
          // Gutters.sixtyHeight,
          Layout.row,
          Gutters.fiveVMargin,
          Common.offWhiteSecondaryBorder,
        ]}
      >
        <ImageBackground
          source={Images.allcards}
          resizeMode="stretch"
          style={[Layout.fullSize, Common.borderRadius]}
        />
      </TouchableOpacity>
    </Fragment>
  )

  const CardPaymentInfo = () => (
    <Fragment>
      <View style={[Gutters.twentyFourHMargin]}>
        <Text
          style={[
            Fonts.fontWeightRegular,
            Fonts.fontSizeSmall,
            Fonts.fontFamilyPrimary,
            Common.titleText,
            Gutters.tenVMargin,
          ]}
        >
          Card Information
        </Text>
        <Text
          style={[
            Fonts.fontSizeExtraSmall,
            Fonts.fontWeightSmall,
            Common.innerText,
            Fonts.fontFamilyPrimary,
          ]}
        >
          Name on card
        </Text>
        <TextInput
          value={cardName}
          onChangeText={text => {
            setCardName(text)
            if (cardNameIsValid === false) {
              setCardNameError(true)
            } else {
              setCardNameError(false)
            }
          }}
          keyboardType="default"
          onBlur={() => {
            if (cardNameIsValid === false) {
              setCardNameError(true)
            } else {
              setCardNameError(false)
            }
          }}
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
            cardNameError && Common.errorBorder,
          ]}
        />

        <CardNumberTextInput
          errorColor={'red'}
          defaultBorderColor={'#F3F5F7'}
          placeholder={'Card number'}
          placeholderTextColor={'#ccc'}
          onBlur={() => {
            if (cardNumberIsValid === false) {
              setCardNumberError(true)
            } else {
              setCardNumberError(false)
            }
          }}
          label={'Card Number'}
          labelStyle={[
            Fonts.fontSizeExtraSmall,
            Fonts.fontWeightSmall,
            Common.innerText,
            Gutters.zeroLMargin,
          ]}
          touched={true}
          defaultValue={cardNumber}
          updateTextVal={text => {
            setCardNumber(text)
            if (cardNumberIsValid === false) {
              setCardNumberError(true)
            } else {
              setCardNumberError(false)
            }
          }}
          inputWrapStyle={[
            Common.offWhiteBackground,
            Common.borderRadius,
            { height: verticalScale(56) },
            cardNumberError && Common.errorBorder,
          ]}
          inputStyle={[
            { height: verticalScale(56) },
            Common.primaryBlue,
            Fonts.fontSizeSmall,
            Fonts.fontWeightSmall,
            Fonts.fontFamilyPrimary,
          ]}
        />

        <View style={[Layout.row, { marginTop: verticalScale(-20) }]}>
          <View style={[Gutters.fiftyPWidth]}>
            <Text
              style={[
                Fonts.fontSizeExtraSmall,
                Fonts.fontWeightSmall,
                Common.innerText,
                Fonts.fontFamilyPrimary,
              ]}
            >
              Expiration
            </Text>
          </View>
          <View style={[Gutters.fiftyPWidth]}>
            <Text
              style={[
                Fonts.fontSizeExtraSmall,
                Fonts.fontWeightSmall,
                Common.innerText,
                Gutters.tenLMargin,
                Fonts.fontFamilyPrimary,
              ]}
            >
              CVV / CVC
            </Text>
          </View>
        </View>
        <View
          style={[
            {},
            Layout.justifyContentBetween,
            Layout.alignItemsCenter,
            Layout.row,
          ]}
        >
          <CardDateTextInput
            errorColor={'red'}
            labelColor={'#ddd'}
            focusColor={'#1c32a0'}
            defaultBorderColor={'#F3F5F7'}
            placeholder={'MM/YY'}
            onBlur={() => {
              if (cardDateIsValid === false) {
                setCardDateError(true)
              } else {
                setCardDateError(false)
              }
            }}
            cardInputContainerStyle={{}}
            updateCardDateText={t => {
              setCardDate(t)
              if (cardDateIsValid === false) {
                setCardDateError(true)
              } else {
                setCardDateError(false)
              }
            }}
            inputWrapStyle={[
              {
                height: verticalScale(55),
                width: scale(150),
              },
              Common.offWhiteBackground,
              Common.borderRadius,
              Gutters.tenMTMargin,
              Gutters.fifteenMBMargin,
              cardDateError && Common.errorBorder,
            ]}
            placeholderTextColor={'#ccc'}
            value={cardDate}
            defaultValue={cardDate}
            inputStyle={[
              Common.primaryBlue,
              Layout.fullWidth,
              Fonts.fontWeightSmall,
              Fonts.fontSizeSmall,
              Fonts.fontFamilyPrimary,
            ]}
          />
          <TextInput
            keyboardType="numeric"
            value={CVV}
            secureTextEntry={true}
            maxLength={3}
            onBlur={() => {
              if (CVVIsValid === false) {
                setCVVError(true)
              } else {
                setCVVError(false)
              }
            }}
            onChangeText={num => {
              setCVV(num)
              if (CVVIsValid === false) {
                setCVVError(true)
              } else {
                setCVVError(false)
              }
            }}
            style={[
              { height: verticalScale(56) },
              Common.primaryBlue,
              Common.offWhiteBackground,
              CVVError && Common.errorBorder,
              Gutters.tenVMargin,
              Common.borderRadius,
              Gutters.fortyeightPWidth,
              Fonts.fontSizeSmall,
              Fonts.fontWeightSmall,
              Fonts.fontFamilyPrimary,
            ]}
          />
        </View>
      </View>
      <View style={[Gutters.twentyFourHMargin]}>
        <View style={[Gutters.tenVMargin]}>
          <Text
            style={[
              Fonts.fontWeightRegular,
              Fonts.fontSizeSmall,
              Fonts.fontFamilyPrimary,
              Common.titleText,
              Gutters.tenVMargin,
            ]}
          >
            Billing Information
          </Text>
        </View>
        <View>
          <Text
            style={[
              Fonts.fontSizeExtraSmall,
              Fonts.fontWeightSmall,
              Common.innerText,
              Fonts.fontFamilyPrimary,
            ]}
          >
            Address
          </Text>
          <TextInput
            value={address}
            onBlur={() => {
              if (addressIsValid === false) {
                setAddressError(true)
              } else {
                setAddressError(false)
              }
            }}
            onChangeText={text => {
              setAddress(text)
              if (addressIsValid === false) {
                setAddressError(true)
              } else {
                setAddressError(false)
              }
            }}
            style={[
              { height: verticalScale(56) },
              Common.primaryBlue,
              Fonts.fontWeightSmall,
              Common.borderRadius,
              Common.offWhiteBackground,
              Gutters.tenVMargin,
              addressError && Common.errorBorder,
              Fonts.fontSizeSmall,
              Fonts.fontFamilyPrimary,
              Gutters.tenHPadding,
            ]}
          />
          <Text
            style={[
              Fonts.fontSizeExtraSmall,
              Fonts.fontWeightSmall,
              Common.innerText,
              Fonts.fontFamilyPrimary,
            ]}
          >
            Apt / Suite
          </Text>
          <TextInput
            onBlur={() => {
              if (aptSuiteIsValid === false) {
                setAptSuiteError(true)
              } else {
                setAptSuiteError(false)
              }
            }}
            value={aptSuite}
            onChangeText={text => {
              setAptSuite(text)
              if (aptSuiteIsValid === false) {
                setAptSuiteError(true)
              } else {
                setAptSuiteError(false)
              }
            }}
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
              aptSuiteError && Common.errorBorder,
            ]}
          />
          <Text
            style={[
              Fonts.fontSizeExtraSmall,
              Fonts.fontWeightSmall,
              Common.innerText,
              Fonts.fontFamilyPrimary,
            ]}
          >
            ZipCode
          </Text>
          <TextInput
            keyboardType="numeric"
            onBlur={() => {
              if (zipCodeIsValid === false) {
                setZipCodeError(true)
              } else {
                setZipCodeError(false)
              }
            }}
            value={zipCode}
            onChangeText={text => {
              setZipCode(text)
              if (zipCodeIsValid === false) {
                setZipCodeError(true)
              } else {
                setZipCodeError(false)
              }
            }}
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
              zipCodeError && Common.errorBorder,
            ]}
          />
          <Text
            style={[
              Fonts.fontSizeExtraSmall,
              Fonts.fontWeightSmall,
              Common.innerText,
              Fonts.fontFamilyPrimary,
            ]}
          >
            City
          </Text>
          <TextInput
            onBlur={() => {
              if (cityIsValid === false) {
                setCityError(true)
              } else {
                setCityError(false)
              }
            }}
            value={city}
            onChangeText={text => {
              setCity(text)
              if (cityIsValid === false) {
                setCityError(true)
              } else {
                setCityError(false)
              }
            }}
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
              cityError && Common.errorBorder,
            ]}
          />
          <Text
            style={[
              Fonts.fontSizeExtraSmall,
              Fonts.fontWeightSmall,
              Common.innerText,
              Fonts.fontFamilyPrimary,
            ]}
          >
            State
          </Text>
          <TextInput
            value={state}
            onChangeText={text => {
              setState(text)
              if (stateIsValid === false) {
                setStateError(true)
              } else {
                setStateError(false)
              }
            }}
            onBlur={() => {
              if (stateIsValid === false) {
                setStateError(true)
              } else {
                setStateError(false)
              }
            }}
            style={[
              { height: verticalScale(56) },
              Common.primaryBlue,
              Fonts.fontWeightSmall,
              stateError && Common.errorBorder,
              Common.borderRadius,
              Common.offWhiteBackground,
              Gutters.tenVMargin,
              Fonts.fontSizeSmall,
              Fonts.fontFamilyPrimary,
              Gutters.tenHPadding,
            ]}
          />

          <View style={[Gutters.twentyVMargin]}>
            <Text
              style={[
                Fonts.fontSizeExtraSmall,
                Fonts.fontWeightRegular,
                Common.innerText,
                Fonts.fontFamilyPrimary,
              ]}
            >
              I hereby authorize charges totaling{' '}
              <Text
                style={[
                  Common.primaryBlueMode,
                  Fonts.fontFamilyPrimary,
                  Fonts.fontWeightRegular,
                ]}
              >
                ${params.totalAmount}
              </Text>{' '}
              via my credit card. I understand that charge on my credit card is
              not refundable under any circumstances.
            </Text>
          </View>
          <Pressable
            onPress={() => setAgree(!agree)}
            style={[
              Layout.row,
              Layout.alignItemsCenter,
              { height: verticalScale(50) },
            ]}
          >
            <CheckBox
              center
              checked={agree}
              onPress={() => setAgree(!agree)}
              checkedIcon={
                <Image
                  source={Images.check}
                  style={[
                    { height: verticalScale(25), width: scale(25) },
                    // Gutters.twentyfiveHeight,
                    // Gutters.twentyfiveWidth,
                    Common.resizeModeContain,
                  ]}
                />
              }
              uncheckedIcon={
                <Image
                  source={Images.uncheck}
                  style={[
                    { height: verticalScale(25), width: scale(25) },
                    // Gutters.twentyfiveHeight,
                    // Gutters.twentyfiveWidth,
                    Common.resizeModeContain,
                  ]}
                />
              }
              containerStyle={[
                Common.backgroundPrimary,
                Gutters.zeroHeight,
                Gutters.zeroWidth,
              ]}
              wrapperStyle={[Gutters.zeroHeight, Gutters.zeroWidth]}
            />
            <Text
              style={[
                Fonts.fontWeightRegular,
                Fonts.fontSizeExtraSmall,
                Common.primaryBlueMode,
                Fonts.fontFamilyPrimary,
              ]}
            >
              I agree to terms and conditions
            </Text>
          </Pressable>
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
          title={`Send payment for ${params.amount}`}
          icon={{
            name: 'arrow-right',
            type: 'font-awesome-5',
            size: scale(20),
            color: 'white',
          }}
          iconRight
          iconContainerStyle={[Gutters.fiftyRMargin]}
          loading={false}
          onPress={() => {
            onContinueHandler()
          }}
          loadingProps={[{ size: 'small' }, Common.whiteColor]}
          titleStyle={[
            Fonts.fontSize12,
            Fonts.fontFamilyPrimary,
            Gutters.fiftyLMargin,
          ]}
          buttonStyle={[
            { height: verticalScale(55) },
            Common.primaryPinkBackground,
            // Gutters.fiftyfiveHeight,
            Common.borderRadius,
            Layout.justifyContentBetween,
          ]}
          containerStyle={[
            Gutters.ninetyfivePWidth,
            Layout.selfCenter,
            Common.borderRadius,
          ]}
          disabled={!dataIsValid}
          disabledStyle={[Common.whiteColor, Common.greyBackground]}
          disabledTitleStyle={[Common.whiteColor, Gutters.zeroOsevenOpacity]}
        />
      </View>
    </Fragment>
  )

  const loading = (
    <View style={[Layout.center, Common.backgroundPrimary, Layout.fullHeight]}>
      <Text
        style={[
          Common.primaryBlueMode,
          Fonts.fontSizeRegular,
          Fonts.fontWeightRegular,
          Fonts.fontFamilyPrimary,
        ]}
      >
        Processing payment...
      </Text>
      <LinearProgress
        style={[Gutters.twentyVMargin, Gutters.fiftyPWidth, Gutters.tenMargin]}
        color={Common.primaryPink.color}
        value={10}
        variant="indeterminate"
      />
    </View>
  )

  let paymentFailed = (
    <GestureRecognizer onSwipeDown={() => setModalVisible(false)}>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <View style={[Layout.center, Layout.fill, Common.dimBackground]}>
          <View
            style={[
              { height: verticalScale(300) },
              Common.whiteColorBackground,
              Common.borderWidthOne,
              Common.secondaryGreyBorder,
              Common.marginTopAuto,
              Common.borderRadiusTen,
              Common.elevationFive,
              Gutters.hundredPWidth,
              Layout.alignItemsCenter,
            ]}
          >
            <Image
              source={Images.modalHandle}
              style={[{ marginTop: verticalScale(5) }, Common.resizeModeCenter]}
            />
            <Text
              style={[
                { marginVertical: verticalScale(5) },
                Fonts.fontWeightRegular,
                Fonts.fontSizeRegular,
                Fonts.textCenter,
                Fonts.fontFamilyPrimary,
                Common.primaryBlue,
              ]}
            >
              Order failed
            </Text>
            <Text
              style={[
                // { marginBottom: scale(20) },
                Fonts.fontSizeSmall,
                Fonts.fontWeightSmall,
                Fonts.fontFamilyPrimary,
                Fonts.textCenter,
                // Gutters.twentyBMargin,
              ]}
            >
              Your payment couldn’t be processed.
            </Text>
            <Text
              style={[
                { marginBottom: verticalScale(20) },
                Fonts.fontSizeSmall,
                Fonts.fontWeightSmall,
                Common.primaryBlue,
                Fonts.fontFamilyPrimary,
                Fonts.textCenter,
                // Gutters.twentyBMargin,
                Gutters.ninetyPWidth,
              ]}
            >
              Please check the information you’ve entered is correct or try with
              a different payment method.
            </Text>
            <Button
              title="Continue"
              loading={false}
              onPress={() => setModalVisible(false)}
              loadingProps={[{ size: 'small' }, Common.whiteColor]}
              titleStyle={[Fonts.fontWeightRegular, Fonts.fontFamilyPrimary]}
              buttonStyle={[
                { height: verticalScale(55) },
                Common.primaryPinkBackground,
                // Gutters.fiftyfiveHeight,
                Common.borderRadius,
              ]}
              containerStyle={[
                { marginVertical: verticalScale(10) },
                Gutters.eightyfivePWidth,
                // Gutters.tenVMargin,
                Layout.selfCenter,
                Common.borderRadius,
              ]}
              disabled={false}
            />
          </View>
        </View>
      </Modal>
    </GestureRecognizer>
  )

  return (
    <SafeAreaView style={[Common.backgroundPrimary, Layout.fill]}>
      {!spinner ? (
        <ScrollView
          contentContainerStyle={[Common.backgroundPrimary]}
          ref={ref => {
            setScrollRef(ref)
          }}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={[Gutters.twentyHMargin]}
          >
            <Image
              source={Images.LeftArrow}
              style={{ height: verticalScale(19), width: '10%' }}
              resizeMode="cover"
            />
          </Pressable>
          <View
            style={[
              Gutters.twentyFourHMargin,
              Gutters.tenVMargin,
              Layout.center,
            ]}
          >
            {/* ---------------- Modal ---------------- */}
            {paymentFailed}
            {/* ---------------- Modal ---------------- */}
            <Text
              style={[
                Common.primaryBlueMode,
                Fonts.fontSizeLarge,
                Fonts.fontWeightRegular,
                Fonts.fontFamilyPrimary,
              ]}
            >
              Checkout
            </Text>
          </View>
          <View style={[Gutters.twentyFourHMargin, Gutters.fiveVMargin]}>
            <View
              style={[Layout.row, { alignItems: 'center', marginVertical: 5 }]}
            >
              <Text
                style={[
                  { marginBottom: 3 },
                  Common.primaryGrey,
                  Fonts.fontWeightSmall,
                  Fonts.fontFamilyPrimary,
                  // Gutters.tenBMargin,
                  Fonts.fontSize12,
                ]}
              >
                Phone Number
              </Text>
              <Image
                source={Images.bluetick}
                resizeMode="contain"
                style={[
                  {
                    marginLeft: scale(5),
                    alignSelf: 'center',
                    height: verticalScale(20),
                    width: scale(20),
                  },
                ]}
              />
            </View>
            <View style={[Common.borderRadius, Common.primaryBlueBackground]}>
              <View
                style={[
                  { maxHeight: verticalScale(80) },
                  Layout.flexTwo,
                  Layout.row,
                  Layout.alignItemsCenter,
                  Layout.justifyContentBetween,
                  Common.borderRadius,
                  Common.primaryBlueBackground,
                ]}
              >
                <View style={{ flexDirection: 'column' }}>
                  <View>
                    <Text
                      style={[
                        { paddingTop: verticalScale(40) },
                        Fonts.fontFamilyPrimary,
                        Common.white,
                        Fonts.fontSizeMedium,
                        Fonts.fontWeightRegular,
                        Gutters.fifteenLMargin,
                      ]}
                    >
                      {params.formattedNumber}
                    </Text>
                  </View>
                  <View style={{}}>
                    <Text
                      style={[
                        { paddingBottom: verticalScale(40) },
                        Common.white,
                        Gutters.fifteenLMargin,
                        Fonts.fontFamilyPrimary,
                        Fonts.fontSize12,
                      ]}
                    >
                      {`${params.planName ? params.planName : 'Esim'} ${
                        params.amount
                      } — One payment of ${params.amount}`}
                    </Text>
                  </View>
                </View>
                <View>
                  <Image
                    source={{ uri: userData.carrier_image }}
                    style={[
                      { width: scale(50) },
                      Layout.center,
                      Gutters.eightRMargin,
                      Gutters.eightyPHeight,
                      Common.resizeModeContain,
                      Common.borderRadius,
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>
          <View
            style={[
              Layout.justifyContentCenter,
              Gutters.twentyFourHMargin,
              Gutters.fiveVMargin,
            ]}
          >
            <Text
              style={[
                Fonts.fontWeightRegular,
                Fonts.fontSizeSmall,
                Fonts.fontFamilyPrimary,
                Common.titleText,
                Gutters.tenVMargin,
              ]}
            >
              Payment Method
            </Text>
          </View>

          <View style={[Gutters.twentyFourHMargin]}>
            {CardsPayments()}
            {/* {platform === 'ios' && applepayComponent()} */}
            {/* {platform === 'android' && googlePayComponent()} */}
          </View>
          {/* {number == params.phone_number && cardPaymentInfo} */}
          {CardPaymentInfo()}
        </ScrollView>
      ) : (
        loading
      )}
    </SafeAreaView>
  )
  //#endregion
}

export default Checkout
