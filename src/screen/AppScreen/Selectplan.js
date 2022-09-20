import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  SafeAreaView,
  FlatList,
  Pressable,
  TouchableOpacity,
} from 'react-native'
import { useSelector } from 'react-redux'
import { useTheme } from '@/Hooks'
import { CheckBox } from '@rneui/themed'
import Button from '@/Components/UI/Button'
import Plans from '../Data/plans'
import plans from '../Data/plans'

const Selectplan = ({ navigation, route }) => {
  //NOTE: 1. Define Variables
  let params = route.params
  const theme = useSelector(state => state.theme)
  const { Common, Layout, Images, Gutters, Fonts } = useTheme()
  const [isSelected, setSelection] = useState('')
  console.log(params.phone_number)

  //NOTE: 2. Helper Method
  const onBackHandler = () => {
    navigation.goBack()
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

  const onContinueHandler = () => {
    navigation.navigate('AddMoney', {
      planId: isSelected,
      phone_number: params.phone_number,
    })
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
          Common.borderWidth,
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
              Fonts.fontWeightRegular,
              Fonts.fontSizeSmall,
              Gutters.fiveRMargin,
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
              Layout.center,
              Layout.selfCenter,
              Gutters.onesixzeroLMargin,
              Gutters.twentyFiveMBMargin,
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
            Fonts.fontWeightSmall,
          ]}
        >
          {item.info}
        </Text>
      </Pressable>
    )
  }

  //NOTE: 3. Life Cycle

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

  //NOTE: 4. Render Method

  return (
    <SafeAreaView style={[Layout.fill, Common.backgroundPrimary]}>
      <TouchableOpacity
        style={[Gutters.fifteenPWidth, Gutters.fiveTMargin, Gutters.tenHMargin]}
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
          Layout.flexTwo,
          Layout.justifyContentCenter,
          Layout.alignItemsCenter,
          Gutters.tenVMargin,
          Gutters.twentyFourHMargin,
        ]}
      >
        <Text
          style={[
            Common.titleText,
            Fonts.fontFamilyPrimary,
            Fonts.fontSizeLarge,
            Fonts.fontWeightRegular,
            Gutters.oneVMargin,
          ]}
        >
          Select your plan
        </Text>
        <Text
          style={[
            Common.titleText,
            Fonts.fontFamilyPrimary,
            Fonts.fontSizeSmall,
            Fonts.fontWeightSmall,
            Gutters.tenVMargin,
          ]}
        >
          Choose the one that suits you best.
        </Text>
      </View>
      <View
        style={[
          Layout.flexTwo,
          Layout.row,
          Layout.justifyContentBetween,
          Layout.alignItemsCenter,
          Gutters.twentyFourHMargin,
          Gutters.tenVMargin,
        ]}
      >
        {theme.darkMode ? (
          <Image
            source={Images.whitecarrier12}
            style={[{ resizeMode: 'contain' }, Gutters.fortyPWidth]}
          />
        ) : (
          <Image
            source={Images.carrier12}
            style={[{ resizeMode: 'contain' }, Gutters.fortyPWidth]}
          />
        )}

        <Text
          style={[
            Fonts.fontWeightSmall,
            Fonts.fontSizeSmall,
            Common.normalText,
            Fonts.fontFamilyPrimary,
          ]}
        >
          {plans.length} plans available
        </Text>
      </View>

      <View style={[Gutters.twentyFourHMargin, Layout.flexTen]}>
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
          Gutters.ninetyfivePWidth,
          Gutters.fortyBMargin,
          Layout.flexTwo,
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
    </SafeAreaView>
  )
}

export default Selectplan
