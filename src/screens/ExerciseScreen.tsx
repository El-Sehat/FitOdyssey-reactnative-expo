import { FontAwesome5 } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '~/navigation';

type ExerciseScreenRouteProp = RouteProp<RootStackParamList, 'Exercise'>;
type ExerciseScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ExerciseScreen = () => {
  const route = useRoute<ExerciseScreenRouteProp>();
  const navigation = useNavigation<ExerciseScreenNavigationProp>();
  const { quest } = route.params || { quest: { name: 'Exercise', id: 0 } };

  // Camera states
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [cameraType, setCameraType] = useState<CameraType>('front');

  // Exercise states
  const [timer, setTimer] = useState(0);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false);

  // Request permissions on component mount
  useEffect(() => {
    requestPermission();
  }, []);

  // Timer for countdown before exercise
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (exerciseStarted && countdownActive) {
      // Start a countdown timer
      setTimer(3);
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setCountdownActive(false);
            startExerciseTimer();
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [exerciseStarted, countdownActive]);

  // Timer for exercise duration
  useEffect(() => {
    let exerciseInterval: NodeJS.Timeout;

    if (exerciseStarted && !countdownActive && !exerciseCompleted) {
      setTimer(0);
      exerciseInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }

    return () => {
      if (exerciseInterval) clearInterval(exerciseInterval);
    };
  }, [exerciseStarted, countdownActive, exerciseCompleted]);

  const handleGoBack = () => {
    if (exerciseStarted && !exerciseCompleted) {
      Alert.alert(
        'Stop Exercise?',
        'Are you sure you want to stop your exercise? Your progress will be lost.',
        [
          { text: 'Continue Exercise', style: 'cancel' },
          {
            text: 'Stop Exercise',
            style: 'destructive',
            onPress: () => {
              navigation.goBack();
            },
          },
        ],
      );
    } else {
      navigation.goBack();
    }
  };

  const toggleCameraType = () => {
    setCameraType((current) => (current === 'front' ? 'back' : 'front'));
  };

  const startExercise = () => {
    setExerciseStarted(true);
    setCountdownActive(true);
  };

  const startExerciseTimer = () => {
    setTimer(0);
  };

  const completeExercise = () => {
    setExerciseCompleted(true);

    // Display success message
    Alert.alert(
      'Exercise Completed',
      'Congratulations! You have completed this exercise successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Here you would update the quest status as completed
            // For example: updateQuestStatus(quest.id, 'completed');
            navigation.goBack();
          },
        },
      ],
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#9333EA" />
        <Text style={styles.infoText}>Checking camera permissions...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.infoText}>We need camera permission to track your exercises</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      {/* Camera View */}
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        facing={cameraType}
        videoStabilizationMode="auto">
        {/* Top Bar - Exercise Info */}
        <SafeAreaView style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <FontAwesome5 name="chevron-left" size={22} color="white" />
          </TouchableOpacity>

          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>{quest.name || 'Exercise'}</Text>
            <Text style={styles.exerciseTimer}>
              {exerciseStarted
                ? countdownActive
                  ? `Starting in ${timer}`
                  : formatTime(timer)
                : 'Press Start to begin'}
            </Text>
          </View>

          <TouchableOpacity style={styles.cameraToggle} onPress={toggleCameraType}>
            <FontAwesome5 name="sync" size={22} color="white" />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Movement Guidelines Overlay */}
        {exerciseStarted && (
          <View style={styles.guidelinesOverlay}>
            <View style={styles.guideShape} />
          </View>
        )}

        {/* Bottom Controls */}
        <View style={styles.controlsContainer}>
          {!exerciseStarted ? (
            <TouchableOpacity style={styles.startButton} onPress={startExercise}>
              <Text style={styles.startButtonText}>Start Exercise</Text>
            </TouchableOpacity>
          ) : countdownActive ? (
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>{timer}</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.completeButton} onPress={completeExercise}>
              <Text style={styles.completeButtonText}>Complete Exercise</Text>
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backButton: {
    padding: 8,
  },
  exerciseInfo: {
    alignItems: 'center',
  },
  exerciseName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseTimer: {
    color: 'white',
    fontSize: 14,
  },
  cameraToggle: {
    padding: 8,
  },
  guidelinesOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideShape: {
    width: width * 0.5,
    height: height * 0.6,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 20,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#9333EA',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#10B981', // Green color for success
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  countdownContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  countdownText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#9333EA',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExerciseScreen;
