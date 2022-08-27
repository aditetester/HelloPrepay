/**
 * This file contains the application's variables.
 *
 * Define color, sizes, etc. here instead of duplicating them throughout the components.
 * That allows to change them more easily later on.
 */

/**
 * Colors
 */
export const Colors = {
  // Example colors:
  transparent: 'rgba(0,0,0,0)',
  inputBackground: '#FFFFFF',
  titleText: '#28224B',
  subtitleText: '#7B808D',
  primary: '#ffffff',
  backgroundPrimary: '#ffffff',
  primaryBlue: '#28224B',
  primaryBlueMode: '#28224B',
  primaryPink: '#DB006A',
  primaryGrey: '#7B808D',
  secondaryGrey: '#71787D',
  normalText: '#000',
  offWhite: '#F3F5F7',
  white: 'white',
  black: 'black',
  grey: 'grey',
  red: 'red',
}

export const NavigationColors = {
  primary: Colors.primary,
}

/**
 * FontSize
 */
export const FontSize = {
  small: 16,
  regular: 20,
  large: 40,
}

/**
 * Metrics Sizes
 */
const tiny = 5 // 10
const small = tiny * 2 // 10
const regular = tiny * 3 // 15
const large = regular * 2 // 30
const ten = tiny * 2
const twelve = 12
const thirty = 30
const forty = 40
const twenty = 20
const three = 3
const two = 2
const fifty = 50
const twentyfive = 25
const seventy = 70
const fiftyfive = 55
const five = 5
const ofz = 140
const oon = 119
const sixty = 60
const oos = 116
const eight = 8
const eighteen = 18
const otz = 130
const fiftysix = 56
const sixteen = 16
const ots = 126

//---------Width and Height-------------
const twentyP = '20%'
const hundredP = '100%'
const sixtyP = '60%'
const thirtyP = '30%'
const ninetyP = '90%'
const ninetyfiveP = '95%'
const fifteenP = '15%'
const twentynineP = '29%'
const eightyfiveP = '85%'
const eightyP = '80%'
const fourtythreeP = '43%'
const twelveP = '12%'
const fourtyfiveP = '45%'
const twentyfiveP = '25%'

export const MetricsSizes = {
  tiny,
  small,
  regular,
  large,
  ten,
  twelve,
  thirty,
  forty,
  twenty,
  three,
  two,
  fifty,
  five,
  fiftyfive,
  twentyfive,
  seventy,
  ofz,
  oon,
  oos,
  otz,
  eighteen,
  sixty,
  eight,
  ots,
  fiftysix,
  sixteen,
  twentyP,
  hundredP,
  sixtyP,
  thirtyP,
  ninetyP,
  ninetyfiveP,
  fifteenP,
  twentynineP,
  eightyfiveP,
  fourtythreeP,
  twelveP,
  eightyP,
  fourtyfiveP,
  twentyfiveP,
}

export default {
  Colors,
  NavigationColors,
  FontSize,
  MetricsSizes,
}
