import React, { useEffect } from 'react'
import {
  View,
  Text,
  Pressable,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native'
import { useTheme } from '@/Hooks'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/Store/User'
import { Avatar, Icon } from '@rneui/themed'
const Profile = ({ navigation }) => {
  //#region NOTE: Define Variable
  const { Common, Layout, Fonts, Gutters, Images } = useTheme()
  const theme = useSelector(state => state.theme)
  const userData = useSelector(state => state.user.userData)
  const dispatch = useDispatch()
  //#endregion

  //#region NOTE: Helper Method

  const onBackHandler = () => {
    navigation.goBack()
  }

  const onLogoutHandler = () => {
    Alert.alert('Are you sure!!', 'You want to logout?', [
      {
        text: 'Yes',
        style: 'default',
        onPress: () => dispatch(setUser({ userData: null, isAuth: false })),
      },
      { text: 'No', style: 'destructive' },
    ])
  }

  //#endregion

  //#region NOTE: Life Cycle
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

  return (
    <SafeAreaView style={[Common.backgroundPrimary, Layout.fill]}>
      {/* <TouchableOpacity
        style={[Gutters.fifteenPWidth, Gutters.fiveTMargin, Gutters.tenHMargin]}
        onPress={onBackHandler}
      >
        <Image source={Images.LeftArrow} />
      </TouchableOpacity> */}

      {/* User Card Info */}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          flexDirection: 'row',
          marginHorizontal: 24,
          borderColor: 'rgba(158, 150, 150, .5)',
          borderWidth: 1,
          borderRadius: 10,
          marginTop: 15,
        }}
      >
        <View>
          <Image
            source={Images.avatar}
            style={{
              height: '80%',
              marginLeft: -15,
              marginRight: -5,
            }}
            resizeMode="contain"
          />
        </View>
        <View style={{ flexDirection: 'column' }}>
          <Text
            style={[
              Fonts.fontSizeExtraSmall,
              Fonts.fontWeightSmall,
              Common.primaryBlueMode,
              Fonts.fontFamilyPrimary,
            ]}
          >
            {userData.first_name} {userData.last_name}
          </Text>
          <Text
            style={[
              Fonts.fontSizeExtraSmall,
              Fonts.fontWeightSmall,
              Common.primaryBlueMode,
              Fonts.fontFamilyPrimary,
            ]}
          >
            {userData.email}
          </Text>
          <Text
            style={[
              Fonts.fontSizeExtraSmall,
              Fonts.fontWeightSmall,
              Common.primaryBlueMode,
              Fonts.fontFamilyPrimary,
            ]}
          >{`+1 ${userData.phone_number}`}</Text>
        </View>
      </View>

      {/* Display Information */}
      <View
        style={{
          flex: 6,
          marginHorizontal: 20,
          marginTop: 5,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('OrderHistory')}
          style={{
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: 'rgba(158, 150, 150, .5)',
            padding: 15,
            margin: 5,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <Icon
            size={24}
            name={'history'}
            type="font-awesome-5"
            color={Common.primaryPink.color}
          />
          <Text
            style={[
              Fonts.fontSizeMedium,
              Fonts.fontWeightSmall,
              Common.primaryBlueMode,
              Gutters.tenLMargin,
              Fonts.fontFamilyPrimary,
              Gutters.fifteenLMargin,
            ]}
          >
            Order History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onLogoutHandler}
          style={{
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: 'rgba(158, 150, 150, .5)',
            padding: 15,
            margin: 5,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <Icon
            // onPress={() => setDialog(true)}
            name={'sign-out-alt'}
            type="font-awesome-5"
            color="red"
          />
          <Text
            style={[
              Fonts.fontSizeMedium,
              Fonts.fontWeightSmall,
              Common.primaryBlueMode,
              Gutters.tenLMargin,
              Fonts.fontFamilyPrimary,
              Gutters.fifteenLMargin,
            ]}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Profile
