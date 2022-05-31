import React, {useEffect, useContext} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {Data, Geoloc} from '../../utils';
import {CoreContext, Place} from '../../core/context';
import {StackParamList} from '../../navigation/HomeStack';
const {GetDistance} = Geoloc;

type HomeScreenProp = NativeStackNavigationProp<StackParamList, 'HomeScreen'>;
interface PlaceExtended extends Place {
  distance: number;
}

const Home = (props: HomeScreenProp) => {
  const {addEventListener, place} = useContext(CoreContext);
  const {navigate} = useNavigation<HomeScreenProp>();
  const [data, setData] = React.useState<Array<PlaceExtended>>([]);
  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      const {latitude, longitude} = info.coords;
      const places = Data.map(place => {
        const {latitude: lat, longitude: lon} = place;
        const distance = GetDistance(latitude, longitude, lat, lon);
        return {...place, distance};
      });
      const sortedPlaces = places.sort(
        (a, b) => a.distance - b.distance,
      ) as Array<PlaceExtended>;
      setData(sortedPlaces);
      addEventListener(() => {
        navigate('Detail', {id: undefined});
      });
    });
  }, []);

  const parseThousands = (num: number) => {
    return num >= 1000 ? `${Math.round(num / 100) / 10}K` : String(num);
  };

  const navigateToDetail = (id: number) => {
    navigate('Detail', {id: id});
  };

  const renderItem = ({item}: {item: PlaceExtended}) => {
    return (
      <TouchableOpacity onPress={() => navigateToDetail(item.id)}>
        <View style={styles.item}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.distance}>
            {parseThousands(item.distance)} km
          </Text>
          <Image style={styles.image} source={{uri: item.image}} />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={data}
        extraData={data}
        keyExtractor={item => item.id + ''}
        renderItem={renderItem}
        onEndReachedThreshold={0.7}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  distance: {
    fontSize: 14,
    color: '#666',
  },
  image: {
    width: '100%',
    height: 200,
  },
});
