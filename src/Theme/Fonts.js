/**
 * This file contains all application's style relative to fonts
 */
import { StyleSheet } from 'react-native'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'

/**
 *
 * @param Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */
export default function ({ FontSize, Colors }) {
  return StyleSheet.create({
    fontFamilyPrimary: {
      fontFamily: 'Satoshi-Regular',
    },
    fontSize12: {
      fontSize: scale(12),
    },
    fontSizeSmall: {
      fontSize: scale(16),
    },
    fontSizeExtraSmall: {
      fontSize: scale(14),
    },
    fontSizeSmaller: {
      fontSize: scale(13),
    },
    fontSizeMedium: {
      fontSize: scale(19),
    },
    fontSizeRegular: {
      fontSize: scale(24),
    },
    fontSizeLarge: {
      fontSize: 32,
    },
    fontSizeLargeS: {
      fontSize: 30,
    },
    fontWeight: {
      fontWeight: 'bold',
    },
    fontWeightRegular: {
      fontWeight: '900',
    },
    fontWeightSmall: {
      fontWeight: '500',
    },
    textSmall: {
      fontSize: FontSize.small,
      color: Colors.text,
    },
    textRegular: {
      fontSize: FontSize.regular,
      color: Colors.text,
    },
    textLarge: {
      fontSize: FontSize.large,
      color: Colors.text,
    },
    titleSmall: {
      fontSize: FontSize.small * 2,
      fontWeight: 'bold',
      color: Colors.text,
    },
    titleRegular: {
      fontSize: FontSize.regular * 2,
      fontWeight: 'bold',
      color: Colors.text,
    },
    titleLarge: {
      fontSize: FontSize.large * 2,
      fontWeight: 'bold',
      color: Colors.text,
    },
    textCenter: {
      textAlign: 'center',
    },
    textJustify: {
      textAlign: 'justify',
    },
    textLeft: {
      textAlign: 'left',
    },
    textRight: {
      textAlign: 'right',
    },
    textDecorationLineUnderline: {
      textDecorationLine: 'underline',
    },
  })
}
