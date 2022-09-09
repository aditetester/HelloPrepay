import React from 'react'
import { View, SafeAreaView, StatusBar, Image, Appearance } from 'react-native'
import { useTheme } from '@/Hooks'
import { LinearProgress } from '@rneui/themed'
import { useSelector } from 'react-redux'

const PersistLoading = () => {
  const { Common, Layout, Gutters, Images } = useTheme()
  const theme = useSelector(state => state.theme)
  const colorScheme = Appearance.getColorScheme()

  return (
    <SafeAreaView style={[Common.persistLoadingBackground, Layout.fill]}>
      <StatusBar
        backgroundColor={Common.persistLoadingBackground.backgroundColor}
        barStyle={theme.darkMode ? 'light-content' : 'dark-content'}
      />
      <View
        style={[
          Layout.center,
          Common.persistLoadingBackground,
          Layout.fullHeight,
        ]}
      >
        {theme.darkMode ? (
          <Image
            source={Images.darkThemeLogo}
            style={[{ resizeMode: 'contain' }, Gutters.fiftyPWidth]}
          />
        ) : (
          <Image
            source={Images.whiteThemeLogo}
            style={[{ resizeMode: 'contain' }, Gutters.fiftyPWidth]}
          />
        )}
        <LinearProgress
          style={[Gutters.tenMargin, Gutters.seventyPWidth]}
          color={theme.darkMode ? Common.white.color : Common.primaryPink.color}
          value={10}
          variant="indeterminate"
        />
      </View>
    </SafeAreaView>
  )
}

export default PersistLoading
