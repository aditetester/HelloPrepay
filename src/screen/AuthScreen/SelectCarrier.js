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
import { setUser } from '@/Store/User'
import Button from '@/Components/UI/Button'
import { SearchBar } from '@rneui/themed'
import DATA from '../Data/data'

const SelectCarrier = ({ navigation }) => {
  const { Common, Images, Fonts, Gutters, Layout } = useTheme()
  const user = useSelector(state => state.user)
  const theme = useSelector(state => state.theme)
  const dispatch = useDispatch()
  const [selectedId, setSelectedId] = useState()

  const onContinueHandler = () => {
    if (!selectedId) {
      return
    }
    navigation.navigate('EnterMobileNumber')
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
        underlayColor={Common.white.color}
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
          source={image}
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

  const renderItem = ({ item }) => <Item id={item.id} image={item.image} />

  const arrayholder = DATA

  const [data, setData] = useState(DATA)
  const [searchValue, setSearchValue] = useState('')

  const searchFunction = text => {
    const updatedData = arrayholder.filter(item => {
      const item_data = `${item.title.toUpperCase()})`
      const text_data = text.toUpperCase()
      return item_data.indexOf(text_data) > -1
    })
    setData(updatedData)
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
          ]}
        >
          Select your carrier
        </Text>
      </View>
      <View style={Layout.alignItemsCenter}>
        <Text
          style={[Common.innerText, Fonts.fontWeightSmall, Fonts.fontSizeSmall]}
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
        inputContainerStyle={{
          height: 56,
          backgroundColor: Common.offWhiteBackground.backgroundColor,
          borderRadius: Common.borderRadius.borderRadius,
        }}
        containerStyle={{
          backgroundColor: Common.offWhiteBackground.backgroundColor,
          borderRadius: Common.borderRadius.borderRadius,
          margin: 15,
        }}
        lightTheme={theme.darkMode ? false : true}
      />
      <FlatList
        data={data}
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
