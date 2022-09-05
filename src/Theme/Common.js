/**
 * This file defines the base application styles.
 *
 * Use it to define generic component styles (e.g. the default text styles, default button styles...).
 */
import { StyleSheet } from 'react-native'
import buttonStyles from './components/Buttons'
/**
 *
 * @param Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */
export default function ({ Colors, ...args }) {
  return {
    button: buttonStyles({ Colors, ...args }),
    ...StyleSheet.create({
      backgroundPrimary: {
        backgroundColor: Colors.backgroundPrimary,
      },
      primaryBlue: {
        color: Colors.primaryBlue,
      },
      primaryBlueMode: {
        color: Colors.primaryBlueMode,
      },
      primaryBlueBorder: {
        borderWidth: 1,
        borderColor: Colors.primaryBlue,
      },
      primaryBlueBackground: {
        backgroundColor: Colors.primaryBlue,
      },
      primaryPink: {
        color: Colors.primaryPink,
      },
      primaryPinkBorder: {
        borderWidth: 1,
        borderColor: Colors.primaryPink,
      },
      primaryPinkBackground: {
        backgroundColor: Colors.primaryPink,
      },
      primaryGrey: {
        color: Colors.primaryGrey,
      },
      primaryGreyBorder: {
        borderWidth: 1,
        borderColor: Colors.primaryGrey,
      },
      primaryGreyBackground: {
        backgroundColor: Colors.primaryGrey,
      },
      normalText: {
        color: Colors.normalText,
      },
      searchBarBackgRoundColor: {
        color: Colors.offWhite,
      },
      phoneInputBackgRoundColor: {
        backgroundColor: Colors.offWhite,
      },
      backgroundReset: {
        backgroundColor: Colors.transparent,
      },
      textInput: {
        borderWidth: 1,
        borderColor: Colors.text,
        backgroundColor: Colors.inputBackground,
        color: Colors.text,
        minHeight: 50,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
      },
      titleText: {
        color: Colors.titleText,
      },
      innerText: {
        color: Colors.subtitleText,
      },
      whiteColor: {
        color: Colors.white,
      },
      whiteBackground: {
        color: Colors.white,
      },
      offWhiteColor: {
        color: Colors.offWhite,
      },
      offWhiteBackground: {
        backgroundColor: Colors.offWhite,
      },
      offWhiteBorder: {
        borderColor: Colors.offWhite,
        borderWidth: 1,
      },
      offWhiteSecondary: {
        color: Colors.offWhiteSecondary,
      },
      offWhiteSecondaryBorder: {
        borderColor: Colors.offWhiteSecondary,
        borderWidth: 1,
      },
      whiteColorBackground: {
        backgroundColor: Colors.white,
      },
      blackColor: {
        color: Colors.black,
      },
      blackColorBackground: {
        backgroundColor: Colors.black,
      },
      white: {
        color: Colors.white,
      },
      black: {
        color: Colors.black,
      },
      indicatorBackground: {
        backgroundColor: '#71787D',
      },
      elevation: {
        elevation: 8,
      },
      borderRadius: {
        borderRadius: 4,
      },
      borderWidth: {
        borderWidth: 1,
      },
      borderRadiusMedium: {
        borderRadius: 10,
      },
      greyColor: {
        color: Colors.grey,
      },
      greyBackground: {
        backgroundColor: Colors.grey,
      },
      secondaryGrey: {
        color: Colors.secondaryGrey,
      },
      borderRadiusOne: {
        borderRadius: 1,
      },
      borderWidthOne: {
        borderWidth: 1,
      },
      borderWidthTwo: {
        borderWidth: 2,
      },
      errorBorder: {
        borderColor: Colors.red,
        borderWidth: 1,
      },
      errorColor: {
        color: Colors.red,
      },
      redBackground: {
        backgroundColor: Colors.red,
      },
      persistLoadingBackground: {
        backgroundColor: Colors.persistLoadingBackground,
      },
      placeHolderText: {
        color: Colors.placeHolder,
      },
    }),
  }
}
