import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Text,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme } from '@/Hooks'
import { Button, Icon } from '@rneui/themed'
import AntIcon from 'react-native-vector-icons/AntDesign'
import { setUser } from '@/Store/User'
import History from '../Data/history'
import { useNetInfo } from '@react-native-community/netinfo'
import { useGetHistoryMutation } from '@/Services/api'
import BottomSheet from 'reanimated-bottom-sheet'

const Profile = ({ navigation, route }) => {
  //NOTE: 1. Define Variables
  //   const params = route.params
  const netInfo = useNetInfo()
  const theme = useSelector(state => state.theme)
  const userData = useSelector(state => state.user.userData)
  const dispatch = useDispatch()
  const { Common, Layout, Images, Gutters, Fonts } = useTheme()
  const sheetRef = React.useRef(null)
  const [GrayScreenNone, setGrayScreenNone] = React.useState('none')
  const [modalData, setModalData] = useState({
    id: '',
    image: '',
    title: '',
    price: '',
    date: '',
    Transaction_ID: '',
    Address: '',
    Currency: '',
    Coin: '',
    Rate: '',
    Inserted: '',
    Sent: '',
    Transaction_Hash: '',
  })
  const [getHistory, { data, isLoading, error }] = useGetHistoryMutation()

  //NOTE: 2. Helper Method

  const onLogoutHandler = async () => {
    dispatch(setUser({ userData: null, isAuth: false }))
  }

  const onBackHandler = () => {
    navigation.goBack()
  }

  const onShowHistoryHandler = async id => {
    let transaction = await History.filter(value => value.id === id)
    setModalData(...transaction)
    sheetRef.current.snapTo(2)
  }

  const [isRefreshing, setIsRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    getHistory({
      body: 'null',
      token: userData.token,
    })
  }, [])

  //NOTE: 3. Life Cycle

  useEffect(() => {
    getHistory({
      body: 'null',
      token: userData.token,
    })
  }, [, netInfo.isConnected])

  useEffect(() => {
    if (data) {
      console.log('DATA', data)
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
      headerLeft: () => null,
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

  //NOTE: 4. Render Method

  const renderBottomSheet = () => (
    <SafeAreaView>
      <View
        style={[
          {
            height: 500,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            borderWidth: 1,
          },
          Common.transactionModalBackgroundColor,
        ]}
      >
        <View style={{ alignItems: 'center', marginVertical: 5, flex: 1 }}>
          <Image
            source={Images.modalHandle}
            style={[Common.resizeModeCenter, Gutters.fiveTMargin]}
          />
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            borderTopColor: 'black',
            borderTopWidth: 0.5,
            flex: 1,
          }}
        >
          <Text
            style={[
              { marginVertical: 15, marginLeft: 20 },
              Common.transactionModalTextColor,
              Fonts.fontWeightRegular,
              Fonts.fontSizeSmall,
              Gutters.tenTMargin,
              Gutters.fiveHMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            Transaction Details
          </Text>
          <Text
            style={[
              { marginVertical: 15, marginRight: 20 },
              Common.darkGreyColor,
              Fonts.fontWeightRegular,
              Fonts.fontSizeSmall,
              // Gutters.tenTMargin,
              Gutters.fiveHMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            <Icon
              onPress={() => sheetRef.current.snapTo(0)}
              name="times"
              type="font-awesome-5"
              size={15}
              color={Common.transactionModalTextColor.color}
            />
          </Text>
        </View>
        <View
          style={[
            {
              justifyContent: 'space-between',
              flexDirection: 'row',
              borderTopColor: 'black',
              borderTopWidth: 0.5,
              alignItems: 'center',
              // height: 40,
              flex: 1,
            },
          ]}
        >
          <Text
            style={[
              Common.transactionModalTextColor,
              Fonts.fontWeightRegular,
              Fonts.fontSizeExtraSmall,
              Gutters.twentyHMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            Date
          </Text>
          <Text
            style={[
              Common.transactionModalTextColor,
              Fonts.fontWeightRegular,
              Fonts.fontSizeExtraSmall,
              Gutters.twentyHMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            {modalData.date}
          </Text>
        </View>
        <View
          style={[
            {
              justifyContent: 'space-between',
              flexDirection: 'row',
              borderTopColor: 'black',
              borderTopWidth: 0.5,
              alignItems: 'center',
              // height: 40,
              flex: 1,
            },
          ]}
        >
          <Text
            style={[
              Common.transactionModalTextColor,
              Fonts.fontWeightRegular,
              Fonts.fontSizeExtraSmall,
              Gutters.twentyHMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            Transaction_ID
          </Text>
          <Text
            style={[
              Common.transactionModalTextColor,
              Fonts.fontWeightRegular,
              Fonts.fontSizeExtraSmall,
              Gutters.twentyHMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            {modalData.Transaction_ID}
          </Text>
        </View>
        <View
          style={[
            {
              justifyContent: 'space-between',
              flexDirection: 'row',
              borderTopColor: 'black',
              borderTopWidth: 0.5,
              alignItems: 'center',
              // height: 40,
              flex: 1,
            },
          ]}
        >
          <Text
            style={[
              Common.transactionModalTextColor,
              Fonts.fontWeightRegular,
              Fonts.fontSizeExtraSmall,
              Gutters.twentyHMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            Address
          </Text>
          <Text
            style={[
              Common.transactionModalTextColor,
              Fonts.fontWeightRegular,
              Fonts.fontSizeExtraSmall,
              Gutters.twentyHMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            {modalData.Address}
          </Text>
        </View>
        <View
          style={[
            {
              justifyContent: 'space-between',
              flexDirection: 'row',
              borderTopColor: 'black',
              borderTopWidth: 0.5,
              alignItems: 'center',
              // height: 40,
              flex: 1,
            },
          ]}
        >
          <Text
            style={[
              Common.transactionModalTextColor,
              Fonts.fontWeightRegular,
              Fonts.fontSizeExtraSmall,
              Gutters.twentyHMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            Currency
          </Text>
          <Text
            style={[
              Common.transactionModalTextColor,
              Fonts.fontWeightRegular,
              Fonts.fontSizeExtraSmall,
              Gutters.twentyHMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            {modalData.Currency}
          </Text>
        </View>
        <View
          style={[
            {
              justifyContent: 'space-between',
              flexDirection: 'row',
              borderTopColor: 'black',
              borderTopWidth: 0.5,
              alignItems: 'center',
              // height: 40,
              flex: 1,
            },
          ]}
        >
          <Text
            style={[
              Common.transactionModalTextColor,
              Fonts.fontWeightRegular,
              Fonts.fontSizeExtraSmall,
              Gutters.twentyHMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            Coin
          </Text>
          <Text
            style={[
              Common.transactionModalTextColor,
              Fonts.fontWeightRegular,
              Fonts.fontSizeExtraSmall,
              Gutters.twentyHMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            {modalData.Coin}
          </Text>
        </View>
        <View
          style={[
            {
              justifyContent: 'space-between',
              flexDirection: 'row',
              borderTopColor: 'black',
              borderTopWidth: 0.5,
              alignItems: 'center',
              // height: 40,
              flex: 1,
            },
          ]}
        >
          <Text
            style={[
              Common.transactionModalTextColor,
              Fonts.fontWeightRegular,
              Fonts.fontSizeExtraSmall,
              Gutters.twentyHMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            Rate
          </Text>
          <Text
            style={[
              Common.transactionModalTextColor,
              Fonts.fontWeightRegular,
              Fonts.fontSizeExtraSmall,
              Gutters.twentyHMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            {modalData.Rate}
          </Text>
        </View>
        <View
          style={[
            {
              justifyContent: 'space-between',
              flexDirection: 'row',
              borderTopColor: 'black',
              borderTopWidth: 0.5,
              alignItems: 'center',
              // height: 40,
              flex: 1,
            },
          ]}
        >
          <Text
            style={[
              Common.transactionModalTextColor,
              Fonts.fontWeightRegular,
              Fonts.fontSizeExtraSmall,
              Gutters.twentyHMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            Inserted
          </Text>
          <Text
            style={[
              Common.transactionModalTextColor,
              Fonts.fontWeightRegular,
              Fonts.fontSizeExtraSmall,
              Gutters.twentyHMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            {modalData.Inserted}
          </Text>
        </View>
        <View
          style={[
            {
              justifyContent: 'space-between',
              flexDirection: 'row',
              borderTopColor: 'black',
              borderTopWidth: 0.5,
              alignItems: 'center',
              // height: 40,
              flex: 1,
            },
          ]}
        >
          <Text
            style={[
              Common.transactionModalTextColor,
              Fonts.fontWeightRegular,
              Fonts.fontSizeExtraSmall,
              Gutters.twentyHMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            Sent
          </Text>
          <Text
            style={[
              Common.transactionModalTextColor,
              Fonts.fontWeightRegular,
              Fonts.fontSizeExtraSmall,
              Gutters.twentyHMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            {modalData.Sent}
          </Text>
        </View>
        <View
          style={[
            {
              justifyContent: 'space-between',
              flexDirection: 'row',
              borderTopColor: 'black',
              borderTopWidth: 0.5,
              borderBottomColor: 'black',
              borderBottomWidth: 0.5,
              alignItems: 'center',
              // height: 40,
              flex: 1,
            },
          ]}
        >
          <Text
            style={[
              Common.transactionModalTextColor,
              Fonts.fontWeightRegular,
              Fonts.fontSizeExtraSmall,
              Gutters.twentyHMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            Transaction Hash
          </Text>
          <Text
            style={[
              Common.transactionModalTextColor,
              Fonts.fontWeightRegular,
              Fonts.fontSizeExtraSmall,
              Gutters.twentyHMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            {modalData.Transaction_Hash}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )

  const historyBottomSheet = (
    <>
      <BottomSheet
        onOpenStart={() => {
          setGrayScreenNone('flex')
        }}
        onCloseEnd={() => {
          setGrayScreenNone('none')
        }}
        ref={sheetRef}
        snapPoints={[0, 0, 500]}
        borderRadius={15}
        renderContent={renderBottomSheet}
      />
    </>
  )

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
          : 'History Not Found'}
      </Text>
    </View>
  )

  const keyExtractor = (item, index) => index.toString()

  const renderHistory = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onShowHistoryHandler(item.id)
        }}
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

  return (
    <SafeAreaView style={[Common.backgroundPrimary, Layout.fill]}>
      <TouchableOpacity
        style={[Gutters.fifteenPWidth, Gutters.fiveTMargin, Gutters.tenHMargin]}
        onPress={onBackHandler}
      >
        <Image source={Images.LeftArrow} />
      </TouchableOpacity>
      <View style={[Layout.fill]}>
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
            // data={data}
            renderItem={renderHistory}
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
        </View>
        {historyBottomSheet}
      </View>
    </SafeAreaView>
  )
}

export default Profile
