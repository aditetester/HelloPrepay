import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Image, FlatList, Pressable } from 'react-native'
import { useTheme } from '@/Hooks'
import { useSelector } from 'react-redux'
import { CheckBox, Button, Skeleton } from '@rneui/themed'
import { useNavigation } from '@react-navigation/native'
import { useGetPlansMutation } from '@/Services/api'
import { useNetInfo } from '@react-native-community/netinfo'

const CarrierPlans = ({ phone_number, formattedNumber, first_name }) => {
  //#region NOTE: 1 Define Variable
  const navigation = useNavigation()
  const netInfo = useNetInfo()
  // const theme = useSelector(state => state.theme)
  const userData = useSelector(state => state.user.userData)
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

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    setSelection('')
    setSelectedPrice('')
    setSelectedName('')
    getPlan({
      ID: userData.carrier_id,
      token: 'TzZSsHQVMb5j47lPPNowxG507dOD5Qw6fkSCUxYp',
    })
  }, [])

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
  }, [, netInfo.isConnected])

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
        <View style={[Layout.row, { justifyContent: 'space-between' }]}>
          <View style={{ width: '80%', flexDirection: 'row' }}>
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
              {/* {name} */}
              {item.plan_name}
            </Text>
            {/* <Text
              style={[
                Common.primaryBlueMode,
                isSelected === item.id && Common.white,
                Fonts.fontSizeSmall,
                Fonts.fontWeightRegular,
                Fonts.fontFamilyPrimary,
              ]}
            >
              {priceRange()}
            </Text> */}
          </View>
          <View>
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
                // Gutters.twozerozeroLMargin,
                Gutters.twentyFiveMBMargin,
                Layout.center,
                Layout.selfCenter,
              ]}
              wrapperStyle={[Layout.center]}
            />
          </View>
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
        { flex: 18.6, marginHorizontal: 31 },
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
          {data ? `${data.data.length} plans available` : 'network error!'}
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

  //#endregion

  return <>{isLoading ? loading : carrierPlanComponent}</>
}
export default CarrierPlans
