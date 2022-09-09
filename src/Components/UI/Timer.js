import React, { useState, useEffect } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@/Hooks'

const Timer = ({ maxRange }) => {
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
    <TouchableOpacity onPress={() => start()}>
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
          Send code again
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
          Send code again in 00:{counter <= 9 ? `0${counter}` : counter}
        </Text>
      )}
    </TouchableOpacity>
  )
}
export default Timer
