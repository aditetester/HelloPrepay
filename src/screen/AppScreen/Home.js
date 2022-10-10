import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  SafeAreaView,
  BackHandler,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { useSelector } from 'react-redux'
import { useTheme } from '@/Hooks'
import { Avatar } from '@rneui/themed'
import History from '../Data/history'
import CarrierPlans from '@/Components/CarrierPlans'
import UserHistory from '@/Components/History'
import { useIsFocused } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { useNetInfo } from '@react-native-community/netinfo'

const Home = ({ navigation }) => {
  //NOTE: 1. Define Variables
  const netInfo = useNetInfo()
  let focus = useIsFocused()
  const theme = useSelector(state => state.theme)
  const user = useSelector(state => state.user)
  let first_name =
    user.userData.first_name.charAt(0).toUpperCase() +
    user.userData.first_name.slice(1)
  const [number, setNumber] = useState(String(user.userData.phone_number))
  const withoutFormateNumber = String(number).replace(/\D/g, '')
  const { Common, Layout, Images, Gutters, Fonts } = useTheme()
  const [connection, setConnection] = useState('')

  //NOTE: 2. Helper Method

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

  //NOTE: 3. Life Cycle Method

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
  }, [navigation, theme, focus])

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
    if (netInfo.isConnected === false) {
      errorToast()
      setConnection(false)
    }
  }, [netInfo.isConnected])

  useEffect(() => {
    if (connection === false && netInfo.isConnected === true) {
      successToast()
      setConnection(true)
    }
  }, [connection, netInfo.isConnected])

  //NOTE: 4. Render Method

  const errorToast = () => {
    Toast.show({
      type: 'error',
      text1: 'No connection',
      text2: 'No Internet Connection',
      autoHide: true,
      visibilityTime: 2000,
      topOffset: 15,
    })
  }
  const successToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Back Online',
      text2: 'You Are Connected',
      autoHide: true,
      visibilityTime: 2000,
      topOffset: 15,
    })
  }

  return (
    <SafeAreaView style={[Layout.fill, Common.backgroundPrimary]}>
      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
          },
          Layout.flexTwo,
          Gutters.twentyFourHMargin,
        ]}
      >
        <View
          style={{
            justifyContent: 'center',
            flex: 1,
          }}
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
        <TouchableOpacity
          onPress={() => navigation.navigate('Esim')}
          style={{
            justifyContent: 'center',
            flex: 1,
            alignItems: 'flex-end',
          }}
        >
          <Image
            source={Images.eSim}
            style={{
              width: '30%',
              height: 40,
              resizeMode: 'contain',
              flex: 1,
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
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
              Gutters.fiftyfivePWidth,
            ]}
          />
          <Image
            source={{ uri: user.userData.carrier_image }}
            style={[
              {
                height: '90%',
                width: 70,
                borderRadius: 4,
              },
              Layout.center,
              Gutters.eightRMargin,
              // Gutters.thirtyPWidth,
              Common.resizeModeContain,
            ]}
          />
        </View>
      </View>
      {History.length !== 0 ? (
        <UserHistory
          phone_number={withoutFormateNumber}
          formattedNumber={number}
        />
      ) : (
        <CarrierPlans
          phone_number={withoutFormateNumber}
          formattedNumber={number}
        />
      )}
      <Toast
        ref={ref => {
          Toast.setRef(ref)
        }}
      />
    </SafeAreaView>
  )
}

export default Home
