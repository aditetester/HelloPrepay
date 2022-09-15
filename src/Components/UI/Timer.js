import React, { useState, useEffect } from 'react'
import { Pressable, Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@/Hooks'

const Timer = ({ maxRange, onPress, beforeText, afterText }) => {
  const [counter, setCounter] = useState(maxRange)
  const { Common, Layout, Fonts } = useTheme()

  useEffect(() => {
    if (counter > 0) {
      setTimeout(() => {
        setCounter(counter - 1)
      }, 1000)
    }
  }, [counter])

  const start = () => {
    setCounter(maxRange)
  }

  return (
    <Pressable
      onPress={() => {
        onPress(), start()
      }}
      disabled={counter !== 0}
    >
      {counter === 0 ? (
        <Text
          style={[
            Common.titleText,
            Layout.selfCenter,
            Fonts.fontSizeSmall,
            Fonts.textDecorationLineUnderline,
            Fonts.fontWeightRegular,
            Fonts.fontFamilyPrimary,
          ]}
        >
          {beforeText && beforeText}
        </Text>
      ) : (
        <Text
          style={[
            Common.titleText,
            Layout.selfCenter,
            Fonts.fontSizeSmall,
            Fonts.fontWeightRegular,
            Fonts.fontFamilyPrimary,
          ]}
        >
          {afterText && afterText} 00:{counter <= 9 ? `0${counter}` : counter}
        </Text>
      )}
    </Pressable>
  )
}
export default Timer
