import React from 'react'
import { View, Text, SafeAreaView, StatusBar, Image } from 'react-native'
import { useTheme } from '@/Hooks'
import { LinearProgress } from '@rneui/themed'
import { useSelector } from 'react-redux'

const PersistLoading = () => {
  const { Common, Layout, Gutters, Images } = useTheme()
  const theme = useSelector(state => state.theme)

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
            style={{
              resizeMode: 'contain',
              width: '50%',
            }}
          />
        ) : (
          <Image
            source={Images.whiteThemeLogo}
            style={{ resizeMode: 'contain', width: '50%' }}
          />
        )}
        <LinearProgress
          style={[
            { width: '70%' },
            // Gutters.twentyVMargin,
            // Gutters.fiftyPWidth,
            Gutters.tenMargin,
          ]}
          color={theme.darkMode ? '#FFFFFF' : '#DB006A'}
          value={10}
          variant="indeterminate"
        />
      </View>
    </SafeAreaView>
  )
}

export default PersistLoading
