import { useTheme } from '@/Hooks'
import React from 'react'
import { Text, StyleSheet, TouchableOpacity } from 'react-native'

function Button({
  onPress,
  title,
  size,
  backgroundColor,
  fontSize,
  color,
  disabled,
}) {
  const { Common, Layout, Fonts, Gutters } = useTheme()

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.appButtonContainer,
        size === 'sm' && {
          paddingHorizontal: 8,
          paddingVertical: 6,
          elevation: 2,
        },
        backgroundColor && { backgroundColor },
        !backgroundColor && Common.primaryPinkBackground,
        Common.elevation,
        Common.borderRadius,
        Layout.center,
        Layout.selfCenter,
        Gutters.thirtyVMargin,
      ]}
    >
      <Text
        style={[
          size === 'sm',
          fontSize && { fontSize },
          color && { color },
          Fonts.fontWeightRegular,
          Fonts.fontSizeSmall,
          Common.white,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  appButtonContainer: {
    width: '95%',
    height: '90%',
  },
})

export default Button
