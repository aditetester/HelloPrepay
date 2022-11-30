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
import moment from 'moment'

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

  // console.log(data && data.order)
  // __DEV__ && console.log(data && data.payment)

  // const onLogoutHandler = async () => {
  //   dispatch(setUser({ userData: null, isAuth: false }))
  // }

  const onBackHandler = () => {
    navigation.goBack()
  }

  const onShowHistoryHandler = async id => {
    let transaction = await data.order.filter(value => value.id === id)
    setBottomSheetData(...transaction)
    this.Scrollable.open()
  }

  console.log(setBottomSheetData)

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
    const transactionStatus =
      bottomSheetData.payment_status === 'success'
        ? 'Transaction Success'
        : 'Transaction Failed'
    const totalAmount = bottomSheetData.total_amt
      ? `$${bottomSheetData.total_amt}`
      : '...'
    return (
      <ScrollView style={{ marginHorizontal: 10 }}>
        <View
          style={{
            alignItems: 'center',
            borderBottomWidth: 1,
          }}
        >
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
              Transaction Status
            </Text>
            <Text
              style={[
                bottomSheetData.payment_status === 'fail' && Common.errorColor,
                bottomSheetData.payment_status === 'success' &&
                  Common.primaryBlue,
                Gutters.fiveRMargin,
                Fonts.fontWeightRegular,
                Fonts.fontSizeSmall,
                Fonts.fontFamilyPrimary,
                Gutters.tenVMargin,
              ]}
            >
              {transactionStatus}
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
              {totalAmount}
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
          : `You don't have any history`}
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
    let date = moment(item.created_at).format('lll')
    const image =
      item.payment_status === 'success' ? Images.success : Images.fail

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
              source={image}
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
                  Common.primaryBlueMode,
                  Gutters.fiveLMargin,
                  Fonts.fontWeightRegular,
                  Fonts.fontSizeSmall,
                  Fonts.fontFamilyPrimary,
                ]}
              >
                {item.carrier_name}
                {item.total_amt ? `   $${item.total_amt}` : 'Error'}
              </Text>
              <Text
                style={[
                  Common.primaryBlueMode,
                  Gutters.fiveLMargin,
                  Fonts.fontWeightRegular,
                  Fonts.fontSizeSmall,
                  Fonts.fontFamilyPrimary,
                ]}
              >
                {date}
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
            data={data && data.order}
            renderItem={renderHistory}
            ListEmptyComponent={
              error || (data && data.order.length === 0 && errorComponent)
            }
            refreshing={isRefreshing} // Added pull to refresh state
            onRefresh={onRefresh}
          />
        </View>
        <RBSheet
          ref={ref => {
            this.Scrollable = ref
          }}
          height={400}
          closeOnDragDown
          customStyles={{
            container: { borderTopLeftRadius: 10, borderTopRightRadius: 10 },
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
