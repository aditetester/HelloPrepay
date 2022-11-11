import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  RefreshControl,
  ScrollView,
} from 'react-native'
import { useTheme } from '@/Hooks'
import { Button, Icon, Skeleton } from '@rneui/themed'
import History from '../screen/Data/history'
import AntIcon from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native'
import { useNetInfo } from '@react-native-community/netinfo'
import { useGetHistoryMutation } from '@/Services/api'
import RBSheet from 'react-native-raw-bottom-sheet'
import { useSelector } from 'react-redux'

const UserHistory = ({ phone_number, formattedNumber, show }) => {
  //NOTE: 1.Define Variables
  const navigation = useNavigation()
  const netInfo = useNetInfo()
  const userData = useSelector(state => state.user.userData)
  const valid = phone_number.length === 10 && formattedNumber.length === 14
  const [fetching, setFetching] = useState(false)
  const [GrayScreenNone, setGrayScreenNone] = React.useState('none')
  const [bottomSheetData, setBottomSheetData] = useState('')
  const { Common, Gutters, Layout, Fonts, Images } = useTheme()
  const [getHistory, { data, isLoading, error }] = useGetHistoryMutation()
  const sheetRef = React.useRef(null)

  //NOTE: 2.Helper Method

  const onNewRefillHandler = () => {
    navigation.navigate('Selectplan', {
      phone_number: phone_number,
      formattedNumber: formattedNumber,
    })
  }

  const onShowHistoryHandler = async id => {
    let transaction = await data.filter(value => value.id === id)
    setBottomSheetData(...transaction)
    console.log('transaction', transaction)
    this.Scrollable.open()
  }

  const [isRefreshing, setIsRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    getHistory({
      body: 'null',
      token: userData.token,
    })
  }, [])

  //NOTE: 3.Life Cycle

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
    if (error) {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    if (isLoading) {
      setFetching(true)
    } else {
      setFetching(false)
      setIsRefreshing(false)
    }
  }, [isLoading])

  //NOTE: 4.Render Method

  const bottomSheet = () => (
    <ScrollView>
      <View style={{ alignItems: 'center' }}>
        <Text style={[Fonts.fontSizeRegular]}>Transaction Details</Text>
      </View>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text
            style={[
              Common.primaryBlueMode,
              Gutters.fiveLMargin,
              Fonts.fontWeightRegular,
              Fonts.fontSizeMedium,
              Fonts.fontFamilyPrimary,
              Gutters.tenVMargin,
            ]}
          >
            First Name
          </Text>
          <Text
            style={[
              Common.primaryBlueMode,
              Gutters.fiveRMargin,
              Fonts.fontWeightRegular,
              Fonts.fontSizeMedium,
              Fonts.fontFamilyPrimary,
              Gutters.tenVMargin,
            ]}
          >
            {/* {bottomSheetData.first_name} */}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text
            style={[
              Common.primaryBlueMode,
              Gutters.fiveLMargin,
              Fonts.fontWeightRegular,
              Fonts.fontSizeMedium,
              Fonts.fontFamilyPrimary,
              Gutters.tenVMargin,
            ]}
          >
            Last Name
          </Text>
          <Text
            style={[
              Common.primaryBlueMode,
              Gutters.fiveRMargin,
              Fonts.fontWeightRegular,
              Fonts.fontSizeMedium,
              Fonts.fontFamilyPrimary,
              Gutters.tenVMargin,
            ]}
          >
            {/* {bottomSheetData.last_name} */}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text
            style={[
              Common.primaryBlueMode,
              Gutters.fiveLMargin,
              Fonts.fontWeightRegular,
              Fonts.fontSizeMedium,
              Fonts.fontFamilyPrimary,
              Gutters.tenVMargin,
            ]}
          >
            Transaction Date
          </Text>
          <Text
            style={[
              Common.primaryBlueMode,
              Gutters.fiveRMargin,
              Fonts.fontWeightRegular,
              Fonts.fontSizeMedium,
              Fonts.fontFamilyPrimary,
              Gutters.tenVMargin,
            ]}
          >
            {/* {String(bottomSheetData.created_at).slice(0, 10)} */}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text
            style={[
              Common.primaryBlueMode,
              Gutters.fiveLMargin,
              Fonts.fontWeightRegular,
              Fonts.fontSizeMedium,
              Fonts.fontFamilyPrimary,
              Gutters.tenVMargin,
            ]}
          >
            Carrier Name
          </Text>
          <Text
            style={[
              Common.primaryBlueMode,
              Gutters.fiveRMargin,
              Fonts.fontWeightRegular,
              Fonts.fontSizeMedium,
              Fonts.fontFamilyPrimary,
              Gutters.tenVMargin,
            ]}
          >
            {/* {bottomSheetData.carrier_name
              ? bottomSheetData.carrier_name
              : 'Not specify'} */}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text
            style={[
              Common.primaryBlueMode,
              Gutters.fiveLMargin,
              Fonts.fontWeightRegular,
              Fonts.fontSizeMedium,
              Fonts.fontFamilyPrimary,
              Gutters.tenVMargin,
            ]}
          >
            Price
          </Text>
          <Text
            style={[
              Common.primaryBlueMode,
              Gutters.fiveRMargin,
              Fonts.fontWeightRegular,
              Fonts.fontSizeMedium,
              Fonts.fontFamilyPrimary,
              Gutters.tenVMargin,
            ]}
          >
            {/* {`$${bottomSheetData.price}`} */}
          </Text>
        </View>
      </View>
    </ScrollView>
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
          : 'Data Not Found'}
      </Text>
    </View>
  )

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

  const historyComponent = (
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
          ListEmptyComponent={error && errorComponent}
          refreshControl={
            <RefreshControl
              colors={['#9Bd35A', '#689F38']}
              refreshing={isRefreshing} // Added pull to refesh state
              onRefresh={onRefresh}
            />
          }
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
          disabledTitleStyle={[Common.whiteColor, Gutters.zeroOsevenOpacity]}
        />
      </View>
      {/* {historyBottomSheet} */}
      <View>
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
    </>
  )

  return <>{fetching ? loading : historyComponent}</>
}

export default UserHistory
