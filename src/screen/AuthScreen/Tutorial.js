import React from 'react'
import {
  SafeAreaView,
  Image,
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { useTheme } from '@/Hooks'
import { useSelector } from 'react-redux'

const { width, height } = Dimensions.get('window')

const slides = [
  {
    id: '1',
    image: require('../../Assets/Images/please_be_patient.png'),
    title: 'Select a carrier',
    subtitle: 'AT&T, Verizon, T-Mobile, and many more carrier to choose.',
  },
  {
    id: '2',
    image: require('../../Assets/Images/designer.png'),
    title: 'Enter your mobile number',
    subtitle:
      'Verify your number once via SMS and have access to your profile.',
  },
  {
    id: '3',
    image: require('../../Assets/Images/technology.png'),
    title: 'Select Top-Up',
    subtitle: 'Select how much you want to refill from $10 up to $120.',
  },
  {
    id: '4',
    image: require('../../Assets/Images/finance.png'),
    title: 'Make payment',
    subtitle:
      'Pay with credit card, Apple Pay Google Pay, or with Samsung Pay.',
  },
]

const Slide = ({ item }) => {
  const theme = useSelector(state => state.theme)
  const { Common, Fonts, Layout, Images, Gutters } = useTheme()
  return (
    <View style={[Layout.alignItemsCenter, Common.backgroundPrimary]}>
      <Image
        style={{
          height: '70%',
          width,
          resizeMode: 'contain',
        }}
        source={item?.image}
      />

      <View
        style={[
          { flex: 1, alignItems: 'center' },
          // Layout.center,
          Fonts.textCenter,
        ]}
      >
        <Text
          style={[
            styles.title,
            Common.titleText,
            Fonts.fontSizeRegular,
            Fonts.textCenter,
            Fonts.fontWeightRegular,
          ]}
        >
          {item?.title}
        </Text>
        <Text
          style={[
            Common.innerText,
            Fonts.fontSizeSmaller,
            Fonts.textCenter,
            Gutters.sixtyPMWidth,
            Gutters.twentyTMargin,
          ]}
        >
          {item?.subtitle}
        </Text>
      </View>
    </View>
  )
}

const Tutorial = ({ navigation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0)
  const ref = React.useRef()
  let nav = navigation
  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x
    const currentIndex = Math.round(contentOffsetX / width)
    setCurrentSlideIndex(currentIndex)
  }

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1
    if (nextSlideIndex !== slides.length) {
      const offset = nextSlideIndex * width
      ref?.current.scrollToOffset({ offset })
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }

  const skip = () => {
    const lastSlideIndex = slides.length - 1
    const offset = lastSlideIndex * width
    ref?.current.scrollToOffset({ offset })
    setCurrentSlideIndex(lastSlideIndex)
  }

  const Footer = () => {
    const { Common, Fonts, Layout, Gutters } = useTheme()
    const onNavigationHandler = () => {
      console.log(nav.navigate('Login'))
    }

    return (
      <View
        style={[
          styles.footerContainer,
          Common.backgroundPrimary,
          Layout.justifyContentBetween,
        ]}
      >
        {/* Indicator container */}
        <View
          style={[
            Layout.justifyContentCenter,
            Layout.row,
            Gutters.fortyTMargin,
            Gutters.twentyPHeight,
          ]}
        >
          {/* Render indicator */}
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                Common.indicatorBackground,
                currentSlideIndex == index && [
                  {
                    width: 25,
                    height: 4,
                    borderRadius: 2,
                  },
                  Common.primaryPinkBackground,
                  // Gutters.fiftyTMargin,
                ],
              ]}
            />
          ))}
        </View>

        {/* Render buttons */}
        <View style={[Layout.center, Gutters.thirtyBMargin]}>
          {currentSlideIndex == slides.length - 1 ? (
            <View style={{ height: 50 }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  {
                    width: 341,
                    height: 64,
                  },
                  Common.primaryPinkBackground,
                  Common.primaryPinkBorder,
                  Common.borderRadius,
                  Layout.center,
                ]}
                onPress={onNavigationHandler}
              >
                <Text
                  style={[
                    Fonts.fontSizeSmall,
                    Common.white,
                    Fonts.fontWeightRegular,
                  ]}
                >
                  Let’s start
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={[
                Layout.row,
                Layout.justifyContentBetween,
                Gutters.twentyHMargin,
                Layout.fullWidth,
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  {
                    width: 60,
                    height: 60,
                  },
                  Layout.center,
                ]}
                onPress={skip}
              >
                <Text
                  style={[
                    {
                      textDecorationLine: 'underline',
                    },
                    Fonts.fontWeightRegular,
                    Fonts.fontSizeSmall,
                    Common.primaryPink,
                  ]}
                >
                  SKIP
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  Common.primaryPinkBackground,
                  Layout.center,
                  Common.borderRadius,
                  Gutters.twentyPWidth,
                  Gutters.hundredPHeight,
                ]}
                onPress={goToNextSlide}
              >
                <Text
                  style={[
                    Fonts.fontWeight,
                    Common.white,
                    Fonts.fontSizeSmaller,
                  ]}
                >
                  NEXT
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    )
  }

  const { Common, Layout } = useTheme()

  return (
    <SafeAreaView style={[Layout.fill, Common.backgroundPrimary]}>
      <FlatList
        bounces={false}
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        contentContainerStyle={{ height: height * 0.75 }}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={slides}
        pagingEnabled
        renderItem={({ item }) => <Slide item={item} />}
      />
      <Footer />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  title: {
    marginTop: -20,
  },
  indicator: {
    height: '10%',
    width: 8,
    marginHorizontal: 3,
    borderRadius: 2,
    marginTop: 10,
    alignSelf: 'center',
  },
  footerContainer: {
    height: height * 0.25,
    paddingHorizontal: 20,
  },
})
export default Tutorial
