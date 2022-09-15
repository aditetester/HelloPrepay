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
} from 'react-native'
import { useSelector } from 'react-redux'
import { useTheme } from '@/Hooks'
import { CheckBox, LinearProgress, Button } from '@rneui/themed'
import {
  CardNumberTextInput,
  CardDateTextInput,
} from 'rn-credit-card-textinput'
import GestureRecognizer from 'react-native-swipe-gestures'

const Checkout = ({ navigation, route }) => {
  let params = route.params
  console.log('🚀 Checkout', params)
  const platform = Platform.OS
  const theme = useSelector(state => state.theme)
  const userData = useSelector(state => state.user.userData)
  console.log(userData)
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
  const cardNumberIsValid = cardNumber.length === 20
  const cardDateIsValid = cardDate.length === 5
  const CVVIsValid = CVV.length === 3
  const addressIsValid = address.length > 10
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
      headerTitle: () =>
        !theme.darkMode ? (
          <Image
            source={Images.whiteThemeLogo}
            style={[{ resizeMode: 'contain' }, Gutters.headerWidthWidth]}
          />
        ) : (
          <Image
            source={Images.darkThemeLogo}
            style={[
              { resizeMode: 'contain' },
              Gutters.headerHeight,
              Gutters.headerWidthWidth,
            ]}
          />
        ),

      headerTitleAlign: 'center',
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    })
  }, [navigation, theme])

  const onContinueHandler = async () => {
    setSpinner(true)
    await setTimeout(() => {
      navigation.navigate('PaymentSuccess')
    }, 4000)
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

  const gpay = (
    <>
      <TouchableOpacity
        onPress={() => openUrl('https://www.google.com/')}
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
    </>
  )

  const applepay = platform === 'ios' && (
    <>
      <TouchableOpacity
        onPress={() => openUrl('https://www.apple.com/apple-pay/')}
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
    </>
  )
  const samsungpay = platform === 'android' && (
    <>
      <TouchableOpacity
        onPress={() => openUrl('https://www.samsung.com/in/samsung-pay/')}
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
                $67.00
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
          title="Send payment for $67.00"
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

  let modal = (
    <GestureRecognizer
      onSwipeDown={() => setModalVisible(false)}
      style={[
        {
          backgroundColor: 'rgba(0,0,0,0.5)',
        },
        Layout.fill,
      ]}
    >
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <View
          style={[
            { backgroundColor: 'rgba(0,0,0,0.5)' },
            Layout.center,
            Layout.fill,
            Gutters.twentytwoTMargin,
          ]}
        >
          <View
            style={[
              { height: '50%' },
              Common.whiteColorBackground,
              Common.borderWidthOne,
              Common.secondaryGreyBorder,
              Common.borderTopLeftRadiusTen,
              Common.borderTopRightRadiusTen,
              Common.elevationFive,
              Gutters.hundredPWidth,
              // Gutters.foureightzeroTMargin,
              // Gutters.fortyPHeight,
              Layout.alignItemsCenter,
            ]}
          >
            <Image
              source={Images.modalHandle}
              style={[
                Gutters.tenPWidth,
                Gutters.twoPHeight,
                Gutters.fifteenMargin,
                Common.borderRadiusMedium,
              ]}
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
            {!theme.darMode ? (
              <Image source={Images.greyLeftArrow} />
            ) : (
              <Image source={Images.whiteLeftArrow} />
            )}
          </TouchableOpacity>
          <View
            style={[
              Gutters.twentyFourHMargin,
              Gutters.tenVMargin,
              Layout.center,
            ]}
          >
            {/* ---------------- Modal ---------------- */}
            {modal}
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
                  {params.phone_number}
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
            {applepay}
            {gpay}
            {samsungpay}
          </View>
          {number == params.phone_number && cardPaymentInfo}
        </ScrollView>
      ) : (
        loading
      )}
    </SafeAreaView>
  )
}

export default Checkout
