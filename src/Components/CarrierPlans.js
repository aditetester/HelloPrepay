import React, { useState, useEffect } from 'react'
import { View, Text, Image, FlatList, Pressable } from 'react-native'
import { useTheme } from '@/Hooks'
import { useSelector } from 'react-redux'
import { CheckBox, Button } from '@rneui/themed'
import Plans from '@/screen/Data/plans'
import { useNavigation } from '@react-navigation/native'

const CarrierPlans = ({ phone_number }) => {
  const navigation = useNavigation()
  const theme = useSelector(state => state.theme)
  const { Common, Layout, Images, Gutters, Fonts } = useTheme()
  const [isSelected, setSelection] = useState('')

  const onContinue = () => {
    navigation.navigate('AddMoney', { phone_number: phone_number })
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
                  Common.resizeModeContain,
                  Gutters.twentyfiveHeight,
                  Gutters.twentyfiveWidth,
                ]}
              />
            }
            uncheckedIcon={
              <Image
                source={Images.unchecked}
                style={[
                  Common.resizeModeContain,
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

  return (
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
            style={[Layout.flexTwo, Common.resizeModeContain]}
          />
        ) : (
          <Image
            source={Images.whitecarrier12}
            style={[Common.resizeModeContain, Layout.flexTwo]}
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
        {/* <Button
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
        /> */}
        <Button
          title="continue"
          loading={false}
          onPress={() => {
            onContinue()
          }}
          loadingProps={[{ size: 'small' }, Common.whiteColor]}
          titleStyle={[Fonts.fontWeightRegular, Fonts.fontFamilyPrimary]}
          buttonStyle={[
            Common.primaryPinkBackground,
            Gutters.fiftyfiveHeight,
            Common.borderRadius,
          ]}
          containerStyle={[
            Gutters.ninetyfivePWidth,
            Gutters.twentyTMargin,
            Layout.selfCenter,
            Common.borderRadius,
          ]}
          // disabled={!planIsValid}
          disabledStyle={[Common.whiteColor, Common.greyBackground]}
          disabledTitleStyle={[Common.whiteColor, Gutters.zeroOsevenOpacity]}
        />
      </View>
    </>
  )
}
export default CarrierPlans
