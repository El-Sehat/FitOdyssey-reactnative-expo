import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface StartButtonProps {
  size: number;
  onPress: () => void;
  containerStyle?: ViewStyle;
  colors?: readonly [string, string, ...string[]];
  shadowColor?: string;
}

const StartButton: React.FC<StartButtonProps> = ({
  size,
  onPress,
  containerStyle,
  colors = ['#FF3B5F', '#FF2E56', '#D42145'] as const,
  shadowColor = '#FF3B5F',
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          shadowColor,
        },
        containerStyle,
      ]}
      onPress={onPress}
      activeOpacity={0.8}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradientContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}>
        {/* Play Icon */}
        <View
          style={[
            styles.triangle,
            {
              borderLeftWidth: size * 0.28,
              marginLeft: size * 0.08,
            },
          ]}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderLeftWidth: 20,
    borderStyle: 'solid',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'white',
  },
});

export default StartButton;
