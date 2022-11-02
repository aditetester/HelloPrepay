import { useTheme } from '@/Hooks'
import React, { useEffect } from 'react'
import { View, Text, SafeAreaView, Image } from 'react-native'
import Button from '@/Components/UI/Button'
import { useDispatch } from 'react-redux'
import { setUser } from '@/Store/User'

const Welcome = ({ navigation, route }) => {
  //NOTE: 1. Define Variables
  const params = route.params
  console.log('Welcome', params.data)
  const dispatch = useDispatch()
  const { Common, Fonts, Layout, Gutters, Images } = useTheme()

  //NOTE: 2. Helper Method
  const onContinueHandler = () => {
    dispatch(setUser({ userData: params.data, isAuth: true, perpos: null }))
  }

  //NOTE: 3. Life Cycle
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    })
  }, [navigation])

  //NOTE: 4. Render Method
  return (
    <SafeAreaView style={[Common.backgroundPrimary, Layout.fill]}>
      <View style={[Layout.fill, Common.backgroundPrimary]}>
        <View
          style={[
            Layout.alignItemsCenter,
            Gutters.tenVMargin,
            Gutters.fivePadding,
            Layout.fill,
            Gutters.thirtyTMargin,
          ]}
        >
          <Text
            style={[
              Common.titleText,
              Fonts.fontWeightRegular,
              Fonts.fontSizeRegular,
              Gutters.tenBMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            Welcome {params.firstName}!
          </Text>
          <Text
            style={[
              Common.innerText,
              Common.primaryGrey,
              Fonts.fontWeightSmall,
              Fonts.fontSizeSmall,
              Fonts.fontFamilyPrimary,
            ]}
          >
            Refill your phone number right away.
          </Text>
        </View>

        <View
          style={[
            Layout.center,
            Gutters.sixtyPWidth,
            Layout.selfCenter,
            Layout.fill,
            Gutters.tenVMargin,
          ]}
        >
          <Button
            onPress={() => {
              onContinueHandler()
            }}
            title={'Let’s start'}
            size="sm"
            fontSize={16}
            backgroundColor={Common.primaryPink.color}
            disabled={false}
          />
        </View>
        <View style={[Layout.center, Layout.flexSix]}>
          <Image
            source={Images.welcome}
            style={[
              Common.resizeModeCover,
              Gutters.eightyPHeight,
              Gutters.hundredPWidth,
            ]}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Welcome
