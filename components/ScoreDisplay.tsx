import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ScoreDisplayProps {
  score: number;
  topInset: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = React.memo(({ score, topInset }) => {
  return (
    <View style={[styles.container, { top: topInset + 20 }]}>
      <Text style={styles.score}>{score}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  score: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
});