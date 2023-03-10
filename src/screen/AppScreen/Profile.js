import React, { useEffect, useState, useRef } from 'react'
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
import { Icon, CheckBox, Avatar } from '@rneui/themed'
import RBSheet from 'react-native-raw-bottom-sheet'
import { changeTheme } from '@/Store/Theme'
import { useChangeUserAccountStatusMutation } from '@/Services/api'
import { scale, verticalScale } from 'react-native-size-matters'
import auth, { firebase } from '@react-native-firebase/auth'

const Profile = ({ navigation }) => {
  //############################################################
  //NOTE: DEFINE VARIABLE
  //############################################################
  const { Common, Layout, Fonts, Gutters, Images } = useTheme()
  const dispatch = useDispatch()
  const refRBSheet = useRef()
  const theme = useSelector(state => state.theme)
  const userData = useSelector(state => state.user.userData)

  const [lightTheme, setLightTheme] = useState(false)
  const [darkTheme, setDarkTheme] = useState(false)

  const [
    changeStatus,
    {
      data: changeStatusData,
      isLoading: changeStatusIsLoading,
      error: changeStatusError,
    },
  ] = useChangeUserAccountStatusMutation()

  //############################################################
  //NOTE: HELPER METHOD
  //############################################################

  const finalDeleteUserAccount = () => {
    const user = firebase.auth().currentUser
    if (user) {
      firebase
        .auth()
        .currentUser.delete()
        .then(res =>
          changeStatus({
            body: { phone_number: userData.phone_number, status: 0 },
            token: userData.token,
          }),
        )
        .catch(e => {
          auth()
            .signOut()
            .then(() => console.log('User signed out!'))
          console.log(e)
        })
    } else {
      // Alert.alert('Opps!', 'Something went wrong.....')
      changeStatus({
        body: { phone_number: userData.phone_number, status: 0 },
        token: userData.token,
      })
    }
  }

  const deleteAccount = () => {
    Alert.alert('Are you sure!!', 'You want delete your account?', [
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          finalDeleteUserAccount()
        },
      },
      { text: 'Cancel', style: 'default' },
    ])
  }

  const onChangeTheme = () => {
    try {
      refRBSheet.current.open()
    } catch (error) {
      console.log(error)
    }
  }

  const onBackHandler = () => {
    navigation.goBack()
  }

  const onLogoutHandler = () => {
    Alert.alert('Are you sure!!', 'You want to logout?', [
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          auth()
            .signOut()
            .then(() => console.log('User signed out!'))
          dispatch(
            setUser({ userData: null, isAuth: false, startupScreen: 'Login' }),
          )
        },
      },
      { text: 'Cancel', style: 'default' },
    ])
  }

  //############################################################
  //NOTE: LIFE CYCLE METHOD
  //############################################################

  useEffect(() => {
    try {
      const user = firebase.auth().currentUser
      console.log('User UID: ', user.uid)
    } catch (r) {
      console.log(r)
    }
  }, [])

  useEffect(() => {
    if (changeStatusData) {
      if (changeStatusData.success === 1) {
        dispatch(setUser({ userData: null, isAuth: false }))
      } else {
        Alert.alert('Opps!!', 'Something went wrong...')
      }
    }
  }, [changeStatusData])

  useEffect(() => {
    if (changeStatusError) {
      Alert.alert('Opps!!', 'Something went wrong...')
    }
  }, [changeStatusError])

  useEffect(() => {
    if (changeStatusIsLoading) {
      // console.log(changeStatusIsLoading)
    }
  }, [changeStatusIsLoading])

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
            // Gutters.fifteenPWidth,
            Gutters.fiveTMargin,
            Gutters.tenHMargin,
          ]}
          onPress={() => navigation.navigate('Home')}
        >
          <Image
            source={Images.LeftArrow}
            style={{ height: verticalScale(20), width: scale(30) }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: Common.backgroundPrimary.backgroundColor,
        height: verticalScale(50),
      },
      headerTitle: () => (
        <Image
          source={Images.Logo}
          style={[{ width: scale(100) }, Common.resizeModeContain]}
        />
      ),
      headerTitleAlign: 'center',
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    })
  }, [navigation, theme.darkMode])

  //############################################################
  //NOTE: RENDER METHOD
  //############################################################

  const themeChangeBottomSheet = () => {
    return (
      <View style={[Common.backgroundPrimary]}>
        <CheckBox
          title={'Dark theme'}
          textStyle={[darkTheme && Common.white, !darkTheme && Common.black]}
          containerStyle={[
            darkTheme && Common.primaryPinkBackground,
            Common.borderRadiusTen,
            Common.offWhiteBorder,
          ]}
          checkedIcon={
            <Icon
              name="check-circle"
              type="font-awesome-5"
              size={scale(20)}
              color={darkTheme ? 'white' : 'white'}
            />
          }
          uncheckedIcon={
            <Icon
              name="circle"
              type="font-awesome-5"
              size={scale(20)}
              color={!darkTheme ? 'grey' : '#DB006A'}
            />
          }
          checked={darkTheme}
          onPress={() => {
            setDarkTheme(true)
            setLightTheme(false)
            refRBSheet.current.close()
          }}
        />
        <CheckBox
          title={'Light theme'}
          textStyle={[lightTheme && Common.white, !lightTheme && Common.black]}
          containerStyle={[
            lightTheme && Common.primaryPinkBackground,
            Common.borderRadiusTen,
            Common.offWhiteBorder,
          ]}
          checkedIcon={
            <Icon
              name="check-circle"
              type="font-awesome-5"
              size={scale(20)}
              color={lightTheme ? 'white' : 'white'}
            />
          }
          uncheckedIcon={
            <Icon
              name="circle"
              type="font-awesome-5"
              size={scale(20)}
              color={!lightTheme ? 'grey' : '#DB006A'}
            />
          }
          checked={lightTheme}
          onPress={() => {
            setLightTheme(true)
            setDarkTheme(false)
            refRBSheet.current.close()
          }}
        />
      </View>
    )
  }

  const bottomSheetConfig = (
    <RBSheet
      ref={refRBSheet}
      height={verticalScale(160)}
      closeOnDragDown
      customStyles={{
        container: [
          { borderTopLeftRadius: 10, borderTopRightRadius: 10 },
          Common.backgroundPrimary,
          Common.offWhiteBorderWithoutBottom,
        ],
      }}
    >
      <ScrollView style={[Common.backgroundPrimary]}>
        <TouchableOpacity activeOpacity={1}>
          {themeChangeBottomSheet()}
        </TouchableOpacity>
      </ScrollView>
    </RBSheet>
  )

  return (
    <SafeAreaView style={[Common.backgroundPrimary, Layout.fill]}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          flexDirection: 'row',
          marginHorizontal: scale(24),
          borderColor: 'rgba(158, 150, 150, .5)',
          borderWidth: 1,
          borderRadius: 10,
          marginTop: scale(15),
        }}
      >
        <View>
          <Avatar
            size={verticalScale(60)}
            rounded
            title={userData.first_name.charAt(0)}
            containerStyle={[
              Gutters.twentyRMargin,
              Gutters.tenLMargin,
              Common.primaryPinkBackground,
            ]}
          >
            <Avatar.Accessory size={verticalScale(20)} />
          </Avatar>
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
          marginHorizontal: scale(20),
          marginTop: verticalScale(5),
        }}
      >
        <ScrollView style={{}}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('OrderHistory', { navigateFrom: 'Profile' })
            }
            style={{
              flexDirection: 'row',
              borderWidth: scale(1),
              borderColor: 'rgba(158, 150, 150, .5)',
              padding: scale(15),
              margin: scale(5),
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Icon
              size={scale(24)}
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
            onPress={() =>
              navigation.navigate('ChangeCarrier', { navigateFrom: 'Profile' })
            }
            style={{
              flexDirection: 'row',
              borderWidth: scale(1),
              borderColor: 'rgba(158, 150, 150, .5)',
              padding: scale(15),
              margin: scale(5),
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Icon
              size={scale(24)}
              name={'undo'}
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
              Change Carrier
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onChangeTheme()}
            style={{
              flexDirection: 'row',
              borderWidth: scale(1),
              borderColor: 'rgba(158, 150, 150, .5)',
              padding: scale(15),
              margin: scale(5),
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Icon
              // onPress={() => setDialog(true)}
              size={scale(24)}
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
              borderWidth: scale(1),
              borderColor: 'rgba(158, 150, 150, .5)',
              padding: scale(15),
              margin: scale(5),
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Icon
              // onPress={() => setDialog(true)}
              size={scale(24)}
              name={'sign-out-alt'}
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
              Logout
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={deleteAccount}
            style={{
              flexDirection: 'row',
              borderWidth: scale(1),
              borderColor: 'rgba(158, 150, 150, .5)',
              padding: scale(15),
              margin: scale(5),
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Icon
              // onPress={() => setDialog(true)}
              size={scale(24)}
              name={'user-times'}
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
              Delete Account
            </Text>
          </TouchableOpacity>
          {bottomSheetConfig}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Profile
