import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TouchableHighlight,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { useTheme } from '@/Hooks'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { SearchBar, Image, Button } from '@rneui/themed'
import {
  useGetCarrierListQuery,
  useGetProfileUpdateMutation,
} from '@/Services/api'
import { Avatar } from '@rneui/themed'
import { useIsFocused } from '@react-navigation/native'
import { setUser } from '@/Store/User'

const ChangeCarrier = ({ navigation, route }) => {
  //NOTE: 1. Define Variables
  let focus = useIsFocused()
  const dispatch = useDispatch()
  const userData = useSelector(state => state.user.userData)
  const { Common, Images, Fonts, Gutters, Layout } = useTheme()
  const theme = useSelector(state => state.theme)
  const [selectedId, setSelectedId] = useState()
  const [carrier, setCarrier] = useState()
  const [searchable, setSearchable] = useState(carrier)
  const [searchText, setSearchText] = useState('')

  //NOTE: 2. API
  const { data, isLoading, error } = useGetCarrierListQuery(userData.token)
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

  const onBackHandler = () => {
    navigation.goBack()
  }

  const onProfileHandler = () => {
    navigation.navigate('Profile')
  }

  const onSelectCarrier = id => {
    if (selectedId === id) {
      setSelectedId('')
      return
    }
    setSelectedId(id)
  }

  const searchFunction = text => {
    const updatedData = data.data.filter(item => {
      const item_data = `${item.name.toUpperCase()}`
      const text_data = text.toUpperCase()
      return item_data.indexOf(text_data) > -1
    })
    console.log(updatedData)
    setSearchable(updatedData)
    setSearchText(text)
  }

  const updateState = () => {
    dispatch(
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
      headerRight: () => (
        <Avatar
          size={64}
          rounded
          onPress={onProfileHandler}
          source={Images.avatar}
          containerStyle={[
            Gutters.twentyRMargin,
            Gutters.fortyHeight,
            Gutters.fortyWidth,
            Common.greyColor,
          ]}
        />
      ),
      headerTitleAlign: 'left',
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    })
  }, [navigation, theme, focus])

  useEffect(() => {
    if (data) {
      setCarrier(data.data)
      setSearchable(data.data)
    }
  }, [data])

  // useEffect(() => {
  //   if (data && data.result) {
  //     console.log('setCarrier', data.data[0])
  //     setCarrier(data.result)
  //     setSearchable(data.result)
  //   }
  // }, [data])

  useEffect(() => {
    if (profileUpdateData && profileUpdateData.success === true) {
      updateState()
      navigation.navigate('Home', {
        first_name: userData.first_name,
        data: profileUpdateData,
      })
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

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    })
  }, [navigation])

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
            Gutters.twentyPadding,
            Gutters.eightVMargin,
            Gutters.oosHeight,
            Gutters.fourtythreePWidth,
            Common.borderRadius,
            Common.offWhiteBorder,
            // selectedId !== id && Common.whiteColorBackground,
            Common.whiteColorBackground,
            // selectedId === id && Common.primaryPinkBackground,
            selectedId === id && Common.primaryPinkBorder,
            Gutters.eighteenLMargin,
            Common.whiteBackground,
          ]}
          onPress={() => onSelectCarrier(id)}
        >
          {/* <Image
            source={{ uri: image }}
            style={[
              Layout.selfCenter,
              Gutters.ninetyPWidth,
              Layout.fill,
              Common.resizeModeContain,
            ]}
          /> */}
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
              // Common.resizeModeContain,
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
    <View style={[Common.backgroundPrimary, Layout.fill]}>
      <TouchableOpacity
        style={[
          Common.borderRadius,
          Layout.justifyContentCenter,
          Layout.center,
          Gutters.sixtyWidth,
          Gutters.thirtyHeight,
          Gutters.tenHMargin,
        ]}
        onPress={onBackHandler}
      >
        <Image source={Images.LeftArrow} />
      </TouchableOpacity>
      <View style={[Layout.alignItemsCenter, Gutters.tenVMargin]}>
        <Text
          style={[
            Common.titleText,
            Fonts.fontWeightRegular,
            Fonts.fontSizeLarge,
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
            Fonts.fontSizeSmall,
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
        inputContainerStyle={[
          {
            height: 56,
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
        <ActivityIndicator size="small" color={Common.loadingColor.color} />
      ) : (
        <FlatList
          data={searchable && searchable}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
        />
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
          titleStyle={[Fonts.fontWeightRegular, Fonts.fontFamilyPrimary]}
          buttonStyle={[
            Common.primaryPinkBackground,
            // Gutters.fiftyfiveHeight,
            Gutters.sixtyHeight,
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
