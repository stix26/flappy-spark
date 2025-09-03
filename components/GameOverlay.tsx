import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { GameState } from '@/types/game';

interface GameOverlayProps {
  gameState: GameState;
  score: number;
  bestScore: number;
  topInset: number;
}

export const GameOverlay: React.FC<GameOverlayProps> = React.memo(function GameOverlay({ 
  gameState, 
  score, 
  bestScore,
  topInset 
}) {
  const opacity = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (gameState === 'playing') {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [gameState, opacity]);

  if (gameState === 'playing') {
    return null;
  }

  return (
    <Animated.View 
      style={[
        styles.overlay,
        { opacity, paddingTop: topInset + 100 }
      ]}
      pointerEvents="auto"
    >
      <View style={styles.content}>
        {gameState === 'waiting' && (
          <>
            <Text style={styles.title}>Flappy Spark</Text>
            <Text style={styles.subtitle}>Tap to Start</Text>
            <View style={styles.instructions}>
              <Text style={styles.instructionText}>🌟 Tap to make the spark fly</Text>
              <Text style={styles.instructionText}>🚧 Avoid the pipes</Text>
              <Text style={styles.instructionText}>🏆 Beat your high score</Text>
            </View>
          </>
        )}
        
        {gameState === 'gameOver' && (
          <>
            <Text style={styles.gameOverTitle}>Game Over</Text>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Score</Text>
              <Text style={styles.scoreValue}>{score}</Text>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={styles.bestLabel}>Best</Text>
              <Text style={styles.bestValue}>{bestScore}</Text>
            </View>
            <Text style={styles.restartText}>Tap to Restart</Text>
          </>
        )}
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    padding: 30,
    minWidth: 280,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
    textShadowColor: '#FFA500',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 30,
    opacity: 0.9,
  },
  instructions: {
    marginTop: 20,
    gap: 10,
  },
  instructionText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  gameOverTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  scoreLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: '#FFA500',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  bestLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  bestValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00CC66',
  },
  restartText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 30,
    opacity: 0.9,
  },
});