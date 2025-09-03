import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  Platform,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { GameState, Pipe } from '@/types/game';
import { GAME_CONFIG } from '@/constants/gameConfig';
import { Spark } from '@/components/Spark';
import { PipeComponent } from '@/components/Pipe';
import { GameOverlay } from '@/components/GameOverlay';
import { ScoreDisplay } from '@/components/ScoreDisplay';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function FlappySparkGame() {
  const insets = useSafeAreaInsets();
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  
  // Spark position and velocity
  const sparkY = useRef(new Animated.Value(SCREEN_HEIGHT / 2)).current;
  const sparkVelocity = useRef(0);
  const sparkYValue = useRef(SCREEN_HEIGHT / 2);
  
  // Pipes
  const [pipes, setPipes] = useState<Pipe[]>([]);

  const pipesRef = useRef<Pipe[]>([]);
  
  // Animation loop
  const animationFrame = useRef<number | null>(null);
  const lastFrameTime = useRef(Date.now());

  // Initialize game
  const initializeGame = useCallback(() => {
    console.log('Initializing game');
    sparkVelocity.current = 0;
    sparkYValue.current = SCREEN_HEIGHT / 2;
    sparkY.setValue(SCREEN_HEIGHT / 2);
    
    // Generate initial pipes
    const initialPipes: Pipe[] = [];
    for (let i = 0; i < 3; i++) {
      const gapY = Math.random() * (SCREEN_HEIGHT - GAME_CONFIG.GAP_SIZE - 200) + 100;
      initialPipes.push({
        x: SCREEN_WIDTH + i * GAME_CONFIG.PIPE_SPACING,
        gapY,
        passed: false,
      });
    }
    setPipes(initialPipes);
    pipesRef.current = initialPipes;
    setScore(0);
  }, [sparkY]);

  // Handle tap/flap
  const handleFlap = useCallback(() => {
    console.log('Flap! Current state:', gameState);
    
    if (gameState === 'waiting') {
      setGameState('playing');
      sparkVelocity.current = GAME_CONFIG.FLAP_VELOCITY;
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else if (gameState === 'playing') {
      sparkVelocity.current = GAME_CONFIG.FLAP_VELOCITY;
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else if (gameState === 'gameOver') {
      // Restart game
      initializeGame();
      setGameState('waiting');
    }
  }, [gameState, initializeGame]);

  // Check collision
  const checkCollision = useCallback((sparkPos: number, currentPipes: Pipe[]): boolean => {
    // Check ground and ceiling collision
    if (sparkPos <= GAME_CONFIG.SPARK_SIZE / 2 + insets.top || 
        sparkPos >= SCREEN_HEIGHT - GAME_CONFIG.SPARK_SIZE / 2 - insets.bottom) {
      return true;
    }

    // Check pipe collision
    for (const pipe of currentPipes) {
      const pipeLeft = pipe.x - GAME_CONFIG.PIPE_WIDTH / 2;
      const pipeRight = pipe.x + GAME_CONFIG.PIPE_WIDTH / 2;
      const sparkLeft = GAME_CONFIG.SPARK_X - GAME_CONFIG.SPARK_SIZE / 2;
      const sparkRight = GAME_CONFIG.SPARK_X + GAME_CONFIG.SPARK_SIZE / 2;

      // Check if spark overlaps with pipe horizontally
      if (sparkRight > pipeLeft && sparkLeft < pipeRight) {
        const gapTop = pipe.gapY;
        const gapBottom = pipe.gapY + GAME_CONFIG.GAP_SIZE;
        const sparkTop = sparkPos - GAME_CONFIG.SPARK_SIZE / 2;
        const sparkBottom = sparkPos + GAME_CONFIG.SPARK_SIZE / 2;

        // Check if spark is outside the gap
        if (sparkTop < gapTop || sparkBottom > gapBottom) {
          return true;
        }
      }
    }

    return false;
  }, [insets.top, insets.bottom]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    const now = Date.now();
    const deltaTime = (now - lastFrameTime.current) / 1000; // Convert to seconds
    lastFrameTime.current = now;

    // Update spark physics
    sparkVelocity.current += GAME_CONFIG.GRAVITY * deltaTime;
    sparkVelocity.current = Math.min(sparkVelocity.current, GAME_CONFIG.MAX_FALL_SPEED);
    sparkYValue.current += sparkVelocity.current * deltaTime;
    
    // Update spark animation
    sparkY.setValue(sparkYValue.current);

    // Update pipes
    const updatedPipes = pipesRef.current.map(pipe => ({
      ...pipe,
      x: pipe.x - GAME_CONFIG.PIPE_SPEED * deltaTime,
    }));

    // Check for passed pipes and update score
    let newScore = score;
    updatedPipes.forEach(pipe => {
      if (!pipe.passed && pipe.x < GAME_CONFIG.SPARK_X) {
        pipe.passed = true;
        newScore++;
        console.log('Score:', newScore);
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    });

    if (newScore !== score) {
      setScore(newScore);
    }

    // Remove off-screen pipes and add new ones
    const filteredPipes = updatedPipes.filter(pipe => pipe.x > -GAME_CONFIG.PIPE_WIDTH);
    
    // Add new pipe if needed
    if (filteredPipes.length < 3) {
      const lastPipe = filteredPipes[filteredPipes.length - 1];
      const gapY = Math.random() * (SCREEN_HEIGHT - GAME_CONFIG.GAP_SIZE - 200) + 100;
      filteredPipes.push({
        x: lastPipe ? lastPipe.x + GAME_CONFIG.PIPE_SPACING : SCREEN_WIDTH,
        gapY,
        passed: false,
      });
    }

    pipesRef.current = filteredPipes;
    setPipes(filteredPipes);

    // Check collision
    if (checkCollision(sparkYValue.current, filteredPipes)) {
      console.log('Game Over! Final score:', newScore);
      setGameState('gameOver');
      if (newScore > bestScore) {
        setBestScore(newScore);
      }
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    // Continue game loop
    animationFrame.current = requestAnimationFrame(gameLoop);
  }, [gameState, sparkY, score, bestScore, checkCollision]);

  // Start/stop game loop based on game state
  useEffect(() => {
    if (gameState === 'playing') {
      console.log('Starting game loop');
      lastFrameTime.current = Date.now();
      animationFrame.current = requestAnimationFrame(gameLoop);
    } else {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    }

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [gameState, gameLoop]);

  // Initialize on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <TouchableWithoutFeedback onPress={handleFlap}>
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/iya5itiadqdymirilkmn6' }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
        
        {/* Pipes */}
        {pipes.map((pipe, index) => (
          <PipeComponent
            key={index}
            x={pipe.x}
            gapY={pipe.gapY}
            screenHeight={SCREEN_HEIGHT}
            topInset={insets.top}
            bottomInset={insets.bottom}
          />
        ))}
        
        {/* Spark */}
        <Spark y={sparkY} x={GAME_CONFIG.SPARK_X} />
        
        {/* Score */}
        <ScoreDisplay score={score} topInset={insets.top} />
        
        {/* Game Overlay */}
        <GameOverlay
          gameState={gameState}
          score={score}
          bestScore={bestScore}
          topInset={insets.top}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});