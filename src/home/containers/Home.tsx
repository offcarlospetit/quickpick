import React, {useEffect} from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {Data, Geoloc} from '../../utils';
import GeoLocalization from '../../utils/GeoLocalization';
const {GetDistance} = Geoloc;

type Props = {};

const Home = (props: Props) => {
  const [data, setData] = React.useState<any>([]);
  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      const {latitude, longitude} = info.coords;
      const places = Data.map(place => {
        const {latitude: lat, longitude: lon} = place;
        const distance = GetDistance(latitude, longitude, lat, lon);
        return {...place, distance};
      });
      const sortedPlaces = places.sort((a, b) => a.distance - b.distance);
      setData(sortedPlaces);
    });
  }, []);

  const renderItem = ({item}: {item: any}) => {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.distance}>{item.distance} km</Text>
        <Image style={styles.image} source={{uri: item.image}} />
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <FlatList data={data} renderItem={renderItem} />
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
