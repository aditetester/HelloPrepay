import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme } from '@/Hooks'
import { Button, Icon } from '@rneui/themed'
import AntIcon from 'react-native-vector-icons/AntDesign'
import { setUser } from '@/Store/User'
import { useNetInfo } from '@react-native-community/netinfo'
import { useGetHistoryMutation } from '@/Services/api'
import RBSheet from 'react-native-raw-bottom-sheet'
import Spinner from 'react-native-loading-spinner-overlay'

const Profile = ({ navigation, route }) => {
  //NOTE: 1. Define Variables
  //   const params = route.params
  const netInfo = useNetInfo()
  const theme = useSelector(state => state.theme)
  const userData = useSelector(state => state.user.userData)
  const dispatch = useDispatch()
  const { Common, Layout, Images, Gutters, Fonts } = useTheme()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [bottomSheetData, setBottomSheetData] = useState('')

  const [getHistory, { data, isLoading, error }] = useGetHistoryMutation()

  //#region NOTE: 2. Helper Method

  // const onLogoutHandler = async () => {
  //   dispatch(setUser({ userData: null, isAuth: false }))
  // }

  const onBackHandler = () => {
    navigation.goBack()
  }

  const onShowHistoryHandler = async id => {
    let transaction = await data.filter(value => value.id === id)
    setBottomSheetData(...transaction)
    this.Scrollable.open()
  }

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    getHistory({
      body: 'null',
      token: userData.token,
    })
  }, [])

  //#endregion

  //#region NOTE: 3. Life Cycle

  useEffect(() => {
    getHistory({
      body: 'null',
      token: userData.token,
    })
  }, [, netInfo.isConnected])

  useEffect(() => {
    if (data) {
      // console.log('DATA', data)
      setIsRefreshing(false)
    }
  }, [, netInfo.isConnected])

  useEffect(() => {
    if (isLoading === false) {
      setIsRefreshing(false)
    }
  }, [isLoading])

  useEffect(() => {
    if (error) {
      console.log('error', error.originalStatus)
      setIsRefreshing(false)
    }
  }, [error])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={[
            Gutters.fifteenPWidth,
            Gutters.fiveTMargin,
            Gutters.tenHMargin,
          ]}
          onPress={onBackHandler}
        >
          <Image source={Images.LeftArrow} />
        </TouchableOpacity>
      ),
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

      headerTitleAlign: 'center',
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    })
  }, [navigation, theme])

  //#endregion

  //#region NOTE: 4. Render Method

  const loadingSpinner = (
    <Spinner
      visible={isLoading}
      textContent={'Loading...'}
      textStyle={{ color: '#FFF', alignItems: 'center' }}
    />
  )

  const bottomSheet = () => {
    const transaction_ID =
      bottomSheetData &&
      bottomSheetData.transaction_details &&
      bottomSheetData.transaction_details.split('&')[3].split('=')[1]
    return (
      <ScrollView>
        <View style={{ alignItems: 'center', borderBottomWidth: 1 }}>
          <Text
            style={[
              Fonts.fontSizeRegular,
              Common.primaryBlue,
              { marginBottom: 10 },
            ]}
          >
            Transaction Details
          </Text>
        </View>
        <View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text
              style={[
                Common.primaryBlue,
                Gutters.fiveLMargin,
                Fonts.fontWeightRegular,
                Fonts.fontSizeSmall,
                Fonts.fontFamilyPrimary,
                Gutters.tenVMargin,
              ]}
            >
              ID
            </Text>
            <Text
              style={[
                Common.primaryBlue,
                Gutters.fiveRMargin,
                Fonts.fontWeightRegular,
                Fonts.fontSizeSmall,
                Fonts.fontFamilyPrimary,
                Gutters.tenVMargin,
              ]}
            >
              {bottomSheetData.id}
            </Text>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text
              style={[
                Common.primaryBlue,
                Gutters.fiveLMargin,
                Fonts.fontWeightRegular,
                Fonts.fontSizeSmall,
                Fonts.fontFamilyPrimary,
                Gutters.tenVMargin,
              ]}
            >
              First Name
            </Text>
            <Text
              style={[
                Common.primaryBlue,
                Gutters.fiveRMargin,
                Fonts.fontWeightRegular,
                Fonts.fontSizeSmall,
                Fonts.fontFamilyPrimary,
                Gutters.tenVMargin,
              ]}
            >
              {bottomSheetData.first_name}
            </Text>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text
              style={[
                Common.primaryBlue,
                Gutters.fiveLMargin,
                Fonts.fontWeightRegular,
                Fonts.fontSizeSmall,
                Fonts.fontFamilyPrimary,
                Gutters.tenVMargin,
              ]}
            >
              Last Name
            </Text>
            <Text
              style={[
                Common.primaryBlue,
                Gutters.fiveRMargin,
                Fonts.fontWeightRegular,
                Fonts.fontSizeSmall,
                Fonts.fontFamilyPrimary,
                Gutters.tenVMargin,
              ]}
            >
              {bottomSheetData.last_name}
            </Text>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text
              style={[
                Common.primaryBlue,
                Gutters.fiveLMargin,
                Fonts.fontWeightRegular,
                Fonts.fontSizeSmall,
                Fonts.fontFamilyPrimary,
                Gutters.tenVMargin,
              ]}
            >
              Transaction Date
            </Text>
            <Text
              style={[
                Common.primaryBlue,
                Gutters.fiveRMargin,
                Fonts.fontWeightRegular,
                Fonts.fontSizeSmall,
                Fonts.fontFamilyPrimary,
                Gutters.tenVMargin,
              ]}
            >
              {String(bottomSheetData.created_at).slice(0, 10)}
            </Text>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text
              style={[
                Common.primaryBlue,
                Gutters.fiveLMargin,
                Fonts.fontWeightRegular,
                Fonts.fontSizeSmall,
                Fonts.fontFamilyPrimary,
                Gutters.tenVMargin,
              ]}
            >
              Transaction ID
            </Text>
            <Text
              style={[
                !transaction_ID && Common.errorColor,
                transaction_ID && Common.primaryBlue,
                Gutters.fiveRMargin,
                Fonts.fontWeightRegular,
                Fonts.fontSizeSmall,
                Fonts.fontFamilyPrimary,
                Gutters.tenVMargin,
              ]}
            >
              {transaction_ID ? transaction_ID : 'Transaction Failed'}
            </Text>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text
              style={[
                Common.primaryBlue,
                Gutters.fiveLMargin,
                Fonts.fontWeightRegular,
                Fonts.fontSizeSmall,
                Fonts.fontFamilyPrimary,
                Gutters.tenVMargin,
              ]}
            >
              Carrier Name
            </Text>
            <Text
              style={[
                Common.primaryBlue,
                Gutters.fiveRMargin,
                Fonts.fontWeightRegular,
                Fonts.fontSizeSmall,
                Fonts.fontFamilyPrimary,
                Gutters.tenVMargin,
              ]}
            >
              {bottomSheetData.carrier_name
                ? bottomSheetData.carrier_name
                : 'Not specify'}
            </Text>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text
              style={[
                Common.primaryBlue,
                Gutters.fiveLMargin,
                Fonts.fontWeightRegular,
                Fonts.fontSizeSmall,
                Fonts.fontFamilyPrimary,
                Gutters.tenVMargin,
              ]}
            >
              Price
            </Text>
            <Text
              style={[
                Common.primaryBlue,
                Gutters.fiveRMargin,
                Fonts.fontWeightRegular,
                Fonts.fontSizeSmall,
                Fonts.fontFamilyPrimary,
                Gutters.tenVMargin,
              ]}
            >
              {`$${bottomSheetData.price}`}
            </Text>
          </View>
        </View>
      </ScrollView>
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
        style={[
          Common.textColor,
          { fontStyle: 'italic', fontWeight: '600', textAlign: 'center' },
        ]}
      >
        {!netInfo.isConnected
          ? 'Please Check Your Internet Connection'
          : 'History Not Found'}
      </Text>
      <Text
        style={[
          Common.textColor,
          { fontStyle: 'italic', fontWeight: '600', textAlign: 'center' },
        ]}
      >
        Pull down to refresh
      </Text>
    </View>
  )

  const keyExtractor = (item, index) => {
    return item.id.toString()
  }

  const renderHistory = ({ item }) => {
    const transaction_ID = item.transaction_details

    const image =
      JSON.parse(item.response).order_response[0].qr_image && transaction_ID
        ? JSON.parse(item.response).order_response[0].qr_image
        : 'https://cdn-icons-png.flaticon.com/512/4441/4441973.png'
    return (
      <Pressable
        onPress={() => onShowHistoryHandler(item.id)}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={[
          Common.offWhiteSecondaryBorder,
          Layout.fill,
          Common.borderWidthOne,
          Common.borderRadius,
          Gutters.ninePadding,
          Gutters.sixVMargin,
        ]}
      >
        <View style={[Layout.row, { justifyContent: 'space-between' }]}>
          <View style={{ width: '80%', flexDirection: 'row' }}>
            <Image
              source={{ uri: image }}
              style={[
                Common.resizeModeContain,
                Gutters.fiftyHeight,
                Gutters.twentyPWidth,
                Gutters.fiveVMargin,
              ]}
            />

            <View
              style={[
                { flexDirection: 'column', justifyContent: 'center' },
                Gutters.fiveHMargin,
              ]}
            >
              <Text
                style={[
                  // { alignSelf: 'center' },
                  Common.primaryBlueMode,
                  Gutters.fiveRMargin,
                  Fonts.fontWeightRegular,
                  Fonts.fontSizeSmall,
                  Fonts.fontFamilyPrimary,
                ]}
              >
                {item.carrier_name ? item.carrier_name : 'Transaction Details'}
              </Text>
              <Text
                style={[
                  // { alignSelf: 'center' },
                  Common.primaryBlueMode,
                  Gutters.fiveRMargin,
                  Fonts.fontWeightRegular,
                  Fonts.fontSizeSmall,
                  Fonts.fontFamilyPrimary,
                ]}
              >
                {`$${item.price}`}
              </Text>
            </View>
          </View>
          <View style={{ justifyContent: 'center' }}>
            <AntIcon name="right" color={Common.normalText.color} size={15} />
          </View>
        </View>
      </Pressable>
    )
  }

  //#endregion

  return (
    <SafeAreaView style={[Common.backgroundPrimary, Layout.fill]}>
      {/* <TouchableOpacity
        style={[Gutters.fifteenPWidth, Gutters.fiveTMargin, Gutters.tenHMargin]}
        onPress={onBackHandler}
      >
        <Image source={Images.LeftArrow} />
      </TouchableOpacity> */}

      <View style={[Layout.fill]}>
        <View
          style={[
            Layout.flexTwo,
            Layout.justifyContentCenter,
            Gutters.twentyFourHMargin,
            Gutters.fiveVMargin,
          ]}
        >
          {loadingSpinner}
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
            data={data}
            renderItem={renderHistory}
            ListEmptyComponent={error && errorComponent}
            refreshing={isRefreshing} // Added pull to refresh state
            onRefresh={onRefresh}
          />
        </View>
        {/* <View
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
            title="Logout"
            loading={false}
            disabled={false}
            onPress={() => onLogoutHandler()}
            loadingProps={[{ size: 'small' }, Common.whiteColor]}
            titleStyle={[Fonts.fontWeightRegular, Fonts.fontFamilyPrimary]}
            buttonStyle={[
              Common.redBackground,
              Gutters.fiftyfiveHeight,
              Common.borderRadius,
            ]}
            containerStyle={[
              Gutters.ninetyfivePWidth,
              Gutters.twentyTMargin,
              Layout.selfCenter,
              Common.borderRadius,
            ]}
            icon={{
              name: 'logout',
              size: 15,
              color: 'white',
            }}
            iconContainerStyle={{ marginLeft: 10 }}
            iconRight
            disabledStyle={[Common.whiteColor, Common.greyBackground]}
            disabledTitleStyle={[Common.whiteColor, Gutters.zeroOsevenOpacity]}
          />
        </View> */}
        <RBSheet
          ref={ref => {
            this.Scrollable = ref
          }}
          height={430}
          closeOnDragDown
          customStyles={{
            container: {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            },
          }}
        >
          <ScrollView>
            <TouchableOpacity activeOpacity={1}>
              {bottomSheet()}
            </TouchableOpacity>
          </ScrollView>
        </RBSheet>
      </View>
    </SafeAreaView>
  )
}

export default Profile
