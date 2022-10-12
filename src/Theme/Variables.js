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
  persistLoadingBackground: '#FFFFFF',
  primaryGrey: '#7B808D',
  secondaryGrey: '#71787D',
  normalText: '#000',
  offWhite: '#F3F5F7',
  offWhiteSecondary: '#EFEFED',
  white: 'white',
  black: 'black',
  textColor: 'black',
  grey: 'grey',
  red: '#FF3333',
  placeHolder: '#7B808D',
  loadingColor: '#DB006A',
  keyboardText: '#28224B',
  keyboardBackGround: '#F3F5F7',
  darkGrey: '#212831',
  lightGrey: '#506176',
  transactionModalLightGrey: '#0c0f0a',
  transactionModalTextColor: '#ffffff',
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
const one = 1
const twelve = 12
const thirty = 30
const forty = 40
const twenty = 20
const three = 3
const nine = 9
const two = 2
const fifty = 50
const twentyfive = 25
const seventy = 70
const seventyfour = 74
const fiftyfive = 55
const five = 5
const fifteen = 15
const ofz = 140
const oon = 119
const sixty = 60
const oos = 116
const eight = 8
const eighteen = 18
const eighty = 80
const otz = 130
const fiftysix = 56
const sixteen = 16
const ots = 126
const six = 6
const zero = 0
const twentytwo = 22
const twentyFour = 24
const onefivezero = 150
const onesixzero = 160
const onetwozero = 120
const twofivezero = 250
const foureightzero = 480

const zeroOfive = 0.5
const zeroOseven = 0.7

const headerWidth = 139.13
const headerHeight = 32

//--------- Value in minus -------------

const eightM = -8
const twentyM = -20
const tenM = -10
const fifteenM = -15
const twentyFiveM = -25

//---------Width and Height-------------
const twoP = '2%'
const twentyP = '20%'
const hundredP = '100%'
const fiftyP = '50%'
const fiftyfiveP = '55%'
const sixtyP = '60%'
const seventyP = '70%'
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
const fortyeightP = '48%'
const fortyP = '40%'

export const MetricsSizes = {
  tiny,
  small,
  regular,
  large,
  one,
  ten,
  twelve,
  thirty,
  forty,
  zero,
  twenty,
  three,
  nine,
  two,
  six,
  fifty,
  five,
  fiftyfive,
  twentyFour,
  twentyfive,
  twofivezero,
  seventy,
  fifteen,
  ofz,
  oon,
  oos,
  otz,
  eighteen,
  eighty,
  sixty,
  eight,
  ots,
  fiftysix,
  sixteen,
  onefivezero,
  headerWidth,
  headerHeight,
  onesixzero,
  onetwozero,
  seventyfour,
  twentytwo,
  foureightzero,

  zeroOfive,
  zeroOseven,

  //--------Values in %--------

  twentyP,
  hundredP,
  sixtyP,
  seventyP,
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
  fiftyP,
  fortyeightP,
  fiftyfiveP,
  fortyP,
  twoP,

  //------ Values Minus -----------

  eightM,
  twentyM,
  tenM,
  fifteenM,
  twentyFiveM,
}

export default {
  Colors,
  NavigationColors,
  FontSize,
  MetricsSizes,
}
