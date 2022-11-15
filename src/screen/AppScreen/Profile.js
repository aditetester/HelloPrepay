import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Pressable,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native'
import { useTheme } from '@/Hooks'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/Store/User'
import { Icon, CheckBox } from '@rneui/themed'
import RBSheet from 'react-native-raw-bottom-sheet'
import { changeTheme } from '@/Store/Theme'

const Profile = ({ navigation }) => {
  //#region NOTE: Define Variable
  const { Common, Layout, Fonts, Gutters, Images } = useTheme()
  const dispatch = useDispatch()
  const theme = useSelector(state => state.theme)
  const userData = useSelector(state => state.user.userData)

  const [lightTheme, setLightTheme] = useState(false)
  const [darkTheme, setDarkTheme] = useState(false)

  console.log(theme.darkMode)

  //#endregion

  //#region NOTE: Helper Method

  const onChangeTheme = () => {
    this.Scrollable.open()
  }

  const onBackHandler = () => {
    navigation.goBack()
  }

  const onLogoutHandler = () => {
    Alert.alert('Are you sure!!', 'You want to logout?', [
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => dispatch(setUser({ userData: null, isAuth: false })),
      },
      { text: 'Cancel', style: 'default' },
    ])
  }

  //#endregion

  //#region NOTE: Life Cycle

  useEffect(() => {
    if (theme.darkMode) {
      setDarkTheme(true)
      setLightTheme(false)
    } else {
      setLightTheme(true)
      setDarkTheme(false)
    }
  }, [theme.darkMode])

  useEffect(() => {
    if (darkTheme) {
      dispatch(changeTheme({ darkMode: true }))
    } else if (lightTheme) {
      dispatch(changeTheme({ darkMode: false }))
    }
  }, [darkTheme, lightTheme])

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
  }, [navigation, theme.darkMode])

  //#endregion

  //#region NOTE: Render Method

  const bottomSheet = () => {
    return (
      <View>
        <CheckBox
          title={'DARK'}
          textStyle={[darkTheme && Common.white, !darkTheme && Common.black]}
          containerStyle={[
            darkTheme && Common.primaryPinkBackground,
            Common.borderRadiusTen,
            Common.borderWidthFour,
          ]}
          checkedIcon={
            <Icon
              name="check-circle"
              type="font-awesome-5"
              size={20}
              color={darkTheme ? 'white' : 'white'}
            />
          }
          uncheckedIcon={
            <Icon
              name="circle"
              type="font-awesome-5"
              size={20}
              color={!darkTheme ? 'grey' : '#DB006A'}
            />
          }
          checked={darkTheme}
          onPress={() => {
            setDarkTheme(true)
            setLightTheme(false)
            this.Scrollable.close()
          }}
        />
        <CheckBox
          title={'Light'}
          textStyle={[lightTheme && Common.white, !lightTheme && Common.black]}
          containerStyle={[
            lightTheme && Common.primaryPinkBackground,
            Common.borderRadiusTen,
            Common.borderWidthFour,
          ]}
          checkedIcon={
            <Icon
              name="check-circle"
              type="font-awesome-5"
              size={20}
              color={lightTheme ? 'white' : 'white'}
            />
          }
          uncheckedIcon={
            <Icon
              name="circle"
              type="font-awesome-5"
              size={20}
              color={!lightTheme ? 'grey' : '#DB006A'}
            />
          }
          checked={lightTheme}
          onPress={() => {
            setLightTheme(true)
            setDarkTheme(false)
            this.Scrollable.close()
          }}
        />
      </View>
    )
  }

  const bottomSheetConfig = (
    <RBSheet
      ref={ref => {
        this.Scrollable = ref
      }}
      height={200}
      closeOnDragDown
      customStyles={{
        container: [{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }],
      }}
    >
      <ScrollView>
        <TouchableOpacity activeOpacity={1}>{bottomSheet()}</TouchableOpacity>
      </ScrollView>
    </RBSheet>
  )

  //#endregion

  return (
    <SafeAreaView style={[Common.backgroundPrimary, Layout.fill]}>
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
          onPress={onChangeTheme}
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
            name={'moon'}
            type="font-awesome-5"
            color="#DB006A"
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
            Change Theme
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
        {bottomSheetConfig}
      </View>
    </SafeAreaView>
  )
}

export default Profile
