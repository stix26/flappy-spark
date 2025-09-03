import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Image } from 'react-native';
import { GAME_CONFIG } from '@/constants/gameConfig';

interface SparkProps {
  y: Animated.Value;
  x: number;
}

const SparkComponent: React.FC<SparkProps> = ({ y, x }) => {
  const wingAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const trailAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Wing flapping animation
    const wingFlap = Animated.loop(
      Animated.sequence([
        Animated.timing(wingAnimation, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(wingAnimation, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ])
    );

    // Pulsing glow animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    // Trail animation
    const trail = Animated.loop(
      Animated.timing(trailAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );

    wingFlap.start();
    pulse.start();
    trail.start();

    return () => {
      wingFlap.stop();
      pulse.stop();
      trail.stop();
    };
  }, [wingAnimation, pulseAnimation, trailAnimation]);

  const wingRotation = wingAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '15deg'],
  });

  const trailOpacity = trailAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 0.3, 0],
  });

  const trailScale = trailAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1.5],
  });

  return (
    <Animated.View
      style={[
        styles.spark,
        {
          transform: [
            { translateX: x - GAME_CONFIG.SPARK_SIZE / 2 },
            { translateY: Animated.subtract(y, GAME_CONFIG.SPARK_SIZE / 2) },
          ],
        },
      ]}
      testID="spark"
    >
      {/* Magical trail particles */}
      <Animated.View
        style={[
          styles.trailParticle,
          styles.trail1,
          {
            opacity: trailOpacity,
            transform: [{ scale: trailScale }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.trailParticle,
          styles.trail2,
          {
            opacity: trailOpacity,
            transform: [{ scale: trailScale }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.trailParticle,
          styles.trail3,
          {
            opacity: trailOpacity,
            transform: [{ scale: trailScale }],
          },
        ]}
      />

      {/* Outer glow */}
      <Animated.View
        style={[
          styles.outerGlow,
          {
            transform: [{ scale: pulseAnimation }],
          },
        ]}
      />

      {/* Beautiful butterfly character */}
      <Animated.View
        style={[
          styles.butterflyContainer,
          {
            transform: [
              { rotate: wingRotation },
              { scale: pulseAnimation },
              { scaleX: -1 },
            ],
          },
        ]}
      >
        <Image
          source={require('@/assets/images/butterfly.png')}
          style={styles.butterflyImage}
          resizeMode="contain"
        />
      </Animated.View>
    </Animated.View>
  );
};

SparkComponent.displayName = 'Spark';

export const Spark = React.memo(SparkComponent);

const styles = StyleSheet.create({
  spark: {
    position: 'absolute',
    width: GAME_CONFIG.SPARK_SIZE * 2,
    height: GAME_CONFIG.SPARK_SIZE * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Trail particles
  trailParticle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
  },
  trail1: {
    left: -15,
    top: 5,
    backgroundColor: '#FF6B6B',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  trail2: {
    left: -20,
    top: 12,
    backgroundColor: '#4ECDC4',
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  trail3: {
    left: -12,
    top: 18,
    backgroundColor: '#45B7D1',
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },

  // Glows
  outerGlow: {
    position: 'absolute',
    width: GAME_CONFIG.SPARK_SIZE * 3,
    height: GAME_CONFIG.SPARK_SIZE * 3,
    borderRadius: GAME_CONFIG.SPARK_SIZE * 1.5,
    backgroundColor: '#FFD700',
    opacity: 0.1,
  },

  // Butterfly
  butterflyContainer: {
    position: 'absolute',
    width: GAME_CONFIG.SPARK_SIZE * 1.8,
    height: GAME_CONFIG.SPARK_SIZE * 1.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  butterflyImage: {
    width: '100%',
    height: '100%',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
});