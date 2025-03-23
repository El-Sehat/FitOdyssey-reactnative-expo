import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator, Animated, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import io from 'socket.io-client';
import { WSOCKET_SERVER_URL } from '../../.env.js';

const SOCKET_SERVER_URL = WSOCKET_SERVER_URL;

type Geofence = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
};

const MapQuestScreen = () => {
  const mapRef = useRef<MapView | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [insideGeofence, setInsideGeofence] = useState<boolean>(false);
  const [activeGeofence, setActiveGeofence] = useState<Geofence | null>(null);
  
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Enable location to use the map.');
        setLoading(false);
        return;
      }

      const initialLocation = await Location.getCurrentPositionAsync({});
      setLocation(initialLocation);
      setLoading(false);

      const locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10, timeInterval: 5000 },
        (newLocation) => {
          setLocation(newLocation);
          socket?.emit('check-location', {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            userId: '123',
          });
        }
      );

      return () => locationSubscription.remove();
    })();

    const newSocket = io(SOCKET_SERVER_URL,{
      path: '/api/map-be/socket.io'
    }

);
    
    newSocket.on('geofence-alert', (data) => {
      setInsideGeofence(true);
      showModal(); 
    });

    newSocket.on('geofence-data', (geofenceData: Geofence[]) => {
      console.log('Received geofences:', geofenceData);
      setGeofences(geofenceData);
    });

    newSocket.on('connect', () => {
      console.log('Socket connected, requesting geofences');
      newSocket.emit('get-geofences');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (location && geofences.length > 0) {
      const userLat = location.coords.latitude;
      const userLng = location.coords.longitude;
      
      for (const fence of geofences) {
        const distance = getDistanceFromLatLonInM(
          userLat, 
          userLng, 
          fence.latitude, 
          fence.longitude
        );
        
        if (distance <= fence.radius) {
          setInsideGeofence(true);
          setActiveGeofence(fence);
          showModal(); 
          return;
        }
      }
      
      if (insideGeofence) {
        hideModal(); 
      }
      
      setInsideGeofence(false);
      setActiveGeofence(null);
    }
  }, [location, geofences]);

  const getDistanceFromLatLonInM = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-row items-center justify-center px-4 pt-4 pb-2">
        <Text className="text-white text-lg font-bold">Map Quest</Text>
        {activeGeofence && (
          <View className="ml-4 px-2 py-1 bg-pink-600 rounded-md">
            <Text className="text-white text-xs">In: {activeGeofence.name}</Text>
          </View>
        )}
      </View>

      <View className="flex-1 overflow-hidden">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#ec4899" />
            <Text className="text-white mt-4">Getting your location...</Text>
          </View>
        ) : location ? (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{ width: '100%', height: '100%' }}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            showsUserLocation={true}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
              pinColor="#ec4899"
            />
            
            {geofences.map((geofence) => (
              <React.Fragment key={geofence.id}>
                <Circle
                  center={{
                    latitude: geofence.latitude,
                    longitude: geofence.longitude,
                  }}
                  radius={geofence.radius}
                  strokeWidth={2}
                  strokeColor={activeGeofence?.id === geofence.id ? "rgba(255, 0, 0, 0.8)" : "rgba(0, 128, 255, 0.8)"}
                  fillColor={activeGeofence?.id === geofence.id ? "rgba(255, 0, 0, 0.2)" : "rgba(0, 128, 255, 0.2)"}
                />
                <Marker
                  coordinate={{
                    latitude: geofence.latitude,
                    longitude: geofence.longitude,
                  }}
                  title={geofence.name}
                  pinColor="#0088ff"
                />
              </React.Fragment>
            ))}
          </MapView>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white">Unable to get location</Text>
          </View>
        )}

        {location && (
          <TouchableOpacity
            style={{ position: 'absolute', bottom: 24, right: 16, backgroundColor: '#ec4899', padding: 12, borderRadius: 50 }}
            onPress={() => {
              if (location) {
                mapRef.current?.animateToRegion({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                });
              }
            }}
          >
            <Ionicons name="locate" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {modalVisible && (
        <Animated.View 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#1e293b',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            zIndex: 1000,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <View className="items-center mb-4">
            <View className="w-16 h-1.5 bg-gray-500 rounded-full" />
          </View>

          <View className="items-center mb-6">
            <Text className="text-white text-xl font-bold mb-2">
              {activeGeofence ? `You're in ${activeGeofence.name}!` : "You're in a hotspot!"}
            </Text>
            <Text className="text-gray-300 text-center">
              You've discovered a fitness challenge zone. Ready to begin your challenge?
            </Text>
          </View>

          <TouchableOpacity
            className="bg-pink-600 py-3 px-6 rounded-full items-center"
            onPress={() => {
              Alert.alert("Challenge Started!", "Good luck on your fitness journey!");
              hideModal();
            }}
          >
            <Text className="text-white font-bold text-lg">START CHALLENGE</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="mt-3 py-3 px-6 items-center"
            onPress={hideModal}
          >
            <Text className="text-gray-400">Maybe later</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default MapQuestScreen;
