import React, { useEffect, useState } from 'react'
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
  Linking,
  Modal,
  Pressable,
  Alert,
} from 'react-native'
import { useSelector } from 'react-redux'
import { useTheme } from '@/Hooks'
import { CheckBox, LinearProgress, Button } from '@rneui/themed'
import {
  CardNumberTextInput,
  CardDateTextInput,
} from 'rn-credit-card-textinput'
import GestureRecognizer from 'react-native-swipe-gestures'
import { PaymentRequest } from 'react-native-payments'
import {
  useGetCardPaymentsMutation,
  useGetRechargeMutation,
} from '@/Services/api'
import { API_LOGIN_ID, TRANSACTION_KEY } from '../../Config/index'

const Checkout = ({ navigation, route }) => {
  //#region Define Variables
  let params = route.params
  // console.log('🚀 Checkout', params)
  const platform = Platform.OS
  const theme = useSelector(state => state.theme)
  const userData = useSelector(state => state.user.userData)
  // console.log(userData)
  const { Common, Layout, Images, Gutters, Fonts } = useTheme()
  const [buttonLoading, setButtonLoading] = useState(false)
  const [spinner, setSpinner] = useState(false)
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardDate, setCardDate] = useState('')
  const [CVV, setCVV] = useState('')
  const [address, setAddress] = useState('')
  const [aptSuite, setAptSuite] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [useNumber, setUseNumber] = useState(false)
  const [agree, setAgree] = useState(false)
  const [number, setNumber] = useState(userData.phone_number)
  const [modalVisible, setModalVisible] = useState(false)

  const cardNameIsValid = cardName.length > 1
  const cardNumberIsValid = cardNumber.length > 5
  const cardDateIsValid = cardDate.length !== ''
  const CVVIsValid = CVV.length === 3
  const addressIsValid = address.length > 5
  const aptSuiteIsValid = aptSuite.length > 2
  const cityIsValid = city.length > 2
  const stateIsValid = state.length > 2
  const dataIsValid =
    cardNameIsValid &&
    cardNumberIsValid &&
    cardDateIsValid &&
    CVVIsValid &&
    addressIsValid &&
    aptSuiteIsValid &&
    cityIsValid &&
    stateIsValid &&
    agree

  const currentTime = new Date().getMilliseconds()

  const cardDetails = {
    createTransactionRequest: {
      merchantAuthentication: {
        name: API_LOGIN_ID,
        transactionKey: TRANSACTION_KEY,
      },
      refId: currentTime.toString(),
      transactionRequest: {
        transactionType: 'authCaptureTransaction',
        amount: params.amount.replace(',', '').replace('$', ''),
        payment: {
          creditCard: {
            cardNumber: cardNumber.replaceAll(' ', ''),
            expirationDate: cardDate,
            cardCode: CVV,
          },
        },
        lineItems: {
          lineItem: {
            itemId: '1',
            name:
              // params.planName.toString().length >= 31
              //   ? params.planName.toString().substring(0, 31)
              //   : params.planName.toString(),
              'verizon $10',
            // description: params.carrierName,
            description: 'verizon',
            quantity: '1',
            unitPrice: params.amount.replace(',', '').replace('$', ''),
          },
        },
        poNumber: params.phone_number,
        processingOptions: { isSubsequentAuth: 'true' },
        subsequentAuthInformation: {
          originalNetworkTransId: '123456789NNNH',
          originalAuthAmount: params.amount.replace(',', '').replace('$', ''),
          reason: 'resubmission',
        },
        authorizationIndicatorType: {
          authorizationIndicator: 'final',
        },
      },
    },
  }

  const rechargeDetail = {
    phone_number: params.phone_number,
    planid: 11,
    price: 200,
    meta: { a: 'v' },
    pin: 1111,
  }

  const [getCardPayments, { data, isLoading, error }] =
    useGetCardPaymentsMutation()

  const [
    getRecharge,
    { data: rechargeData, isLoading: rechargeIsLoading, error: rechargeError },
  ] = useGetRechargeMutation()

  //#endregion

  //#region Apple Pay Configuration

  const applePaymentSuccess = async () => {
    await setTimeout(() => {
      navigation.navigate('PaymentSuccess')
    }, 1000)
  }

  const applepay = () => {
    const IOS_METHOD_DATA = [
      {
        supportedMethods: ['apple-pay'],
        data: {
          merchantIdentifier: 'merchant.apple.test',
          supportedNetworks: ['visa', 'mastercard', 'amex'],
          countryCode: 'US',
          currencyCode: 'USD',
        },
      },
    ]

    const IOS_DETAILS = {
      id: 'basic-example',
      displayItems: [
        {
          label: 'Movie Ticket',
          amount: { currency: 'USD', value: '15.00' },
        },
        {
          label: 'Grocery',
          amount: { currency: 'USD', value: '5.00' },
        },
      ],
      shippingOptions: [
        {
          id: 'economy',
          label: 'Economy Shipping',
          amount: { currency: 'USD', value: '50.00' },
          detail: 'Arrives in 3-5 days', // `detail` is specific to React Native Payments
        },
      ],
      total: {
        label: 'Enappd Store',
        amount: { currency: 'USD', value: `${Number(params.totalAmount)}` },
      },
    }

    const IOS_OPTIONS = {
      requestPayerName: true,
      requestPayerPhone: true,
      requestPayerEmail: true,
      requestShipping: false,
    }

    const paymentRequest = new PaymentRequest(
      IOS_METHOD_DATA,
      IOS_DETAILS,
      IOS_OPTIONS,
    )

    // paymentRequest.addEventListener('shippingaddresschange', e => {
    //   const updatedDetails = getUpdatedDetailsForShippingAddress(
    //     paymentRequest.shippingAddress,
    //   )
    //   e.updateWith(updatedDetails)
    // })

    // paymentRequest.addEventListener('shippingoptionchange', e => {
    //   const updatedDetails = getUpdatedDetailsForShippingOption(
    //     paymentRequest.shippingOption,
    //   )
    //   e.updateWith(updatedDetails)
    // })

    const applePay = () => {
      paymentRequest
        .canMakePayments()
        .then(canMakePayment => {
          if (canMakePayment) {
            paymentRequest
              .show()
              .then(paymentResponse => {
                // Your payment processing code goes here
                paymentResponse.complete('success')
                // applePaymentSuccess()
              })
              .catch(error => {
                paymentRequest.abort()
                console.log('Show Error', error)
                setModalVisible(true)
              })
          } else {
            Alert.alert(
              'Apple Pay',
              'Apple Pay is not available in this device',
            )
          }
        })
        .catch(error => {
          console.log('Can Make Payments Error', error.message)
        })
    }
    return (
      <View>
        <TouchableOpacity
          onPress={() => applePay()}
          style={[
            Gutters.sixtyHeight,
            Layout.row,
            Gutters.fiveVMargin,
            Common.offWhiteSecondaryBorder,
          ]}
        >
          <ImageBackground
            source={Images.applepay}
            resizeMode="stretch"
            style={[Layout.fullSize, Common.borderRadius]}
          />
        </TouchableOpacity>
      </View>
    )
  }

  //#endregion

  //#region Google Pay Configuration

  const gpay = () => {
    const ANDROID_METHOD_DATA = [
      {
        supportedMethods: ['android-pay'],
        data: {
          supportedNetworks: ['visa', 'mastercard', 'amex'],
          currencyCode: 'USD',
          environment: 'TEST', // defaults to production
          paymentMethodTokenizationParameters: {
            tokenizationType: 'NETWORK_TOKEN',
            parameters: {
              publicKey:
                'BFEC244s+3h7MK8gNkvV1HwlnEpEl7cV5PHNdKRebxlmL6Qz+SCDnMc3SoWDsCX0YWGagDqk5eWhn19UvoeXILQ=',
            },
          },
        },
      },
    ]

    const ANDROID_OPTIONS = {
      requestPayerName: true,
      requestPayerPhone: true,
      requestPayerEmail: true,
      requestShipping: true,
    }

    const ANDROID_DETAILS = {
      id: 'basic-example',
      displayItems: [
        {
          label: 'Movie Ticket',
          amount: { currency: 'USD', value: '15.00' },
        },
      ],
      total: {
        label: 'Merchant Name',
        amount: { currency: 'USD', value: '15.00' },
      },
    }

    const googlePay = () => {
      const ANDROIDPaymentRequest = new PaymentRequest(
        ANDROID_METHOD_DATA,
        ANDROID_DETAILS,
        ANDROID_OPTIONS,
      )
      ANDROIDPaymentRequest.canMakePayments()
        .then(canMakePayment => {
          if (canMakePayment) {
            ANDROIDPaymentRequest.show()
              .then(paymentResponse => {
                // Your payment processing code goes here
                const { transactionIdentifier, paymentData } =
                  paymentResponse.details
                console.log('paymentData', paymentData)
                console.log('transactionIdentifier', transactionIdentifier)
                // paymentResponse.complete('success')
              })
              .catch(error => {
                console.log('Show Error', error)
              })
          } else {
            Alert.alert(
              'Apple Pay',
              'Apple Pay is not available in this device',
            )
          }
        })
        .catch(error => {
          console.log('Can Make Payments Error', error.message)
        })
    }
    return (
      <View>
        <TouchableOpacity
          onPress={() => googlePay()}
          style={[
            Gutters.sixtyHeight,
            Layout.row,
            Gutters.fiveVMargin,
            Common.offWhiteSecondaryBorder,
          ]}
        >
          <ImageBackground
            source={Images.gpay}
            resizeMode="stretch"
            style={[Layout.fullSize, Common.borderRadius]}
          />
        </TouchableOpacity>
      </View>
    )
  }

  //#endregion

  //#region Samsung Pay Configuration

  const samsungpay = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              '',
              'We are working on it \nTry different payment method',
              [{ text: 'Ok' }],
            )
          }
          style={[
            Gutters.sixtyHeight,
            Layout.row,
            Gutters.fiveVMargin,
            Common.offWhiteSecondaryBorder,
          ]}
        >
          <ImageBackground
            source={Images.samsungpay}
            resizeMode="stretch"
            style={[Layout.fullSize, Common.borderRadius]}
          />
        </TouchableOpacity>
      </View>
    )
  }

  //#endregion

  //#region Helper Method

  const onContinueHandler = async () => {
    // setSpinner(true)
    getCardPayments(JSON.stringify(cardDetails))
  }

  const onBackHandler = () => {
    navigation.goBack()
  }

  const openUrl = url => {
    Linking.openURL(url)
  }

  const cardsPayments = (
    <>
      <TouchableOpacity
        style={[
          Gutters.sixtyHeight,
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
    </>
  )

  const cardPaymentInfo = (
    <>
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
          onChangeText={text => setCardName(text)}
        />

        <CardNumberTextInput
          errorColor={'red'}
          defaultBorderColor={'#F3F5F7'}
          placeholder={'Card number'}
          placeholderTextColor={'#ccc'}
          label={'Card Number'}
          labelStyle={[
            Fonts.fontSizeExtraSmall,
            Fonts.fontWeightSmall,
            Common.innerText,
            Gutters.zeroLMargin,
          ]}
          touched={true}
          defaultValue={cardNumber}
          updateTextVal={t => {
            setCardNumber(t)
          }}
          inputWrapStyle={[
            Common.offWhiteBackground,
            Common.borderRadius,
            Gutters.twentyMBMargin,
          ]}
          inputStyle={[
            Common.primaryBlue,
            Fonts.fontSizeSmall,
            Fonts.fontWeightSmall,
            Fonts.fontFamilyPrimary,
          ]}
        />

        <View style={[Layout.row]}>
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
            cardInputContainerStyle={{}}
            updateCardDateText={t => {
              setCardDate(t)
            }}
            inputWrapStyle={[
              Common.offWhiteBackground,
              Common.borderRadius,
              Gutters.fiftyfiveHeight,
              Gutters.onefivezeroWidth,
              Gutters.tenMTMargin,
              Gutters.fifteenMBMargin,
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
            secureTextEntry={true}
            maxLength={3}
            style={[
              Common.primaryBlue,
              Common.offWhiteBackground,
              Gutters.fiftysixHeight,
              Gutters.tenVMargin,
              Common.borderRadius,
              Gutters.fortyeightPWidth,
              Fonts.fontSizeSmall,
              Fonts.fontWeightSmall,
              Fonts.fontFamilyPrimary,
            ]}
            onChangeText={num => setCVV(num)}
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
            onChangeText={text => setAddress(text)}
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
            onChangeText={text => setAptSuite(text)}
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
            onChangeText={text => setCity(text)}
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
            onChangeText={text => setState(text)}
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
            style={[Layout.row, Layout.alignItemsCenter, Gutters.fiftyHeight]}
          >
            <CheckBox
              center
              checked={agree}
              onPress={() => setAgree(!agree)}
              checkedIcon={
                <Image
                  source={Images.check}
                  style={[
                    Gutters.twentyfiveHeight,
                    Gutters.twentyfiveWidth,
                    Common.resizeModeContain,
                  ]}
                />
              }
              uncheckedIcon={
                <Image
                  source={Images.uncheck}
                  style={[
                    Gutters.twentyfiveHeight,
                    Gutters.twentyfiveWidth,
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
          title={`Send payment for $${params.totalAmount}`}
          icon={{
            name: 'arrow-right',
            type: 'font-awesome-5',
            size: 20,
            color: 'white',
          }}
          iconRight
          iconContainerStyle={[Gutters.fiftyRMargin]}
          loading={buttonLoading}
          onPress={() => {
            onContinueHandler()
          }}
          loadingProps={[{ size: 'small' }, Common.whiteColor]}
          titleStyle={[
            Fonts.fontWeightRegular,
            Fonts.fontFamilyPrimary,
            Gutters.fiftyLMargin,
          ]}
          buttonStyle={[
            Common.primaryPinkBackground,
            Gutters.fiftyfiveHeight,
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
    </>
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
              { height: '40%' },
              Common.whiteColorBackground,
              Common.borderWidthOne,
              Common.secondaryGreyBorder,
              Common.marginTopAuto,
              Common.borderRadiusTen,
              Common.elevationFive,
              Gutters.hundredPWidth,
              Layout.alignItemsCenter,
              // Layout.halfHeight,
            ]}
          >
            <Image
              source={Images.modalHandle}
              style={[Common.resizeModeCenter, Gutters.fiveTMargin]}
            />
            <Text
              style={[
                Fonts.fontWeightRegular,
                Fonts.fontSizeRegular,
                Fonts.textCenter,
                Fonts.fontFamilyPrimary,
                Common.primaryBlue,
                Gutters.fifteenBMargin,
                Gutters.fiveVMargin,
              ]}
            >
              Order failed
            </Text>
            <Text
              style={[
                Fonts.fontSizeSmall,
                Fonts.fontWeightSmall,
                Fonts.fontFamilyPrimary,
                Fonts.textCenter,
                Gutters.twentyBMargin,
              ]}
            >
              Your payment couldn’t be processed.
            </Text>
            <Text
              style={[
                Fonts.fontSizeSmall,
                Fonts.fontWeightSmall,
                Common.primaryBlue,
                Fonts.fontFamilyPrimary,
                Fonts.textCenter,
                Gutters.twentyBMargin,
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
                Common.primaryPinkBackground,
                Gutters.fiftyfiveHeight,
                Common.borderRadius,
              ]}
              containerStyle={[
                Gutters.eightyfivePWidth,
                Gutters.tenVMargin,
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

  //#endregion

  //#region Life Cycle

  useEffect(() => {
    if (rechargeData) {
      if (rechargeData.message === 'Success') {
        navigation.navigate('PaymentSuccess')
      } else {
        setModalVisible(true)
      }
    }
  }, [rechargeData])

  useEffect(() => {
    if (rechargeError) {
      setModalVisible(true)
    }
  }, [rechargeError])

  // useEffect(() => {
  //   if (rechargeIsLoading) {
  //     setSpinner(true)
  //   } else {
  //     setSpinner(false)
  //   }
  // }, [rechargeIsLoading])

  useEffect(() => {
    if (data) {
      try {
        console.log('DATA', data && data.transactionResponse.errors)
      } catch (err) {
        console.log('ERR', err)
      }
      if (data.messages && data.messages.resultCode === 'Ok') {
        getRecharge(rechargeDetail)
      } else if (data.messages && data.messages.resultCode === 'Error') {
        setModalVisible(true)
      }
    }
  }, [data])

  useEffect(() => {
    if (error) {
      setModalVisible(true)
    }
  }, [error])

  useEffect(() => {
    if (isLoading || rechargeIsLoading) {
      setSpinner(true)
    } else {
      setSpinner(false)
    }
  }, [isLoading, rechargeIsLoading])

  useEffect(() => {
    if (useNumber) {
      setPhoneNumber(number)
    } else if (!useNumber) {
      setPhoneNumber('')
    }
  }, [useNumber])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerStyle: {
        backgroundColor: Common.backgroundPrimary.backgroundColor,
        height: 70,
      },
      headerTitle: () => (
        <Image
          source={Images.Logo}
          style={[Gutters.headerWidthWidth, Common.resizeModeContain]}
        />
      ),

      headerTitleAlign: 'center',
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    })
  }, [navigation, theme])

  //#endregion

  //#region Render Method

  return (
    <SafeAreaView style={[Common.backgroundPrimary, Layout.fill]}>
      {!spinner ? (
        <ScrollView contentContainerStyle={[Common.backgroundPrimary]}>
          <TouchableOpacity
            style={[
              Gutters.fifteenPWidth,
              Gutters.fiveTMargin,
              Gutters.tenHMargin,
            ]}
            onPress={onBackHandler}
          >
            <Image source={Images.LeftArrow} />
          </TouchableOpacity>
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
            <View style={[Layout.row]}>
              <Text
                style={[
                  Common.primaryGrey,
                  Fonts.fontWeightSmall,
                  Fonts.fontFamilyPrimary,
                  Gutters.tenBMargin,
                ]}
              >
                Phone Number
              </Text>
              <Image
                source={Images.bluetick}
                style={[
                  Gutters.twentyHeight,
                  Gutters.twentyWidth,
                  Gutters.tenLMargin,
                  Common.resizeModeContain,
                ]}
              />
            </View>
            <View style={[Common.borderRadius, Common.primaryBlueBackground]}>
              <View
                style={[
                  Layout.alignItemsCenter,
                  Layout.row,
                  Layout.justifyContentBetween,
                ]}
              >
                <Text
                  style={[
                    Fonts.fontFamilyPrimary,
                    Common.white,
                    Fonts.fontSizeRegular,
                    Fonts.fontWeightRegular,
                    Gutters.fifteenLMargin,
                  ]}
                >
                  {params.formattedNumber}
                </Text>
                <Image
                  source={Images.whitecarrier12}
                  style={[
                    Common.resizeModeContain,
                    Layout.center,
                    Gutters.tenRMargin,
                    Gutters.thirtyPWidth,
                  ]}
                />
              </View>
              <Text
                style={[
                  Common.white,
                  Gutters.twentyVMargin,
                  Gutters.sixteenHMargin,
                  Gutters.eightMTMargin,
                  Fonts.fontFamilyPrimary,
                ]}
              >
                Verizon $10 - $120 — One payment of $67
              </Text>
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
            {number == params.phone_number && cardsPayments}
            {platform === 'ios' && applepay()}
            {platform === 'android' && gpay()}
            {platform === 'android' && samsungpay()}
          </View>
          {number == params.phone_number && cardPaymentInfo}
        </ScrollView>
      ) : (
        loading
      )}
    </SafeAreaView>
  )
  //#endregion
}

export default Checkout
