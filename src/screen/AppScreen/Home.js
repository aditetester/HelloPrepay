import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  BackHandler,
  Alert,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '@/Hooks';
import { Avatar } from '@rneui/themed';
import CarrierPlans from '@/Components/CarrierPlans';
import { useIsFocused, useRoute } from '@react-navigation/native';
import History from '../Data/history';
import UserHistory from '../../Components/History';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const Home = ({ navigation }) => {
  //NOTE: 1. Define Variables
  let focus = useIsFocused();
  let route = useRoute();
  console.log('', route.name);
  const theme = useSelector(state => state.theme);
  const user = useSelector(state => state.user);
  const [number, setNumber] = useState(String(user.userData.phone_number));
  const withoutFormateNumber = String(number).replace(/\D/g, '');
  const { Common, Layout, Images, Gutters, Fonts } = useTheme();
  let first_name =
    user.userData.first_name.charAt(0).toUpperCase() + user.userData.first_name.slice(1);

  //NOTE: 2. Helper Method

  const onProfileHandler = () => {
    navigation.navigate('Profile');
  };

  const onExitApp = () => {
    if (route.name === 'Home') {
      Alert.alert('Exit App?', 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => null
        },
        { text: 'YES', onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    }
  };

  //NOTE: 3. Life Cycle Method

  useEffect(
    () => {
      navigation.setOptions({
        headerLeft: () => null,
        headerStyle: {
          backgroundColor: Common.backgroundPrimary.backgroundColor,
          height: verticalScale(50)
        },
        headerTitle: () =>
          <Image
            source={Images.Logo}
            resizeMode="contain"
            style={[{ width: scale(90) }, Common.resizeModeContain]}
          />,
        headerRight: () =>
          <Avatar
            size={verticalScale(40)}
            rounded
            onPress={onProfileHandler}
            title={user.userData.first_name.charAt(0)}
            containerStyle={[Gutters.twentyRMargin, Common.primaryPinkBackground]}
          >
            <Avatar.Accessory size={verticalScale(10)} />
          </Avatar>,
        headerTitleAlign: 'left',
        headerShadowVisible: false,
        headerBackTitleVisible: false
      });
    },
    [navigation, theme, focus]
  );

  useEffect(() => {
    if (route.name === 'Home') {
      BackHandler.addEventListener('hardwareBackPress', onExitApp);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onExitApp);
      };
    }
  }, []);

  useEffect(
    () => {
      function phoneFormat(input) {
        input = input.replace(/\D/g, '').substring(0, 10);
        var size = input.length;
        if (size > 0) {
          input = '(' + input;
        }
        if (size > 3) {
          input = input.slice(0, 4) + ') ' + input.slice(4);
        }
        if (size > 6) {
          input = input.slice(0, 9) + '-' + input.slice(9);
        }
        return setNumber(input);
      }
      phoneFormat(String(number));
    },
    [number]
  );

  //NOTE: 4. Render Method

  return (
    <SafeAreaView style={[Layout.fill, Common.backgroundPrimary]}>
      <View
        style={[
          Layout.flexTwo,
          Gutters.twentyFourHMargin,
          Layout.row,
          Layout.justifyContentBetween
        ]}
      >
        <View style={[Layout.justifyContentCenter, Layout.fill]}>
          <Text
            style={[
              Common.primaryGrey,
              Fonts.fontSizeRegular,
              Fonts.fontWeightRegular,
              Fonts.fontFamilyPrimary
            ]}
          >
            Hello,{' '}
            <Text style={[Common.titleText, Fonts.fontFamilyPrimary, Fonts.fontSizeRegular]}>
              {first_name}.
            </Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Esim')}
          style={[Layout.justifyContentCenter, Layout.alignItemsEnd]}
        >
          <Image
            source={Images.eSim}
            style={[
              { maxWidth: scale(40) },
              Layout.fill,
              Gutters.fortyHeight,
              Common.resizeModeContain
            ]}
          />
        </TouchableOpacity>
      </View>
      <View style={[Layout.flexThree, Gutters.fiveVMargin, Gutters.twentyFourHMargin]}>
        <View style={[Layout.row, { alignItems: 'center', marginVertical: 5 }]}>
          <Text
            style={[
              { marginBottom: 3 },
              Common.primaryGrey,
              Fonts.fontWeightSmall,
              Fonts.fontFamilyPrimary,
              // Gutters.tenBMargin,
              Fonts.fontSize12
            ]}
          >
            Phone Number
          </Text>
          <Image
            source={Images.bluetick}
            resizeMode="contain"
            style={[
              {
                marginLeft: scale(5),
                alignSelf: 'center',
                height: verticalScale(20),
                width: scale(20)
              }
            ]}
          />
        </View>
        <View
          style={[
            { maxHeight: scale(60) },
            Layout.flexTwo,
            Layout.row,
            Layout.alignItemsCenter,
            Layout.justifyContentBetween,
            Common.borderRadius,
            Common.primaryBlueBackground
          ]}
        >
          <TextInput
            defaultValue={String(number)}
            onChangeText={text => setNumber(text)}
            keyboardType="numeric"
            maxLength={14}
            style={[
              Fonts.fontFamilyPrimary,
              Common.white,
              Fonts.fontSizeMedium,
              Fonts.fontWeightRegular,
              Gutters.tenHMargin,
              Gutters.fiftyfivePWidth
            ]}
          />
          <Image
            source={{ uri: user.userData.carrier_image }}
            style={[
              { width: scale(70) },
              // Layout.center,
              Gutters.eightRMargin,
              Gutters.eightyPHeight,
              Common.borderRadius,
              Common.resizeModeContain
            ]}
          />
        </View>
      </View>
      {/* {UserHistory.length !== 0 ? ( */}
      {/* // <UserHistory */}
      {/* // phone_number={withoutFormateNumber} */}
      {/* // formattedNumber={number} */}
      {/* // /> */}
      {/* // ) : ( */}
      <CarrierPlans
        phone_number={withoutFormateNumber}
        formattedNumber={number}
        first_name={first_name}
      />
      {/* // )} */}
    </SafeAreaView>
  );
};

export default Home;
