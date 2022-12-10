import { StyleSheet } from 'react-native'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'

/**
 * Generate Styles depending on MetricsSizes vars availabled at ./Theme/Variables
 * Styles are like :
 * <size><direction><op>: {
 *    <op><direction>: <value>
 * }
 * where:
 * <size>: is the key of the variable included in MetricsSizes
 * <direction>: can be ['Bottom','Top','Right','Left','Horizontal','Vertical']
 * <op>: can be ['Margin', 'Padding']
 * <value>: is the value of the <size>
 */

/**
 *
 * @param Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */
export default function ({ MetricsSizes }) {
  return StyleSheet.create({
    ...Object.entries(MetricsSizes).reduce(
      (acc, [key, value]) => ({
        ...acc,
        /* Margins */
        [`${key}Margin`]: {
          margin: scale(value),
        },
        [`${key}BMargin`]: {
          marginBottom: scale(value),
        },
        [`${key}TMargin`]: {
          marginTop: scale(value),
        },
        [`${key}RMargin`]: {
          marginRight: scale(value),
        },
        [`${key}LMargin`]: {
          marginLeft: scale(value),
        },
        [`${key}VMargin`]: {
          marginVertical: verticalScale(value),
        },
        [`${key}HMargin`]: {
          marginHorizontal: scale(value),
        },
        /* Paddings */
        [`${key}Padding`]: {
          padding: value,
        },
        [`${key}BPadding`]: {
          paddingBottom: value,
        },
        [`${key}TPadding`]: {
          paddingTop: value,
        },
        [`${key}RPadding`]: {
          paddingRight: value,
        },
        [`${key}LPadding`]: {
          paddingLeft: value,
        },
        [`${key}VPadding`]: {
          paddingVertical: value,
        },
        [`${key}HPadding`]: {
          paddingHorizontal: value,
        },
        [`${key}Width`]: {
          width: value,
        },
        [`${key}MWidth`]: {
          maxWidth: value,
        },
        [`${key}Height`]: {
          height: value,
        },
        [`${key}MHeight`]: {
          maxHeight: value,
        },
        [`${key}Opacity`]: {
          opacity: value,
        },
      }),
      {},
    ),
  })
}
