import React, {createContext, useEffect, useRef, useState} from 'react';
import * as Notifications from 'expo-notifications';
import {Alert, AppState} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import {Data, Geoloc} from '../../utils';
const {GetDistance} = Geoloc;

const LOCATION_TASK_NAME = 'background-location-task';

export interface ProviderProps {
  children: React.ReactNode;
}

export interface Place {
  id: number;
  name: string;
  address: string;
  number: string;
  city: string;
  longitude: number;
  latitude: number;
  menu: Array<any>;
  webview: string | null;
  image: string;
}
export interface ContextProps {
  scheduleNotification: () => void;
  place: Array<Place>;
  addEventListener: (callback: Function) => void;
  coords: {lat: number; lon: number};
}

export const CoreContext = createContext<ContextProps>({} as ContextProps);

const CoreProvider = ({children}: ProviderProps) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [place, setPlace] = useState<Array<Place>>([]);
  const [coords, setCoords] = useState({lat: 0, lon: 0});

  const registerTask = async () => {
    const {status} = await Location.getBackgroundPermissionsAsync();
    if (status === 'granted') {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
      });
    }
  };

  const requestPermissionsAsync = async () => {
    return await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });
  };

  const allowsNotificationsAsync = async () => {
    const settings = await Notifications.getPermissionsAsync();
    return (
      settings.granted ||
      settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    );
  };

  const setNotificationHandler = async () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  };

  const scheduleNotification = async (
    title: string = 'Notificacion de prueba',
    body: string = 'Esta es una notificacion de prueba',
  ) => {
    const canNotify = await allowsNotificationsAsync();
    if (canNotify) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
        },
        trigger: null,
      });
    }
  };

  const findMenu = (latitude: number, logintude: number) => {
    const places = Data.filter(place => {
      const {latitude: lat, longitude: lon} = place;
      setCoords({lat, lon});
      const distance = GetDistance(latitude, logintude, lat, lon);
      if (distance < 0.5) {
        scheduleNotification();
        return place as Place;
      }
    });
    setPlace(places);
  };

  TaskManager.defineTask(
    LOCATION_TASK_NAME,
    ({data, error}: {data: any; error: any}) => {
      if (error) {
        console.log({error});
        // Error occurred - check `error.message` for more details.
        return;
      }

      if (data && appStateVisible === 'background') {
        const {locations} = data;
        const {coords} = locations[0];
        const {latitude, longitude} = coords;
        setCoords({lat: latitude, lon: longitude});
        findMenu(latitude, longitude);
      }
    },
  );

  const addEventListener = (callback: Function) => {
    Notifications.addNotificationResponseReceivedListener(notification => {
      callback();
    });
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    requestPermissionsAsync();
    setNotificationHandler();
    registerTask();
  }, []);

  return (
    <CoreContext.Provider
      value={{scheduleNotification, place, addEventListener, coords}}>
      {children}
    </CoreContext.Provider>
  );
};

export default CoreProvider;
