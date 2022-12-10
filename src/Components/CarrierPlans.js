import React, { useState, useEffect, useCallback, Fragment } from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import { useTheme } from '@/Hooks'
import { useSelector } from 'react-redux'
import { CheckBox, Button, Skeleton } from '@rneui/themed'
import { useNavigation } from '@react-navigation/native'
import { useGetPlansMutation } from '@/Services/api'
import { useNetInfo } from '@react-native-community/netinfo'
import { useIsFocused } from '@react-navigation/native'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'

const CarrierPlans = ({ phone_number, formattedNumber, first_name }) => {
  //#region NOTE: 1 Define Variable
  const navigation = useNavigation()
  const netInfo = useNetInfo()
  // const theme = useSelector(state => state.theme)
  const userData = useSelector(state => state.user.userData)
  const theme = useSelector(state => state.theme)
  const { Common, Layout, Images, Gutters, Fonts } = useTheme()

  const [isSelected, setSelection] = useState('')
  const [selectedPrice, setSelectedPrice] = useState('')
  const [selectedName, setSelectedName] = useState('')
  const [selectFullPlanName, setSelectFullPlanName] = useState('')
  const [fetching, setFetching] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  let phone_numberIsValid = phone_number.length === 10
  let formattedNumberIsSelected = formattedNumber.length === 14
  let planIsSelected = !isSelected
  let valid =
    phone_numberIsValid && formattedNumberIsSelected && !planIsSelected

  const [getPlan, { data, isLoading, error }] = useGetPlansMutation()

  //#endregion

  //#region NOTE: 2 HELPER METHODS
  const onContinue = () => {
    if (selectedPrice.split('-').length == 1) {
      navigation.navigate('Checkout', {
        amount: `$${selectedPrice}`,
        phone_number: phone_number,
        formattedNumber: formattedNumber,
        totalAmount: selectedPrice,
        planId: isSelected,
        planName: selectedName,
        FullPlanName: selectFullPlanName,
        navigateFor: 'planOrder',
      })
      setSelection('')
      setSelectedPrice('')
      setSelectedName('')
    } else {
      navigation.navigate('AddMoney', {
        phone_number: phone_number,
        planId: isSelected,
        planName: selectedName,
        formattedNumber: formattedNumber,
        Price: selectedPrice,
        priceRange: selectedPrice,
        FullPlanName: selectFullPlanName,
        navigateFor: 'planOrder',
      })
      setSelection('')
      setSelectedPrice('')
      setSelectedName('')
    }
  }

  const onPlanSelect = (id, price, name, cID, fullName) => {
    if (isSelected === '') {
      setSelection(id)
      setSelectedPrice(price)
      setSelectedName(name)
      setSelectFullPlanName(fullName)
      return
    } else if (isSelected === id) {
      setSelection('')
      setSelectedPrice('')
      setSelectedName('')
      setSelectFullPlanName('')
      return
    } else if (isSelected !== id) {
      setSelection(id)
      setSelectedPrice(price)
      setSelectedName(name)
      setSelectFullPlanName(fullName)
      return
    }
  }

  const onRefresh = () => {
    setIsRefreshing(true)
    setSelection('')
    setSelectedPrice('')
    setSelectedName('')
    getPlan({
      ID: userData.carrier_id,
      token: 'TzZSsHQVMb5j47lPPNowxG507dOD5Qw6fkSCUxYp',
    })
  }

  //#endregion

  //#region NOTE: 3 Life Cycle Methods
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
  }, [, netInfo.isConnected, userData])

  useEffect(() => {
    if (isLoading) {
      setFetching(true)
    } else {
      setFetching(false)
      setIsRefreshing(false)
    }
  }, [isLoading])

  //#endregion

  //#region NOTE: 4 Render Methods

  const keyExtractor = (item, index) => index.toString()

  const renderPlans = ({ item }) => {
    const str = item.plan_name
    const result = str.replace(/[^\d-]/g, '')
    const price = item.price == 0 ? result : item.price
    const name = item.plan_name.split(' ')[0]
    return (
      <Pressable
        onPress={() =>
          onPlanSelect(item.id, price, name, item.cid, item.plan_name)
        }
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={[
          { marginVertical: scale(6) },
          Common.offWhiteSecondaryBorder,
          item.id === isSelected && Common.primaryPinkBorder,
          item.id === isSelected && Common.primaryPinkBackground,
          // Layout.fill,
          Common.borderWidthOne,
          Common.borderRadius,
          // Gutters.sixVMargin,
        ]}
      >
        <View style={[Layout.row, { justifyContent: 'space-between' }]}>
          <View
            style={{
              width: '80%',
              flexDirection: 'column',
              marginLeft: scale(10),
            }}
          >
            <Text
              style={[
                // { marginRight: scale(5) },
                Common.primaryBlueMode,
                isSelected === item.id && Common.white,
                // Gutters.fiveRMargin,
                Fonts.fontWeightRegular,
                Fonts.fontSizeSmall,
                Fonts.fontFamilyPrimary,
              ]}
            >
              {item.plan_name}
            </Text>
            <Text
              style={[
                // { marginLeft: scale(10) },
                Common.primaryGrey,
                isSelected === item.id && Common.white,
                Gutters.fiveVMargin,
                Fonts.fontFamilyPrimary,
                Fonts.fontSize12,
              ]}
            >
              {item.type}
            </Text>
          </View>
          <View style={{ justifyContent: 'center' }}>
            <CheckBox
              center
              checked={item.id === isSelected}
              onPress={() => onPlanSelect(item.id)}
              checkedIcon={
                <Image
                  source={Images.checked}
                  style={[
                    { height: verticalScale(25), width: scale(25) },
                    Common.resizeModeContain,
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
                // Gutters.twozerozeroLMargin,
                // Gutters.twentyMBMargin,
                Layout.center,
                Layout.selfCenter,
              ]}
              wrapperStyle={[Layout.center]}
            />
          </View>
        </View>
        {/* <Text
          style={[
            { marginLeft: scale(10) },
            Common.primaryGrey,
            isSelected === item.id && Common.white,
            Gutters.fiveVMargin,
            Fonts.fontFamilyPrimary,
            Fonts.fontSize12,
          ]}
        >
          {item.type}
        </Text> */}
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
      <Text
        style={[Common.textColor, { fontStyle: 'italic', fontWeight: '600' }]}
      >
        Pull down to retry
      </Text>
    </View>
  )

  const loading = (
    <View
      style={[
        { flex: 12.5, marginHorizontal: 31 },
        Layout.justifyContentCenter,
        Gutters.twentyFourHMargin,
        Gutters.fiveVMargin,
        Layout.center,
      ]}
    >
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
        style={{ borderRadius: 4, marginVertical: 10, flex: 5 }}
      />
    </View>
  )

  const carrierPlanComponent = (
    <Fragment>
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
          {`Let’s make your first refill ${first_name}`}
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
          { width: '100%' },
          Layout.flexThree,
          Layout.alignItemsCenter,
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
            maxWidth: 200,
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
          {data ? `${data.data.length} plans available` : 'Hello Prepay'}
        </Text>
      </View>

      {isLoading ? (
        loading
      ) : (
        <React.Fragment>
          <View style={[Layout.flexTen, Gutters.twentyHMargin]}>
            <FlatList
              showsVerticalScrollIndicator={false}
              keyExtractor={keyExtractor}
              data={data && data.data}
              renderItem={renderPlans}
              ListEmptyComponent={error && errorComponent}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                  tintColor={theme.darkMode ? 'white' : 'black'}
                />
              }
            />
          </View>
          <View
            style={[
              {
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
                width: '90%',
                flex: 3,
              },
              Layout.selfCenter,
              Gutters.twentyBMargin,
              Gutters.twentyMTMargin,
            ]}
          >
            <View style={{ width: '48%' }}>
              <Button
                title="Change carrier"
                loading={false}
                onPress={() =>
                  navigation.navigate('ChangeCarrier', { navigateFrom: 'Home' })
                }
                loadingProps={[{ size: 'small' }, Common.whiteColor]}
                titleStyle={[Fonts.fontWeightRegular, Fonts.fontFamilyPrimary]}
                buttonStyle={[
                  { height: verticalScale(55) },
                  Common.primaryPinkBackground,
                  // Gutters.fiftyfiveHeight,
                  Gutters.hundredPWidth,
                  Common.borderRadius,
                ]}
                containerStyle={[
                  Gutters.twentyTMargin,
                  Layout.selfCenter,
                  Common.borderRadius,
                  Gutters.hundredPWidth,
                ]}
                disabled={false}
              />
            </View>
            <View style={{ width: '48%' }}>
              <Button
                title="Continue"
                loading={false}
                onPress={() => {
                  onContinue()
                }}
                loadingProps={[{ size: 'small' }, Common.whiteColor]}
                titleStyle={[Fonts.fontWeightRegular, Fonts.fontFamilyPrimary]}
                buttonStyle={[
                  { height: verticalScale(55) },
                  Common.primaryPinkBackground,
                  // Gutters.fiftyfiveHeight,
                  Common.borderRadius,
                  Gutters.hundredPWidth,
                ]}
                containerStyle={[
                  // Gutters.fortyPWidth,
                  Gutters.twentyTMargin,
                  Layout.selfCenter,
                  Common.borderRadius,
                  Gutters.hundredPWidth,
                ]}
                disabled={!valid}
                disabledStyle={[Common.whiteColor, Common.greyBackground]}
                disabledTitleStyle={[
                  Common.whiteColor,
                  Gutters.zeroOsevenOpacity,
                ]}
              />
            </View>
          </View>
        </React.Fragment>
      )}
    </Fragment>
  )

  //#endregion

  return <Fragment>{carrierPlanComponent}</Fragment>
}
export default CarrierPlans
