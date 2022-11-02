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
import { useSelector } from 'react-redux'
import { SearchBar, Image, Button } from '@rneui/themed'
import {
  useGetCarrierListQuery,
  useGetProfileUpdateMutation,
} from '@/Services/api'

const SelectCarrier = ({ navigation, route }) => {
  //NOTE: 1. Define Variables
  const params = route.params
  const { Common, Images, Fonts, Gutters, Layout } = useTheme()
  const theme = useSelector(state => state.theme)
  const [selectedId, setSelectedId] = useState()
  const [carrier, setCarrier] = useState()
  const [searchable, setSearchable] = useState(carrier)
  const [searchText, setSearchText] = useState('')

  //NOTE: 2. API
  const { data, isLoading, error } = useGetCarrierListQuery(params.token)
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
      token: params.token,
    })
  }

  const onBackHandler = () => {
    navigation.goBack()
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
      const item_data = `${item.name.toUpperCase()})`
      const text_data = text.toUpperCase()
      return item_data.indexOf(text_data) > -1
    })
    setSearchable(updatedData)
    setSearchText(text)
  }

  //NOTE: 4. Life Cycle

  useEffect(() => {
    if (data && data) {
      // console.log('setCarrier', data.data)
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
      navigation.navigate('Welcome', {
        first_name: params.first_name,
        data: profileUpdateData,
      })
    } else if (profileUpdateData && profileUpdateData.success === false) {
      Alert.alert('', 'Something Went Wrong...')
      return
    }
  }, [profileUpdateData])

  // useEffect(() => {
  //   if (searchText.length === 0) {
  //     setSearchable(carrier)
  //   }
  // }, [searchText])

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

  console.log('searchable', searchable)

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
            onContinueHandler(params)
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

export default SelectCarrier
