import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import { useSelector } from 'react-redux'
import { useTheme } from '@/Hooks'
import { Button } from '@rneui/themed'
import History from '../screen/Data/history'
import AntIcon from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'

const UserHistory = () => {
  const navigation = useNavigation()
  const { Common, Gutters, Images, Layout, Fonts } = useTheme()
  const userData = useSelector(state => state.user.userData)
  const [isSelected, setSelection] = useState('')

  const onNewRefillHandler = () => {
    navigation.navigate('Selectplan', { phone_number: userData.phone_number })
  }

  const onShowHistoryHandler = id => {
    navigation.navigate('RefillHistory', { refillTransactionId: id })
  }

  const keyExtractor = (item, index) => index.toString()
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
  return (
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
        {/* <Button
          onPress={() => {
            onNewRefillHandler()
          }}
          title={'New refill'}
          size="sm"
          fontSize={Fonts.fontSizeMedium.fontSize}
          backgroundColor={Common.primaryPink.color}
          disabled={!(number.length === 14)}
          disabledStyle={[Common.whiteColor, Common.greyBackground]}
          disabledTitleStyle={[Common.whiteColor, Gutters.zeroOsevenOpacity]}
        /> */}
        <Button
          title="New refill"
          loading={false}
          onPress={() => {
            onNewRefillHandler()
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
          // disabled={!historyIsValid}
          disabledStyle={[Common.whiteColor, Common.greyBackground]}
          disabledTitleStyle={[Common.whiteColor, Gutters.zeroOsevenOpacity]}
        />
      </View>
    </>
  )
}

export default UserHistory
