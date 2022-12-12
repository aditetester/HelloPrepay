import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  SafeAreaView,
  FlatList,
  Pressable,
  TouchableOpacity,
} from 'react-native'
import { useSelector } from 'react-redux'
import { useTheme } from '@/Hooks'
import { CheckBox, Skeleton, Button } from '@rneui/themed'
import { useGetPlansMutation } from '@/Services/api'

const Selectplan = ({ navigation, route }) => {
  //NOTE: 1. Define Variables
  let params = route.params
  const theme = useSelector(state => state.theme)
  const { Common, Layout, Images, Gutters, Fonts } = useTheme()
  const [isSelected, setSelection] = useState('')
  const [planPrice, setPlanPrice] = useState('')
  const [PlanLength, setPlanLength] = useState('')
  const [getPlans, { data, isLoading, error }] = useGetPlansMutation()

  //NOTE: 2. Helper Method
  const onBackHandler = () => {
    navigation.goBack()
  }

  const onPlanSelect = (name, price) => {
    if (isSelected === '') {
      setSelection(name)
      setPlanPrice(price)
      return
    } else if (isSelected === name) {
      setSelection('')
      setPlanPrice('')
      return
    } else if (isSelected !== name) {
      setSelection(name)
      setPlanPrice(price)
      return
    }
  }

  const onContinueHandler = () => {
    navigation.navigate('AddMoney', {
      planId: isSelected,
      planPrice: planPrice,
      phone_number: params.phone_number,
      formattedNumber: params.formattedNumber,
    })
    setSelection('')
    setPlanPrice('')
  }

  //NOTE: 3. Life Cycle

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerStyle: {
        backgroundColor: Common.backgroundPrimary.backgroundColor,
        height: verticalScale(50),
      },
      headerTitle: () => (
        <Image
          source={Images.Logo}
          style={[{ width: scale(100) }, Common.resizeModeContain]}
        />
      ),

      headerTitleAlign: 'center',
      headerShadowVisible: false,
      headerBackTitleVisible: false,
    })
  }, [navigation, theme])

  useEffect(() => {
    getPlans({ body: null })
  }, [])

  useEffect(() => {
    if (data && data) {
      setPlanLength(String(data.length))
    }
  }, [data])

  //NOTE: 4. Render Method

  const loading = (
    <View
      style={[
        Layout.justifyContentCenter,
        Gutters.fiveHMargin,
        Gutters.fiveVMargin,
        Layout.center,
        Layout.flex20,
      ]}
    >
      <Skeleton
        animation="wave"
        width="100%"
        style={{ borderRadius: 4, marginVertical: 10, flex: 1 }}
      />

      <Skeleton
        animation="wave"
        width="100%"
        style={{ borderRadius: 4, marginVertical: 10, flex: 1 }}
      >
        <Skeleton
          animation="wave"
          width="100%"
          style={{ borderRadius: 4, marginVertical: 10, flex: 5 }}
        />
      </Skeleton>
      <Skeleton
        animation="wave"
        width="100%"
        style={{ borderRadius: 4, marginVertical: 10, flex: 1 }}
      />
      <Skeleton
        animation="wave"
        width="100%"
        style={{ borderRadius: 4, marginVertical: 10, flex: 1 }}
      />
      <Skeleton
        animation="wave"
        width="100%"
        style={{ borderRadius: 4, marginVertical: 10, flex: 1 }}
      />
      <Skeleton
        animation="wave"
        width="100%"
        style={{ borderRadius: 4, marginVertical: 10, flex: 1 }}
      />
    </View>
  )

  const keyExtractor = (item, index) => index.toString()

  const renderPlans = ({ item }) => {
    return (
      <Pressable
        onPress={() => onPlanSelect(item.name, item.price)}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={[
          Common.offWhiteSecondaryBorder,
          item.name === isSelected && Common.primaryPinkBorder,
          item.name === isSelected && Common.primaryPinkBackground,
          Layout.fill,
          Common.borderWidth,
          Common.borderRadius,
          Gutters.ninePadding,
          Gutters.sixVMargin,
        ]}
      >
        <View style={[Layout.row]}>
          <Text
            style={[
              Common.primaryBlueMode,
              isSelected === item.name && Common.white,
              Fonts.fontWeightRegular,
              Fonts.fontSizeSmall,
              Gutters.fiveRMargin,
              Fonts.fontFamilyPrimary,
            ]}
          >
            {item.name}
          </Text>
          <Text
            style={[
              Common.primaryBlueMode,
              isSelected === item.name && Common.white,
              Fonts.fontWeightRegular,
              Fonts.fontSizeSmall,
              Fonts.fontFamilyPrimary,
            ]}
          >
            {item.price}
          </Text>
          <CheckBox
            center
            checked={item.name === isSelected}
            onPress={() => onPlanSelect(item.name)}
            checkedIcon={
              <Image
                source={Images.checked}
                style={[
                  Gutters.twentyfiveHeight,
                  Gutters.twentyfiveWidth,
                  Common.resizeModeContain,
                ]}
              />
            }
            uncheckedIcon={
              <Image
                source={Images.unchecked}
                style={[
                  Gutters.twentyfiveHeight,
                  Gutters.twentyfiveWidth,
                  Common.resizeModeContain,
                ]}
              />
            }
            containerStyle={[
              Common.backgroundPrimary,
              item.name === isSelected && Common.primaryPinkBackground,
              Layout.center,
              Layout.selfCenter,
              Gutters.onesixzeroLMargin,
              Gutters.twentyFiveMBMargin,
            ]}
            wrapperStyle={[Layout.center]}
          />
        </View>
        <Text
          style={[
            Common.primaryGrey,
            isSelected === item.name && Common.white,
            Gutters.fiveVMargin,
            Fonts.fontFamilyPrimary,
            Fonts.fontWeightSmall,
          ]}
        >
          {item.type}
        </Text>
      </Pressable>
    )
  }

  const errorComponent = (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
      }}
    >
      <Image
        source={Images.error}
        style={{ width: '100%', height: 100 }}
        resizeMode="contain"
      />
      <Text
        style={[Common.textColor, { fontStyle: 'italic', fontWeight: '600' }]}
      >
        Data Not Found
      </Text>
    </View>
  )

  return (
    <SafeAreaView style={[Layout.fill, Common.backgroundPrimary]}>
      <TouchableOpacity
        style={[Gutters.fifteenPWidth, Gutters.fiveTMargin, Gutters.tenHMargin]}
        onPress={onBackHandler}
      >
        <Image source={Images.LeftArrow} />
      </TouchableOpacity>
      <View
        style={[
          Layout.flexTwo,
          Layout.justifyContentCenter,
          Layout.alignItemsCenter,
          Gutters.tenVMargin,
          Gutters.twentyFourHMargin,
        ]}
      >
        <Text
          style={[
            Common.titleText,
            Fonts.fontFamilyPrimary,
            Fonts.fontSizeLarge,
            Fonts.fontWeightRegular,
            Gutters.oneVMargin,
          ]}
        >
          Select your plan
        </Text>
        <Text
          style={[
            Common.titleText,
            Fonts.fontFamilyPrimary,
            Fonts.fontSizeSmall,
            Fonts.fontWeightSmall,
            Gutters.tenVMargin,
          ]}
        >
          Choose the one that suits you best.
        </Text>
      </View>
      <View
        style={[
          Layout.flexTwo,
          Layout.row,
          Layout.justifyContentBetween,
          Layout.alignItemsCenter,
          Gutters.twentyFourHMargin,
          Gutters.tenVMargin,
        ]}
      >
        {theme.darkMode ? (
          <Image
            source={Images.whitecarrier12}
            style={[{ resizeMode: 'contain' }, Gutters.fortyPWidth]}
          />
        ) : (
          <Image
            source={Images.carrier12}
            style={[{ resizeMode: 'contain' }, Gutters.fortyPWidth]}
          />
        )}

        <Text
          style={[
            Fonts.fontWeightSmall,
            Fonts.fontSizeSmall,
            Common.normalText,
            Fonts.fontFamilyPrimary,
          ]}
        >
          {error ? 'Data Not Found' : `${PlanLength} Plans Available`}
        </Text>
      </View>

      <View style={[Gutters.twentyFourHMargin, Layout.flexTen]}>
        {isLoading ? (
          loading
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            keyExtractor={keyExtractor}
            data={data}
            renderItem={renderPlans}
            ListEmptyComponent={error && errorComponent}
          />
        )}
      </View>
      <View
        style={[
          Layout.selfCenter,
          Gutters.ninetyfivePWidth,
          Gutters.fortyBMargin,
          Layout.flexTwo,
          Gutters.twentyMTMargin,
        ]}
      >
        <Button
          title="continue"
          loading={false}
          onPress={() => {
            onContinueHandler()
          }}
          loadingProps={[{ size: 'small' }, Common.whiteColor]}
          titleStyle={[Fonts.fontWeightRegular, Fonts.fontFamilyPrimary]}
          buttonStyle={[
            Common.primaryPinkBackground,
            Gutters.fiftyfiveHeight,
            Common.borderRadius,
          ]}
          containerStyle={[
            Gutters.ninetyfivePWidth,
            Gutters.twentyTMargin,
            Layout.selfCenter,
            Common.borderRadius,
          ]}
          disabled={!isSelected}
          disabledStyle={[Common.whiteColor, Common.greyBackground]}
          disabledTitleStyle={[Common.whiteColor, Gutters.zeroOsevenOpacity]}
        />
      </View>
    </SafeAreaView>
  )
}

export default Selectplan
