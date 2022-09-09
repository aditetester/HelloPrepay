import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  SafeAreaView,
  BackHandler,
  Alert,
  TextInput,
} from 'react-native'
import { useSelector } from 'react-redux'
import { useTheme } from '@/Hooks'
import { Avatar } from '@rneui/themed'
import History from '../Data/history'
import CarrierPlans from '@/Components/CarrierPlans'
import UserHistory from '@/Components/History'

const Home = ({ navigation }) => {
  const theme = useSelector(state => state.theme)
  const user = useSelector(state => state.user)
  const [number, setNumber] = useState('')
  const { Common, Layout, Images, Gutters, Fonts } = useTheme()
  const [isSelected, setSelection] = useState('')

  const onProfileHandler = () => {
    navigation.navigate('Profile')
  }

  const onNewRefillHandler = () => {
    navigation.navigate('Selectplan', { phone_number: number })
  }

  const onContinueHandler = () => {
    navigation.navigate('AddMoney', {
      planId: isSelected,
      phone_number: number,
    })
  }

  const onExitApp = () => {
    Alert.alert('Exit App?', 'Are you sure you want to exit?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      { text: 'YES', onPress: () => BackHandler.exitApp() },
    ])
    return true
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onExitApp)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onExitApp)
    }
  }, [])

  useEffect(() => {
    setNumber(user.userData.phone_number)
  }, [])

  // useEffect(() => {
  //   function formatPhoneNumber(phoneNumberString) {
  //     var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  //     var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  //     if (match) {
  //       setNumber('(' + match[1] + ') ' + match[2] + '-' + match[3])
  //     }
  //     return null
  //   }
  //   formatPhoneNumber(user.userData.phone_number)
  // }, [user, number])

  console.log('number', number)

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
    return () => {
      setSelection('')
    }
  }, [])

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
      headerRight: () => (
        <Avatar
          size={64}
          rounded
          onPress={onProfileHandler}
          source={Images.avatar}
          containerStyle={[
            Gutters.twentyRMargin,
            Gutters.fortyHeight,
            Gutters.fortyWidth,
            Common.greyColor,
          ]}
        />
      ),
      headerTitleAlign: 'left',
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    })
  }, [navigation, theme])

  const onPlanSelect = id => {
    if (isSelected === '') {
      setSelection(id)
      return
    } else if (isSelected === id) {
      setSelection('')
      return
    } else if (isSelected !== id) {
      setSelection(id)
      return
    }
  }

  const onShowHistoryHandler = id => {
    navigation.navigate('RefillHistory', { refillTransactionId: id })
  }

  return (
    <SafeAreaView style={[Layout.fill, Common.backgroundPrimary]}>
      <View
        style={[
          Layout.flexTwo,
          Layout.justifyContentCenter,
          Gutters.twentyFourHMargin,
        ]}
      >
        <Text
          style={[
            Common.primaryGrey,
            Fonts.fontSizeRegular,
            Fonts.fontWeightRegular,
            Fonts.fontFamilyPrimary,
          ]}
        >
          Hello,{' '}
          <Text style={[Common.titleText, Fonts.fontFamilyPrimary]}>
            Anastasia.
          </Text>
        </Text>
      </View>
      <View
        style={[
          Layout.flexThree,
          Gutters.fiveVMargin,
          Gutters.twentyFourHMargin,
        ]}
      >
        <View style={[Layout.row]}>
          <Text
            style={[
              Common.primaryGrey,
              Fonts.fontWeightSmall,
              Fonts.fontFamilyPrimary,
              Gutters.tenBMargin,
              Fonts.fontFamilyPrimary,
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
            ]}
          />
        </View>
        <View
          style={[
            Layout.flexTwo,
            Layout.row,
            Layout.alignItemsCenter,
            Layout.justifyContentBetween,
            Common.borderRadius,
            Common.primaryBlueBackground,
          ]}
        >
          <TextInput
            defaultValue={number}
            onChangeText={num => setNumber(num)}
            maxLength={14}
            keyboardType="numeric"
            style={[
              Fonts.fontFamilyPrimary,
              Common.white,
              Fonts.fontSizeRegular,
              Fonts.fontWeightRegular,
              Gutters.tenHMargin,
            ]}
          />
          <Image
            source={Images.whitecarrier12}
            style={[
              { resizeMode: 'contain' },
              Layout.center,
              Gutters.eightRMargin,
              Gutters.thirtyPWidth,
            ]}
          />
        </View>
      </View>
      {History.length !== 0 ? <UserHistory /> : <CarrierPlans />}
    </SafeAreaView>
  )
}

export default Home
