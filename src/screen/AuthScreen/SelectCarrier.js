import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TouchableHighlight,
} from 'react-native'
import { useTheme } from '@/Hooks'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import Button from '@/Components/UI/Button'
import { SearchBar } from '@rneui/themed'
import { BASE_URL } from '@/Config'
import axios from 'axios'

const SelectCarrier = ({ navigation, route }) => {
  const params = route.params
  console.log('Carrier Params', params.obj)
  const { Common, Images, Fonts, Gutters, Layout } = useTheme()
  const user = useSelector(state => state.user)
  const theme = useSelector(state => state.theme)
  const dispatch = useDispatch()
  const [selectedId, setSelectedId] = useState()
  const [carrier, setCarrier] = useState()

  useEffect(() => {
    axios
      .get(`${BASE_URL}carrier`, {
        headers: { Authorization: 'Bearer ' + params.token },
      })
      .then(res => setCarrier(res.data.result))
      .then(err => console.log(err))
  }, [params])

  const onContinueHandler = () => {
    if (!selectedId) {
      return
    }
    axios
      .post(
        `${BASE_URL}profile_update`,
        { carrier_id: selectedId },
        {
          headers: { Authorization: 'Bearer ' + params.token },
        },
      )
      .then(res => {
        let json = JSON.stringify(res.data)
        let obj = JSON.parse(json)
        navigation.navigate('Welcome', {
          first_name: params.first_name,
          obj: params.obj,
        })
      })
      .catch(err => console.log('ERROR ERROR ERROR ', err))
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

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    })
  }, [navigation])

  const Item = ({ id, image }) => {
    return (
      <TouchableHighlight
        underlayColor={[Common.white.color]}
        style={[
          Gutters.twentyPadding,
          Gutters.eightVMargin,
          Gutters.oosHeight,
          Gutters.fourtythreePWidth,
          Common.borderRadius,
          Common.offWhiteBorder,
          selectedId !== id && Common.whiteColorBackground,
          selectedId === id && Common.primaryPinkBackground,
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
            { resizeMode: 'contain' },
          ]}
        />
      </TouchableHighlight>
    )
  }

  const renderItem = ({ item }) => (
    <Item id={item.id} image={item.image} color={item.color} />
  )

  const arrayholder = carrier
  const [searchValue, setSearchValue] = useState('')

  const searchFunction = text => {
    const updatedData = arrayholder.filter(item => {
      const item_data = `${item.name.toUpperCase()})`
      const text_data = text.toUpperCase()
      return item_data.indexOf(text_data) > -1
    })
    setCarrier(updatedData)
    setSearchValue(text)
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
        {!theme.darMode ? (
          <Image source={Images.greyLeftArrow} />
        ) : (
          <Image source={Images.whiteLeftArrow} />
        )}
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
        value={searchValue}
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
      <FlatList
        data={carrier}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
      />
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
          onPress={() => {
            onContinueHandler()
          }}
          title={'Continue'}
          size="sm"
          fontSize={16}
          disabled={!selectedId}
          backgroundColor={
            selectedId
              ? Common.primaryPinkBackground.backgroundColor
              : Common.greyBackground.backgroundColor
          }
        />
      </View>
    </View>
  )
}

export default SelectCarrier
