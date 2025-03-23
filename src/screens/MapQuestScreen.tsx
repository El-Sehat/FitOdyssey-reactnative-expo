import { Ionicons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Location from 'expo-location';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, UrlTile, Marker, Region } from 'react-native-maps';

type RootStackParamList = {
  SplashScreen: undefined;
  Login: undefined;
  Register: undefined;
  MainApp: { screen?: string };
  MapQuest: undefined;
};

const MapQuestScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const mapRef = useRef<MapView | null>(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [followingUser, setFollowingUser] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        Alert.alert(
          'Permission Denied',
          'Please enable location services to use the map tracking feature.',
          [{ text: 'OK' }],
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
          timeInterval: 5000,
        },
        (newLocation) => {
          setLocation(newLocation);
          if (followingUser && mapRef.current) {
            centerMapOnLocation(newLocation);
          }
        },
      );

      return () => {
        locationSubscription.remove();
      };
    })();
  }, [followingUser]);

  const centerMapOnLocation = (locationObj: Location.LocationObject) => {
    const region: Region = {
      latitude: locationObj.coords.latitude,
      longitude: locationObj.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };

    mapRef.current?.animateToRegion(region, 500);
  };

  const handleRecenterMap = () => {
    if (location) {
      setFollowingUser(true);
      centerMapOnLocation(location);
    }
  };

  const initialRegion = {
    latitude: location?.coords.latitude || -6.2088,
    longitude: location?.coords.longitude || 106.8456,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const navigateToTab = (tabName: string) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'MainApp',
            params: { screen: tabName },
          },
        ],
      }),
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View className="flex-1 overflow-hidden">
        {mapLoading && (
          <View className="absolute z-10 flex h-full w-full items-center justify-center bg-gray-800/50">
            <ActivityIndicator size="large" color="#ec4899" />
            <Text className="mt-2 text-white">Loading map...</Text>
          </View>
        )}

        {mapError ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg text-white">Unable to load map</Text>
            <TouchableOpacity
              className="mt-4 rounded-full bg-pink-500 px-4 py-2"
              onPress={() => setMapError(false)}>
              <Text className="text-white">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={initialRegion}
            onMapReady={() => setMapLoading(false)}
            mapType="standard"
            showsUserLocation
            showsMyLocationButton={false}
            followsUserLocation={followingUser}
            onPanDrag={() => setFollowingUser(false)}>
            <UrlTile
              urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
              flipY={false}
              tileSize={256}
              zIndex={-1}
            />

            {location && (
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="You are here"
                pinColor="#ec4899"
              />
            )}
          </MapView>
        )}

        <TouchableOpacity
          style={styles.recenterButton}
          onPress={handleRecenterMap}
          className="absolute bottom-24 right-6 rounded-full bg-pink-500 p-3 shadow-lg">
          <Ionicons name="locate" size={24} color="white" />
        </TouchableOpacity>

        {/* Permission Denied Message */}
        {permissionDenied && (
          <View className="absolute bottom-24 left-4 right-4 rounded-lg bg-red-500/80 p-3">
            <Text className="text-center text-white">
              Location permission required to track your position
            </Text>
          </View>
        )}
      </View>

      {/* Custom Tab Navigator */}
      <View style={styles.tabNavigatorContainer}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#161643',
            borderRadius: 30,
            height: 70,
            marginHorizontal: 10,
            marginBottom: 10,
            alignItems: 'center',
            paddingHorizontal: 15,
          }}>
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => navigateToTab('Beranda')}>
            <Text style={{ color: '#6B7280', fontSize: 14 }}>Beranda</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => navigateToTab('Quest')}>
            <Text style={{ color: '#6B7280', fontSize: 14 }}>Quest</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 70,
              height: 70,
              backgroundColor: '#FF3B5F',
              borderRadius: 35,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 12,
              shadowColor: '#FF3B5F',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 10,
              elevation: 8,
            }}
            onPress={() => {
            }}>
            <View
              style={{
                width: 0,
                height: 0,
                borderTopWidth: 12,
                borderBottomWidth: 12,
                borderLeftWidth: 20,
                borderStyle: 'solid',
                borderTopColor: 'transparent',
                borderBottomColor: 'transparent',
                borderLeftColor: 'white',
                marginLeft: 5,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => navigateToTab('Aktivitas')}>
            <Text style={{ color: '#6B7280', fontSize: 14 }}>Aktivitas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => navigateToTab('Shop')}>
            <Text style={{ color: '#6B7280', fontSize: 14 }}>Shop</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  recenterButton: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  tabNavigatorContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
});

export default MapQuestScreen;
