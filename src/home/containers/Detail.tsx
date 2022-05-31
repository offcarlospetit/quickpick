import React, {useContext, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import WebView from 'react-native-webview';
import Pdf from 'react-native-pdf';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../navigation/HomeStack';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import {CoreContext} from '../../core/context';
import {Data} from '../../utils';

type DetailScreenProp = NativeStackNavigationProp<StackParamList, 'Detail'>;
type DetailScreenRouteProp = RouteProp<StackParamList, 'Detail'>;

const Detail = (props: DetailScreenProp) => {
  const {params} = useRoute<DetailScreenRouteProp>();
  const {navigate} = useNavigation<DetailScreenProp>();
  const {place} = useContext(CoreContext);

  const {id} = params;

  const returnViewDetail = () => {
    let detailPlace;
    console.log({id});
    if (id) {
      detailPlace = Data.find(item => item.id === id);
    } else {
      detailPlace = place[0];
    }
    console.log({object: detailPlace});
    const {webview} = detailPlace ?? {};
    console.log({webview});
    if (webview) {
      return <WebView source={{uri: 'https://queresto.com/barteclados'}} />;
    } else {
      return (
        <Pdf
          source={{
            uri: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          }}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
        />
      );
    }
  };

  return <View style={{flex: 1}}>{returnViewDetail()}</View>;
};

export default Detail;

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
