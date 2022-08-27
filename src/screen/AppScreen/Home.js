import { useTheme } from '@/Hooks'
import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native'
import { useSelector } from 'react-redux'
import { Avatar } from '@rneui/themed'

const Home = ({ navigation }) => {
  const theme = useSelector(state => state.theme)
  const { Common, Layout, Images, Gutters } = useTheme()

  const onProfileHandler = () => {
    console.log('profile')
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerStyle: {
        backgroundColor: Common.backgroundPrimary.backgroundColor,
        height: 70,
      },
      headerTitle: () =>
        !theme.darkMode ? (
          <Image
            source={Images.whiteThemeLogo}
            style={{
              width: 139.13,
              // height: 32,
              resizeMode: 'contain',
            }}
          />
        ) : (
          <Image
            source={Images.darkThemeLogo}
            style={{
              width: 139.13,
              height: 32,
              resizeMode: 'contain',
            }}
          />
        ),
      headerRight: () => (
        <Avatar
          size={64}
          rounded
          onPress={onProfileHandler}
          source={Images.avatar}
          containerStyle={{
            marginRight: 20,
            height: 40,
            width: 40,
            borderColor: 'grey',
            borderStyle: 'solid',
            borderWidth: 1,
          }}
        />
      ),
      headerTitleAlign: 'left',
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    })
  }, [navigation, theme])
  return (
    <SafeAreaView
      style={[Layout.fill, Common.backgroundPrimary, Layout.center]}
    >
      <Text style={Common.normalText}>Home</Text>
    </SafeAreaView>
  )
}

export default Home
