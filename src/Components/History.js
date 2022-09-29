import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import { useTheme } from '@/Hooks'
import { Button, Skeleton } from '@rneui/themed'
import History from '../screen/Data/history'
import AntIcon from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'

const UserHistory = ({ phone_number, formattedNumber }) => {
  const navigation = useNavigation()
  const { Common, Gutters, Layout, Fonts } = useTheme()
  const [fetching, setFetching] = useState(true)
  const valid = phone_number.length === 10 && formattedNumber.length === 14

  const onNewRefillHandler = () => {
    navigation.navigate('Selectplan', {
      phone_number: phone_number,
      formattedNumber: formattedNumber,
    })
  }

  const onShowHistoryHandler = id => {
    navigation.navigate('RefillHistory', { refillTransactionId: id })
  }

  useEffect(() => {
    if (fetching) {
      setTimeout(() => {
        setFetching(false)
      }, 2000)
    }
  }, [])

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
                Common.resizeModeContain,
                Gutters.fiftyHeight,
                Gutters.twentyPWidth,
                Gutters.fiveVMargin,
              ]}
            />
            <View style={[Layout.row]}>
              <Text
                style={[
                  Common.primaryBlueMode,
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
            <Text style={[Common.primaryGrey, Fonts.fontFamilyPrimary]}>
              {item.date}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const loading = (
    <View
      style={[
        { flex: 20, marginHorizontal: 31 },
        Layout.justifyContentCenter,
        // Gutters.twentyFourHMargin,
        Gutters.fiveVMargin,
        Layout.center,
      ]}
    >
      <View
        style={[
          { flexDirection: 'row', flex: 1, justifyContent: 'space-between' },
          Gutters.twentyFourHMargin,
          Gutters.fiveVMargin,
        ]}
      >
        <Skeleton
          animation="wave"
          width="20%"
          height={40}
          style={{ marginRight: 10, borderRadius: 4 }}
        />
        <Skeleton
          animation="wave"
          width="100%"
          height={40}
          // style={{ marginVertical: 10, borderRadius: 4 }}
        />
      </View>
      <View
        style={[
          { flexDirection: 'row', flex: 1, justifyContent: 'space-between' },
          Gutters.twentyFourHMargin,
          Gutters.fiveVMargin,
        ]}
      >
        <Skeleton
          animation="wave"
          width="20%"
          height={40}
          style={{ marginRight: 10, borderRadius: 4 }}
        />
        <Skeleton
          animation="wave"
          width="100%"
          height={40}
          // style={{ marginVertical: 10, borderRadius: 4 }}
        />
      </View>
      <View
        style={[
          { flexDirection: 'row', flex: 1, justifyContent: 'space-between' },
          Gutters.twentyFourHMargin,
          Gutters.fiveVMargin,
        ]}
      >
        <Skeleton
          animation="wave"
          width="20%"
          height={40}
          style={{ marginRight: 10, borderRadius: 4 }}
        />
        <Skeleton
          animation="wave"
          width="100%"
          height={40}
          // style={{ marginVertical: 10, borderRadius: 4 }}
        />
      </View>
      <View
        style={[
          { flexDirection: 'row', flex: 1, justifyContent: 'space-between' },
          Gutters.twentyFourHMargin,
          Gutters.fiveVMargin,
        ]}
      >
        <Skeleton
          animation="wave"
          width="20%"
          height={40}
          style={{ marginRight: 10, borderRadius: 4 }}
        />
        <Skeleton
          animation="wave"
          width="100%"
          height={40}
          // style={{ marginVertical: 10, borderRadius: 4 }}
        />
      </View>
      <View
        style={[
          { flexDirection: 'row', flex: 1, justifyContent: 'space-between' },
          Gutters.twentyFourHMargin,
          Gutters.fiveVMargin,
        ]}
      >
        <Skeleton
          animation="wave"
          width="20%"
          height={40}
          style={{ marginRight: 10, borderRadius: 4 }}
        />
        <Skeleton
          animation="wave"
          width="100%"
          height={40}
          // style={{ marginVertical: 10, borderRadius: 4 }}
        />
      </View>
      <View
        style={[
          { flexDirection: 'row', flex: 1, justifyContent: 'space-between' },
          Gutters.twentyFourHMargin,
          Gutters.fiveVMargin,
        ]}
      >
        <Skeleton
          animation="wave"
          width="20%"
          height={40}
          style={{ marginRight: 10, borderRadius: 4 }}
        />
        <Skeleton
          animation="wave"
          width="100%"
          height={40}
          // style={{ marginVertical: 10, borderRadius: 4 }}
        />
      </View>
      <View
        style={[
          { flexDirection: 'row', flex: 1, justifyContent: 'space-between' },
          Gutters.twentyFourHMargin,
          Gutters.fiveVMargin,
        ]}
      >
        <Skeleton
          animation="wave"
          width="20%"
          height={40}
          style={{ marginRight: 10, borderRadius: 4 }}
        />
        <Skeleton animation="wave" width="100%" height={40} />
      </View>
    </View>
  )

  return (
    <>
      {fetching ? (
        loading
      ) : (
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
              title="New refill"
              loading={false}
              disabled={!valid}
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
              disabledStyle={[Common.whiteColor, Common.greyBackground]}
              disabledTitleStyle={[
                Common.whiteColor,
                Gutters.zeroOsevenOpacity,
              ]}
            />
          </View>
        </>
      )}
    </>
  )
}

export default UserHistory
