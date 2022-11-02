import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Image, FlatList, Pressable } from 'react-native'
import { useTheme } from '@/Hooks'
import { useSelector } from 'react-redux'
import { CheckBox, Button, Skeleton } from '@rneui/themed'
import { useNavigation } from '@react-navigation/native'
import { useGetPlansMutation } from '@/Services/api'
import { useNetInfo } from '@react-native-community/netinfo'

const CarrierPlans = ({ phone_number, formattedNumber }) => {
  //NOTE: 1 Define Variable
  const navigation = useNavigation()
  const netInfo = useNetInfo()
  // const theme = useSelector(state => state.theme)
  const userData = useSelector(state => state.user.userData)
  const { Common, Layout, Images, Gutters, Fonts } = useTheme()

  const [isSelected, setSelection] = useState('')
  const [selectedPrice, setSelectedPrice] = useState('')
  console.log(selectedPrice)
  const [fetching, setFetching] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  let phone_numberIsValid = phone_number.length === 10
  let formattedNumberIsSelected = formattedNumber.length === 14
  let planIsSelected = !isSelected
  let valid =
    phone_numberIsValid && formattedNumberIsSelected && !planIsSelected

  const [getPlan, { data, isLoading, error }] = useGetPlansMutation()

  console.log(userData)

  //NOTE: 2 HELPER METHODS
  const onContinue = () => {
    navigation.navigate('AddMoney', {
      phone_number: phone_number,
      carrierId: isSelected,
      formattedNumber: formattedNumber,
      Price: selectedPrice,
    })
    setSelection('')
    setSelectedPrice('')
  }

  const onPlanSelect = (id, price) => {
    if (isSelected === '') {
      setSelection(id)
      setSelectedPrice(price)
      return
    } else if (isSelected === id) {
      setSelection('')
      setSelectedPrice('')
      return
    } else if (isSelected !== id) {
      setSelection(id)
      setSelectedPrice(price)
      return
    }
  }

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    getPlan({
      ID: userData.carrier_id,
      token: 'TzZSsHQVMb5j47lPPNowxG507dOD5Qw6fkSCUxYp',
    })
  }, [])

  //NOTE: 3 Life Cycle Methods
  useEffect(() => {
    if (fetching) {
      setTimeout(() => {
        setFetching(false)
      }, 2000)
    }
  }, [fetching])

  useEffect(() => {
    getPlan({
      ID: userData.carrier_id,
      token: 'TzZSsHQVMb5j47lPPNowxG507dOD5Qw6fkSCUxYp',
    })
  }, [, netInfo.isConnected])

  useEffect(() => {
    if (isLoading) {
      setFetching(true)
    } else {
      setFetching(false)
      setIsRefreshing(false)
    }
  }, [isLoading])

  //NOTE: 4 Render Methods

  const keyExtractor = (item, index) => index.toString()

  const renderPlans = ({ item }) => {
    const str = item.plan_name
    const result = str.replace(/[^\d-]/g, '')
    const price = item.price == 0 ? result : item.price
    const name = item.plan_name.split(' ')[0]
    const description =
      item.description === '' ? item.plan_name : item.description
    return (
      <Pressable
        onPress={() => onPlanSelect(item.id, price)}
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
            {name}
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
            {`$${price}`}
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
          {item.type}
        </Text>
      </Pressable>
    )
  }

  const errorComponent = (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
      }}
    >
      <Image
        source={Images.error}
        style={{ width: '100%', height: 100 }}
        resizeMode="contain"
      />
      <Text
        style={[Common.textColor, { fontStyle: 'italic', fontWeight: '600' }]}
      >
        {!netInfo.isConnected
          ? 'Please Check Your Internet Connection'
          : 'Data Not Found'}
      </Text>
    </View>
  )

  const loading = (
    <View
      style={[
        { flex: 18, marginHorizontal: 31 },
        Layout.justifyContentCenter,
        Gutters.twentyFourHMargin,
        Gutters.fiveVMargin,
        Layout.center,
      ]}
    >
      <Skeleton
        animation="wave"
        width="100%"
        style={{ borderRadius: 4, marginVertical: 10, flex: 1 }}
      />
      <Skeleton
        animation="wave"
        width="100%"
        style={{ borderRadius: 4, marginVertical: 10, flex: 0.5 }}
      />
      <Skeleton
        animation="wave"
        width="100%"
        style={{ borderRadius: 4, marginVertical: 10, flex: 0.5 }}
      />
      <Skeleton
        animation="wave"
        width="100%"
        style={{ borderRadius: 4, marginVertical: 10, flex: 2 }}
      />
      <Skeleton
        animation="wave"
        width="100%"
        style={{ borderRadius: 4, marginVertical: 10, flex: 1 }}
      >
        <Skeleton
          animation="wave"
          width="100%"
          style={{ borderRadius: 4, marginVertical: 10, flex: 2 }}
        />
      </Skeleton>
      <Skeleton
        animation="wave"
        width="100%"
        style={{ borderRadius: 4, marginVertical: 10, flex: 1 }}
      />
      <Skeleton
        animation="wave"
        width="100%"
        style={{ borderRadius: 4, marginVertical: 10, flex: 1 }}
      />
      <Skeleton
        animation="wave"
        width="100%"
        style={{ borderRadius: 4, marginVertical: 10, flex: 1 }}
      />
      <Skeleton
        animation="wave"
        width="100%"
        style={{ borderRadius: 4, marginVertical: 10, flex: 1 }}
      />
      <Skeleton
        animation="wave"
        width="100%"
        style={{ borderRadius: 4, marginVertical: 10, flex: 1 }}
      />
    </View>
  )

  const carrierPlanComponent = (
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
        <Image
          source={{ uri: userData.carrier_image }}
          style={{
            resizeMode: 'contain',
            width: '50%',
            height: 80,
            flex: 1,
            borderRadius: 4,
          }}
        />
        <Text
          style={[
            Common.primaryGrey,
            Fonts.fontWeightSmall,
            Fonts.fontSizeExtraSmall,
            Fonts.fontFamilyPrimary,
            Gutters.eightVMargin,
          ]}
        >
          {data && data.length} plans available
        </Text>
      </View>
      <View style={[Layout.flexTen, Gutters.twentyFourHMargin]}>
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={keyExtractor}
          data={data && data.data}
          renderItem={renderPlans}
          ListEmptyComponent={error && errorComponent}
          refreshing={isRefreshing} // Added pull to refresh state
          onRefresh={onRefresh}
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
          disabled={!valid}
          disabledStyle={[Common.whiteColor, Common.greyBackground]}
          disabledTitleStyle={[Common.whiteColor, Gutters.zeroOsevenOpacity]}
        />
      </View>
    </>
  )

  return <>{isLoading ? loading : carrierPlanComponent}</>
}
export default CarrierPlans
