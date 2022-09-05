import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  SafeAreaView,
  FlatList,
  Pressable,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native'
import { useSelector } from 'react-redux'
import { useTheme } from '@/Hooks'
import { Avatar, CheckBox } from '@rneui/themed'
import Button from '@/Components/UI/Button'
import Plans from '../Data/plans'
import History from '../Data/history'
import AntIcon from 'react-native-vector-icons/AntDesign'
import { firebase } from '@react-native-firebase/app'

const Home = ({ navigation }) => {
  let user = firebase.auth().currentUser
  const [number, setNumber] = useState(user.phoneNumber.slice(2))
  const theme = useSelector(state => state.theme)
  const { Common, Layout, Images, Gutters, Fonts } = useTheme()
  const [isSelected, setSelection] = useState('')

  const onProfileHandler = () => {
    navigation.navigate('Profile')
  }

  const onNewRefillHandler = () => {
    navigation.navigate('Selectplan')
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

  console.log('Final', number)

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
      return setNumber(input)
    }
    phoneFormat(number)
  }, [number])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onExitApp)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onExitApp)
    }
  }, [])

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
            // Common.borderWidthOne,
          ]}
        />
      ),
      headerTitleAlign: 'left',
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    })
  }, [navigation, theme])

  const onContinueHandler = () => {
    navigation.navigate('AddMoney', { planId: isSelected })
  }

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

  const keyExtractor = (item, index) => index.toString()

  const renderPlans = ({ item }) => {
    return (
      <Pressable
        onPress={() => onPlanSelect(item.id)}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={[
          Common.offWhiteSecondaryBorder,
          item.id === isSelected && Common.primaryPinkBorder,
          item.id === isSelected && Common.primaryPinkBackground,
          Layout.fill,
          Common.borderWidthOne,
          Common.borderRadius,
          Gutters.ninePadding,
          Gutters.sixVMargin,
        ]}
      >
        <View style={[Layout.row]}>
          <Text
            style={[
              Common.primaryBlueMode,
              isSelected === item.id && Common.white,
              Gutters.fiveRMargin,
              Fonts.fontWeightRegular,
              Fonts.fontSizeSmall,
              Fonts.fontFamilyPrimary,
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              Common.primaryBlueMode,
              isSelected === item.id && Common.white,
              Fonts.fontSizeSmall,
              Fonts.fontWeightRegular,
              Fonts.fontFamilyPrimary,
            ]}
          >
            {item.price}
          </Text>
          <CheckBox
            center
            checked={item.id === isSelected}
            onPress={() => onPlanSelect(item.id)}
            checkedIcon={
              <Image
                source={Images.checked}
                style={[
                  { resizeMode: 'contain' },
                  Gutters.twentyfiveHeight,
                  Gutters.twentyfiveWidth,
                ]}
              />
            }
            uncheckedIcon={
              <Image
                source={Images.unchecked}
                style={[
                  { resizeMode: 'contain' },
                  Gutters.twentyfiveHeight,
                  Gutters.twentyfiveWidth,
                ]}
              />
            }
            containerStyle={[
              Common.backgroundPrimary,
              item.id === isSelected && Common.primaryPinkBackground,
              Gutters.onesixzeroLMargin,
              Gutters.twentyFiveMBMargin,
              Layout.center,
              Layout.selfCenter,
            ]}
            wrapperStyle={[Layout.center]}
          />
        </View>
        <Text
          style={[
            Common.primaryGrey,
            isSelected === item.id && Common.white,
            Gutters.fiveVMargin,
            Fonts.fontFamilyPrimary,
          ]}
        >
          {item.info}
        </Text>
      </Pressable>
    )
  }
  const renderHistory = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => onShowHistoryHandler(item.id)}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={[
          Common.offWhiteSecondaryBorder,
          Layout.fill,
          Common.borderWidthOne,
          Gutters.sixVMargin,
          Common.borderRadius,
        ]}
      >
        <View style={[Layout.justifyContentCenter, Gutters.tenBMargin]}>
          <View style={[Layout.row]}>
            <Image
              source={item.image}
              style={[
                { resizeMode: 'contain' },
                Gutters.fiftyHeight,
                Gutters.twentyPWidth,
                Gutters.fiveVMargin,
              ]}
            />
            <View style={[Layout.row]}>
              <Text
                style={[
                  Common.primaryBlueMode,
                  isSelected === item.id && Common.white,
                  Fonts.fontWeightRegular,
                  Fonts.fontSizeSmall,
                  Gutters.tenTMargin,
                  Gutters.fiveHMargin,
                  Fonts.fontFamilyPrimary,
                ]}
              >
                {item.title}
              </Text>
              <Text
                style={[
                  Common.primaryBlueMode,
                  isSelected === item.id && Common.white,
                  Fonts.fontWeightRegular,
                  Fonts.fontSizeSmall,
                  Gutters.tenTMargin,
                  Fonts.fontFamilyPrimary,
                ]}
              >
                {item.price}
              </Text>
              <View
                style={[
                  Gutters.onetwozeroLMargin,
                  Gutters.twentyTMargin,
                  Gutters.zeroOfiveOpacity,
                ]}
              >
                <AntIcon
                  name="right"
                  color={Common.normalText.color}
                  size={15}
                />
              </View>
            </View>
          </View>
          <View
            style={[Gutters.twentyFiveMTMargin, Gutters.seventyfourLMargin]}
          >
            <Text
              style={[
                Common.primaryGrey,
                isSelected === item.id && Common.white,
                Fonts.fontFamilyPrimary,
              ]}
            >
              {item.date}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const plans = (
    <>
      <View
        style={[
          Layout.flexTwo,
          Layout.center,
          Gutters.twentyHMargin,
          Gutters.fiveVMargin,
        ]}
      >
        <Text
          style={[
            Fonts.fontWeightRegular,
            Fonts.fontSizeSmall,
            Fonts.fontFamilyPrimary,
            Common.titleText,
          ]}
        >
          Let’s make your first refill Anastasia
        </Text>
        <Text
          style={[
            Fonts.fontSizeExtraSmall,
            Fonts.fontWeightSmall,
            Fonts.textCenter,
            Common.primaryGrey,
            Fonts.fontFamilyPrimary,
          ]}
        >
          Select one plan from the list available for your carrier and top-up
          your phone number instantly
        </Text>
      </View>
      <View
        style={[
          Layout.flexThree,
          Layout.alignItemsCenter,
          Gutters.twentyFourHMargin,
          Gutters.tenVMargin,
        ]}
      >
        {!theme.darkMode ? (
          <Image
            source={Images.carrier12}
            style={[{ resizeMode: 'contain' }, Layout.flexTwo]}
          />
        ) : (
          <Image
            source={Images.whitecarrier12}
            style={[{ resizeMode: 'contain' }, Layout.flexTwo]}
          />
        )}
        <Text
          style={[
            Common.primaryGrey,
            Fonts.fontWeightSmall,
            Fonts.fontSizeExtraSmall,
            Fonts.fontFamilyPrimary,
            Gutters.eightVMargin,
          ]}
        >
          {Plans.length} plans available
        </Text>
      </View>
      <View style={[Layout.flexTen, Gutters.twentyFourHMargin]}>
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={keyExtractor}
          data={Plans}
          renderItem={renderPlans}
        />
      </View>
      <View
        style={[
          Layout.selfCenter,
          Layout.flexTwo,
          Gutters.ninetyfivePWidth,
          Gutters.fortyBMargin,
          Gutters.twentyMTMargin,
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
            isSelected ? Common.primaryPink.color : Common.greyColor.color
          }
          disabled={!isSelected}
        />
      </View>
    </>
  )

  let history = (
    <>
      <View
        style={[
          Layout.flexTwo,
          Layout.justifyContentCenter,
          Gutters.twentyFourHMargin,
          Gutters.fiveVMargin,
        ]}
      >
        <Text
          style={[
            Fonts.fontWeightRegular,
            Fonts.fontSizeRegular,
            Fonts.fontFamilyPrimary,
            Common.titleText,
          ]}
        >
          Refill history
        </Text>
      </View>
      <View style={[Gutters.twentyFourHMargin, Layout.flexFifteen]}>
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={keyExtractor}
          data={History}
          renderItem={renderHistory}
        />
      </View>
      <View
        style={[
          Layout.selfCenter,
          Layout.flexTwo,
          Gutters.ninetyfivePWidth,
          Gutters.fortyBMargin,
          Gutters.twentyMTMargin,
          Gutters.fortyBMargin,
          Gutters.twentyMTMargin,
        ]}
      >
        <Button
          onPress={() => {
            onNewRefillHandler()
          }}
          title={'New refill'}
          size="sm"
          fontSize={Fonts.fontSizeMedium.fontSize}
          backgroundColor={Common.primaryPink.color}
          disabled={false}
        />
      </View>
    </>
  )

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
          <Text
            style={[
              Fonts.fontFamilyPrimary,
              Common.white,
              Fonts.fontSizeRegular,
              Fonts.fontWeightRegular,
              Gutters.tenHMargin,
            ]}
          >
            {number}
          </Text>
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
      {History.length !== 0 ? history : plans}
    </SafeAreaView>
  )
}

export default Home
