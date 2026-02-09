import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  interpolateColor 
} from 'react-native-reanimated';
import { useAppSelector } from '../hooks/useAppSelector';

export const SkeletonCard = () => {
  const { darkMode } = useAppSelector(state => state.theme);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      shimmer.value,
      [0, 1],
      darkMode ? ['#1A1A1A', '#2A2A2A'] : ['#E5E7EB', '#F3F4F6']
    );
    return { backgroundColor };
  });

  return (
    <View className={`p-6 rounded-[32px] mb-4 border ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
      <View className="flex-row items-center mb-4">
        <Animated.View style={animatedStyle} className="w-12 h-12 rounded-2xl" />
        <View className="ml-4 flex-1">
          <Animated.View style={animatedStyle} className="h-4 w-3/4 rounded-lg mb-2" />
          <Animated.View style={animatedStyle} className="h-3 w-1/2 rounded-lg" />
        </View>
      </View>
      <Animated.View style={animatedStyle} className="h-3 w-full rounded-lg" />
    </View>
  );
};