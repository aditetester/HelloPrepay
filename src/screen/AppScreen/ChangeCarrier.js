import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TouchableHighlight,
  ActivityIndicator,
  Alert,
  Image as RImage,
} from 'react-native'
import { useTheme } from '@/Hooks'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { SearchBar, Image, Button, Avatar } from '@rneui/themed'
import {
  useGetCarrierListQuery,
  useGetProfileUpdateMutation,
} from '@/Services/api'
import { useIsFocused } from '@react-navigation/native'
import { setUser } from '@/Store/User'
import { scale, verticalScale } from 'react-native-size-matters'

const ChangeCarrier = ({ navigation, route }) => {
  //NOTE: 1. Define Variables
  let params = route.params
  console.log(params)
  let focus = useIsFocused()
  const dispatch = useDispatch()
  const userData = useSelector(state => state.user.userData)
  const { Common, Images, Fonts, Gutters, Layout } = useTheme()
  const theme = useSelector(state => state.theme)
  const [selectedId, setSelectedId] = useState()
  const [carrier, setCarrier] = useState()
  const [searchable, setSearchable] = useState('')
  const [searchText, setSearchText] = useState('')

  //NOTE: 2. API
  const { data, isLoading, error, refetch, isFetching } =
    useGetCarrierListQuery(userData.token)
  const [
    getProfileUpdate,
    {
      data: profileUpdateData,
      isLoading: profileUpdateLoading,
      error: profileUpdateError,
    },
  ] = useGetProfileUpdateMutation()

  //NOTE: 3. Helper Method
  const onContinueHandler = () => {
    if (!selectedId) {
      return
    }
    getProfileUpdate({
      body: { carrier_id: selectedId },
      token: userData.token,
    })
  }

  const onSelectCarrier = id => {
    if (selectedId === id) {
      setSelectedId('')
      return
    }
    setSelectedId(id)
  }

  const onRefresh = useCallback(() => {
    refetch()
  }, [])

  const searchFunction = text => {
    const updatedData = data.data.filter(item => {
      const item_data = `${item.name.toUpperCase()}`
      const text_data = text.toUpperCase()
      return item_data.indexOf(text_data) > -1
    })
    setSearchable(updatedData)
    setSearchText(text)
  }

  const updateState = async () => {
    await dispatch(
      setUser({
        userData: profileUpdateData,
        isAuth: true,
        perpos: null,
      }),
    )
  }

  //NOTE: 4. Life Cycle

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: Common.backgroundPrimary.backgroundColor,
        height: verticalScale(50),
      },
      headerLeft: () => (
        <View>
          {params.navigateFrom !== 'Otp' ? (
            <TouchableOpacity
              style={[
                {
                  width: scale(45),
                  height: verticalScale(30),
                },
                Common.borderRadius,
                Layout.justifyContentCenter,
                Layout.center,
                Gutters.tenHMargin,
              ]}
              // onPress={() => navigation.navigate('Profile')}
              onPress={() => {
                if (params.navigateFrom === 'Home') {
                  navigation.navigate('Home')
                } else if (params.navigateFrom === 'Profile') {
                  navigation.navigate('Profile')
                }
              }}
            >
              <RImage
                source={Images.LeftArrow}
                resizeMode="cover"
                style={{ height: '80%', width: '80%' }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      ),
      headerTitle: () => (
        <RImage
          source={Images.Logo}
          style={[{ width: scale(90) }, Common.resizeModeContain]}
        />
      ),
      headerRight: () => null,
      headerTitleAlign: 'center',
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    })
  }, [navigation, theme, focus])

  useEffect(() => {
    if (data) {
      setCarrier(data.data)
    }
  }, [data])

  useEffect(() => {
    if (profileUpdateData && profileUpdateData.success === true) {
      updateState()
      navigation.navigate('Home', {
        first_name: userData.first_name,
        data: profileUpdateData,
      })
      setSelectedId('')
    } else if (profileUpdateData && profileUpdateData.success === false) {
      Alert.alert('', 'Something Went Wrong...')
      return
    }
  }, [profileUpdateData])

  useEffect(() => {
    if (searchText.length === 0) {
      setSearchable(carrier)
    }
  }, [searchText])

  //NOTE: 5. Render Method

  const renderItem = ({ item }) => (
    <Item id={item.id} image={item.image} color={item.color} />
  )

  const Item = ({ id, image }) => {
    return (
      <>
        <TouchableHighlight
          underlayColor={[Common.white.color]}
          style={[
            {
              alignSelf: 'center',
              height: verticalScale(116),
              width: scale(150),
            },
            Gutters.twentyPadding,
            Gutters.eightVMargin,
            // Gutters.oosHeight,
            // Gutters.fourtythreePWidth,
            Common.borderRadius,
            Common.offWhiteBorder,
            Common.whiteColorBackground,
            selectedId === id && Common.primaryPinkBorder,
            Gutters.eighteenLMargin,
            Common.whiteBackground,
          ]}
          onPress={() => onSelectCarrier(id)}
        >
          <Image
            source={{ uri: image }}
            style={[
              Layout.selfCenter,
              Gutters.ninetyPWidth,
              Layout.fill,
              Common.resizeModeContain,
            ]}
            containerStyle={[
              Layout.selfCenter,
              Gutters.ninetyPWidth,
              Layout.fill,
              Common.whiteColorBackground,
            ]}
            placeholderStyle={{ backgroundColor: 'white' }}
            PlaceholderContent={
              <ActivityIndicator
                size="small"
                color={Common.loadingColor.color}
              />
            }
          />
        </TouchableHighlight>
      </>
    )
  }

  return (
    <View style={[Common.backgroundPrimary, Layout.fill, Layout.center]}>
      <View style={[Layout.alignItemsCenter, Gutters.tenVMargin]}>
        <Text
          style={[
            Common.titleText,
            Fonts.fontWeightRegular,
            Fonts.fontSizeSmall,
            Fonts.fontFamilyPrimary,
          ]}
        >
          Select your carrier
        </Text>
      </View>
      <View style={Layout.alignItemsCenter}>
        <Text
          style={[
            Common.innerText,
            Fonts.fontWeightSmall,
            Fonts.fontSize12,
            Fonts.fontFamilyPrimary,
          ]}
        >
          Start by selecting your carrier below.
        </Text>
      </View>

      <SearchBar
        round
        value={searchText}
        onChangeText={text => searchFunction(text)}
        autoCorrect={false}
        placeholder="Search by name..."
        inputStyle={{
          // color: theme.darkMode ? Common.black : '#B6C2CE',
          fontSize: Fonts.fontSizeSmall.fontSize,
          fontWeight: Fonts.fontWeightSmall.fontWeight,
          backgroundColor: Common.searchBarBackgRoundColor,
          borderRadius: Common.borderRadius.borderRadius,
        }}
        searchIcon={{
          size: verticalScale(20),
        }}
        clearIcon={{
          size: verticalScale(20),
        }}
        inputContainerStyle={[
          {
            height: verticalScale(40),
            width: '95%',
            backgroundColor: Common.offWhiteBackground.backgroundColor,
            borderRadius: Common.borderRadius.borderRadius,
          },
          Fonts.fontFamilyPrimary,
        ]}
        containerStyle={{
          backgroundColor: Common.offWhiteBackground.backgroundColor,
          borderRadius: Common.borderRadius.borderRadius,
          margin: 15,
        }}
        lightTheme={theme.darkMode ? false : true}
      />
      {isLoading ? (
        <ActivityIndicator
          size="small"
          style={{ flex: 10 }}
          color={Common.loadingColor.color}
        />
      ) : (
        <View style={{ flex: 10, width: '100%' }}>
          <FlatList
            data={searchable ? searchable : data.data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={2}
            refreshing={isLoading} // Added pull to refresh state
            onRefresh={onRefresh}
          />
        </View>
      )}
      <View
        style={[
          Layout.center,
          Gutters.ninetyPWidth,
          Gutters.twelvePHeight,
          Gutters.tenVMargin,
          Layout.selfCenter,
        ]}
      >
        <Button
          title="Continue"
          loading={profileUpdateLoading}
          onPress={() => {
            onContinueHandler(userData)
          }}
          loadingProps={[{ size: 'small' }, Common.whiteColor]}
          titleStyle={[
            Fonts.fontWeightRegular,
            Fonts.fontSize12,
            Fonts.fontFamilyPrimary,
          ]}
          buttonStyle={[
            { height: verticalScale(60) },
            Common.primaryPinkBackground,
            // Gutters.fiftyfiveHeight,
            // Gutters.sixtyHeight,
            Common.borderRadius,
          ]}
          containerStyle={[
            Gutters.hundredPWidth,
            Layout.selfCenter,
            Common.borderRadius,
          ]}
          disabled={!selectedId}
          disabledStyle={[Common.whiteColor, Common.greyBackground]}
          disabledTitleStyle={[Common.whiteColor, Gutters.zeroOsevenOpacity]}
        />
      </View>
    </View>
  )
}

export default ChangeCarrier
