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
  console.log('🚀 ~ Home ~ ', user.userData)
  let first_name =
    user.userData.first_name.charAt(0).toUpperCase() +
    user.userData.first_name.slice(1)

  const [number, setNumber] = useState('')
  const withoutFormateNumber = String(number).replace(/\D/g, '')
  const { Common, Layout, Images, Gutters, Fonts } = useTheme()
  const [visible, setVisible] = useState(false)

  const toggleDialog2 = () => {
    setVisible(!visible)
  }

  const onProfileHandler = () => {
    navigation.navigate('Profile')
  }

  const onExitApp = () => {
    Alert.alert('Exit App?', 'Are you sure you want to exit?', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => null,
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
    phoneFormat(String(number))
  }, [number])

  useEffect(() => {
    setNumber(user.userData.phone_number)
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
            style={[Gutters.headerWidthWidth, Common.resizeModeContain]}
          />
        ) : (
          <Image
            source={Images.darkThemeLogo}
            style={[
              Gutters.headerHeight,
              Gutters.headerWidthWidth,
              Common.resizeModeContain,
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
            {first_name}.
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
            defaultValue={String(number)}
            onChangeText={text => setNumber(text)}
            keyboardType="numeric"
            maxLength={14}
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
              Layout.center,
              Gutters.eightRMargin,
              Gutters.thirtyPWidth,
              Common.resizeModeContain,
            ]}
          />
        </View>
      </View>
      {History.length !== 0 ? (
        <UserHistory phone_number={withoutFormateNumber} />
      ) : (
        <CarrierPlans phone_number={withoutFormateNumber} />
      )}
    </SafeAreaView>
  )
}

export default Home
