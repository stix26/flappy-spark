import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GAME_CONFIG } from '@/constants/gameConfig';

interface PipeComponentProps {
  x: number;
  gapY: number;
  screenHeight: number;
  topInset: number;
  bottomInset: number;
}

const PipeComponentInner: React.FC<PipeComponentProps> = ({ 
  x, 
  gapY, 
  screenHeight,
  topInset,
  bottomInset 
}) => {
  const topPipeHeight = gapY;
  const bottomPipeY = gapY + GAME_CONFIG.GAP_SIZE;
  const bottomPipeHeight = screenHeight - bottomPipeY;
  
  // Animation for water drips
  const dropAnim1 = useRef(new Animated.Value(0)).current;
  const dropAnim2 = useRef(new Animated.Value(0)).current;
  const dropOpacity1 = useRef(new Animated.Value(0)).current;
  const dropOpacity2 = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const animateDrops = () => {
      // First drop animation
      Animated.sequence([
        Animated.delay(Math.random() * 3000),
        Animated.parallel([
          Animated.timing(dropOpacity1, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(dropAnim1, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(dropOpacity1, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        dropAnim1.setValue(0);
        animateDrops();
      });
      
      // Second drop animation (offset timing)
      setTimeout(() => {
        Animated.sequence([
          Animated.delay(Math.random() * 2000),
          Animated.parallel([
            Animated.timing(dropOpacity2, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(dropAnim2, {
              toValue: 1,
              duration: 1800,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(dropOpacity2, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start(() => {
          dropAnim2.setValue(0);
        });
      }, 1000);
    };
    
    animateDrops();
  }, [dropAnim1, dropAnim2, dropOpacity1, dropOpacity2]);

  const renderPipeTexture = (isTop: boolean, pipeHeight: number) => (
    <>
      {/* Main cylindrical gradient - weathered bronze/copper */}
      <LinearGradient
        colors={isTop ? 
          [GAME_CONFIG.PIPE_HIGHLIGHT, GAME_CONFIG.PIPE_BASE, GAME_CONFIG.PIPE_SHADOW] :
          [GAME_CONFIG.PIPE_SHADOW, GAME_CONFIG.PIPE_BASE, GAME_CONFIG.PIPE_HIGHLIGHT]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Enhanced cylindrical shading for roundness */}
      <View style={styles.leftHighlight} />
      <View style={styles.rightShadow} />
      <View style={styles.centerHighlight} />
      
      {/* Horizontal joint bands like in reference */}
      {pipeHeight > 80 && (
        <>
          <View style={[styles.jointBand, { top: pipeHeight * 0.25 }]}>
            <LinearGradient
              colors={[GAME_CONFIG.JOINT_HIGHLIGHT, GAME_CONFIG.JOINT_DARK]}
              style={StyleSheet.absoluteFillObject}
            />
            {/* Joint bolts */}
            <View style={[styles.jointBolt, { left: '20%' }]} />
            <View style={[styles.jointBolt, { left: '50%' }]} />
            <View style={[styles.jointBolt, { left: '80%' }]} />
          </View>
          {pipeHeight > 150 && (
            <View style={[styles.jointBand, { top: pipeHeight * 0.75 }]}>
              <LinearGradient
                colors={[GAME_CONFIG.JOINT_HIGHLIGHT, GAME_CONFIG.JOINT_DARK]}
                style={StyleSheet.absoluteFillObject}
              />
              {/* Joint bolts */}
              <View style={[styles.jointBolt, { left: '20%' }]} />
              <View style={[styles.jointBolt, { left: '50%' }]} />
              <View style={[styles.jointBolt, { left: '80%' }]} />
            </View>
          )}
        </>
      )}
      
      {/* Vertical seams and wear lines */}
      <View style={[styles.seam, { left: '15%' }]} />
      <View style={[styles.seam, { left: '85%' }]} />
      <View style={[styles.wearLine, { left: '25%' }]} />
      <View style={[styles.wearLine, { left: '60%' }]} />
      
      {/* Rust streaks - vertical like in reference */}
      <View style={[styles.rustStreak, { top: '20%', left: '12%' }]}>
        <LinearGradient
          colors={[GAME_CONFIG.RUST_PRIMARY, GAME_CONFIG.RUST_SECONDARY]}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      <View style={[styles.rustStreakSmall, { top: '45%', right: '18%' }]}>
        <LinearGradient
          colors={[GAME_CONFIG.RUST_SECONDARY, GAME_CONFIG.RUST_PRIMARY]}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      <View style={[styles.rustStreakSmall, { top: '70%', left: '35%' }]}>
        <LinearGradient
          colors={[GAME_CONFIG.RUST_PRIMARY, GAME_CONFIG.RUST_SECONDARY]}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      
      {/* Moss and algae patches - more organic like reference */}
      <View style={[styles.mossCluster, { top: '15%', left: '8%' }]}>
        <LinearGradient
          colors={[GAME_CONFIG.MOSS_PRIMARY, GAME_CONFIG.MOSS_SECONDARY]}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      <View style={[styles.algaePatch, { top: '40%', right: '12%' }]}>
        <LinearGradient
          colors={[GAME_CONFIG.ALGAE_PRIMARY, GAME_CONFIG.ALGAE_SECONDARY]}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      <View style={[styles.mossSmall, { top: '65%', left: '25%' }]}>
        <LinearGradient
          colors={[GAME_CONFIG.MOSS_SECONDARY, GAME_CONFIG.MOSS_PRIMARY]}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      
      {/* Hanging moss tendrils */}
      <View style={[styles.mossTendril, { top: '18%', left: '10%' }]} />
      <View style={[styles.mossTendrilSmall, { top: '42%', right: '15%' }]} />
      
      {/* Surface scratches and wear marks */}
      <View style={[styles.scratchLong, { top: '30%', left: '40%' }]} />
      <View style={[styles.scratchShort, { top: '55%', right: '30%' }]} />
      <View style={[styles.wearMark, { top: '75%', left: '50%' }]} />
    </>
  );

  return (
    <>
      {/* Top Pipe */}
      <View
        style={[
          styles.pipe,
          {
            left: x - GAME_CONFIG.PIPE_WIDTH / 2,
            top: 0,
            height: topPipeHeight,
          },
        ]}
        testID="pipe-top"
      >
        {renderPipeTexture(true, topPipeHeight)}
        
        {/* Pipe Cap - Enhanced like reference */}
        <View style={styles.pipeCapTop}>
          <LinearGradient
            colors={[GAME_CONFIG.PIPE_CAP_TOP, GAME_CONFIG.PIPE_CAP_BOTTOM]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          {/* Cap rim with depth */}
          <View style={styles.capRimTop} />
          <View style={styles.capRimInner} />
          {/* Cap bolts in circular pattern */}
          <View style={[styles.capBolt, { left: '15%', top: '30%' }]} />
          <View style={[styles.capBolt, { right: '15%', top: '30%' }]} />
          <View style={[styles.capBolt, { left: '15%', bottom: '30%' }]} />
          <View style={[styles.capBolt, { right: '15%', bottom: '30%' }]} />
          {/* Cap weathering */}
          <View style={[styles.capRust, { top: '20%', left: '25%' }]} />
          <View style={[styles.capMoss, { bottom: '25%', right: '30%' }]} />
        </View>
      </View>

      {/* Bottom Pipe */}
      <View
        style={[
          styles.pipe,
          {
            left: x - GAME_CONFIG.PIPE_WIDTH / 2,
            top: bottomPipeY,
            height: bottomPipeHeight,
          },
        ]}
        testID="pipe-bottom"
      >
        {renderPipeTexture(false, bottomPipeHeight)}
        
        {/* Pipe Cap - Enhanced like reference */}
        <View style={styles.pipeCapBottom}>
          <LinearGradient
            colors={[GAME_CONFIG.PIPE_CAP_BOTTOM, GAME_CONFIG.PIPE_CAP_TOP]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          {/* Cap rim with depth */}
          <View style={styles.capRimBottom} />
          <View style={styles.capRimInner} />
          {/* Cap bolts in circular pattern */}
          <View style={[styles.capBolt, { left: '15%', top: '30%' }]} />
          <View style={[styles.capBolt, { right: '15%', top: '30%' }]} />
          <View style={[styles.capBolt, { left: '15%', bottom: '30%' }]} />
          <View style={[styles.capBolt, { right: '15%', bottom: '30%' }]} />
          {/* Cap weathering */}
          <View style={[styles.capRust, { bottom: '20%', right: '25%' }]} />
          <View style={[styles.capMoss, { top: '25%', left: '30%' }]} />
        </View>
      </View>
      
      {/* Animated water drips */}
      <Animated.View
        style={[
          styles.waterDrop,
          {
            left: x - GAME_CONFIG.PIPE_WIDTH / 2 + 15,
            top: topPipeHeight + 32,
            opacity: dropOpacity1,
            transform: [
              {
                translateY: dropAnim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, GAME_CONFIG.GAP_SIZE - 40],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={[GAME_CONFIG.WATER_SHINE, GAME_CONFIG.WATER_DROP]}
          style={styles.dropGradient}
        />
        <View style={styles.dropShine} />
      </Animated.View>
      
      <Animated.View
        style={[
          styles.waterDrop,
          {
            left: x - GAME_CONFIG.PIPE_WIDTH / 2 + 35,
            top: topPipeHeight + 28,
            opacity: dropOpacity2,
            transform: [
              {
                translateY: dropAnim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, GAME_CONFIG.GAP_SIZE - 35],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={[GAME_CONFIG.WATER_SHINE, GAME_CONFIG.WATER_DROP]}
          style={styles.dropGradient}
        />
        <View style={styles.dropShine} />
      </Animated.View>
    </>
  );
};

PipeComponentInner.displayName = 'PipeComponent';

export const PipeComponent = React.memo(PipeComponentInner);

const styles = StyleSheet.create({
  pipe: {
    position: 'absolute',
    width: GAME_CONFIG.PIPE_WIDTH,
    borderRadius: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  
  // Enhanced cylindrical shading effects
  leftHighlight: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  rightShadow: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  centerHighlight: {
    position: 'absolute',
    left: '30%',
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  // Seams and structural details
  seam: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  jointLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  
  // Wear and weathering effects
  wearLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    opacity: 0.7,
  },
  
  // Enhanced rust patches
  rustPatchLarge: {
    position: 'absolute',
    width: 14,
    height: 20,
    borderRadius: 4,
    opacity: 0.6,
    overflow: 'hidden',
  },
  rustPatchSmall: {
    position: 'absolute',
    width: 8,
    height: 12,
    borderRadius: 3,
    opacity: 0.5,
    overflow: 'hidden',
  },
  
  // Organic moss and algae
  mossLarge: {
    position: 'absolute',
    width: 12,
    height: 16,
    borderRadius: 8,
    opacity: 0.7,
    overflow: 'hidden',
  },
  mossSmall: {
    position: 'absolute',
    width: 6,
    height: 9,
    borderRadius: 5,
    opacity: 0.6,
    overflow: 'hidden',
  },
  
  // Vine details
  vine: {
    position: 'absolute',
    width: 2,
    height: 25,
    backgroundColor: GAME_CONFIG.MOSS_PRIMARY,
    borderRadius: 1,
    opacity: 0.8,
    transform: [{ rotate: '15deg' }],
  },
  vineSmall: {
    position: 'absolute',
    width: 1,
    height: 15,
    backgroundColor: GAME_CONFIG.MOSS_SECONDARY,
    borderRadius: 1,
    opacity: 0.7,
    transform: [{ rotate: '-10deg' }],
  },
  
  // Industrial bolts with realistic detail
  boltLarge: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2F2F2F',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 3,
  },
  boltSmall: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#3A3A3A',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 2,
  },
  boltHead: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderRadius: 3,
    backgroundColor: '#4A4A4A',
    borderWidth: 0.5,
    borderColor: '#1A1A1A',
  },
  boltHeadSmall: {
    position: 'absolute',
    top: 0.5,
    left: 0.5,
    right: 0.5,
    bottom: 0.5,
    borderRadius: 2,
    backgroundColor: '#4A4A4A',
    borderWidth: 0.5,
    borderColor: '#1A1A1A',
  },
  boltHighlight: {
    position: 'absolute',
    top: 1,
    left: 1,
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  // Paint and surface marks
  paintMark: {
    position: 'absolute',
    width: 10,
    height: 6,
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
    borderRadius: 2,
    opacity: 0.4,
  },
  scratchMark: {
    position: 'absolute',
    width: 8,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    opacity: 0.6,
  },
  
  // Enhanced pipe caps
  pipeCapTop: {
    position: 'absolute',
    bottom: -4,
    left: -15,
    right: -15,
    height: 40,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
  },
  pipeCapBottom: {
    position: 'absolute',
    top: -4,
    left: -15,
    right: -15,
    height: 40,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
  },
  
  // Enhanced cap rim effects
  capRimTop: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  capRimBottom: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  // Enhanced cap bolts
  capBolt: {
    position: 'absolute',
    top: '50%',
    marginTop: -4,
    width: 8,
    height: 8,
    backgroundColor: '#1A1A1A',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4A4A4A',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 3,
  },
  
  // Animated water drops
  waterDrop: {
    position: 'absolute',
    width: 4,
    height: 6,
    borderRadius: 2,
    overflow: 'hidden',
  },
  dropGradient: {
    flex: 1,
    borderRadius: 2,
  },
  dropShine: {
    position: 'absolute',
    top: 1,
    left: 1,
    width: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 0.5,
  },
  
  // Joint bands matching reference image
  jointBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  jointBolt: {
    position: 'absolute',
    top: '50%',
    marginTop: -3,
    width: 6,
    height: 6,
    backgroundColor: GAME_CONFIG.BOLT_BASE,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: GAME_CONFIG.BOLT_HIGHLIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 2,
  },
  
  // Rust streaks - vertical weathering
  rustStreak: {
    position: 'absolute',
    width: 4,
    height: 35,
    borderRadius: 2,
    opacity: 0.7,
    overflow: 'hidden',
  },
  rustStreakSmall: {
    position: 'absolute',
    width: 2,
    height: 20,
    borderRadius: 1,
    opacity: 0.6,
    overflow: 'hidden',
  },
  
  // Enhanced moss and algae
  mossCluster: {
    position: 'absolute',
    width: 10,
    height: 14,
    borderRadius: 7,
    opacity: 0.8,
    overflow: 'hidden',
  },
  algaePatch: {
    position: 'absolute',
    width: 8,
    height: 12,
    borderRadius: 6,
    opacity: 0.7,
    overflow: 'hidden',
  },
  
  // Hanging moss tendrils
  mossTendril: {
    position: 'absolute',
    width: 2,
    height: 18,
    backgroundColor: GAME_CONFIG.MOSS_PRIMARY,
    borderRadius: 1,
    opacity: 0.8,
    transform: [{ rotate: '8deg' }],
  },
  mossTendrilSmall: {
    position: 'absolute',
    width: 1,
    height: 12,
    backgroundColor: GAME_CONFIG.MOSS_SECONDARY,
    borderRadius: 0.5,
    opacity: 0.7,
    transform: [{ rotate: '-5deg' }],
  },
  
  // Surface wear and scratches
  scratchLong: {
    position: 'absolute',
    width: 12,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    opacity: 0.6,
    transform: [{ rotate: '15deg' }],
  },
  scratchShort: {
    position: 'absolute',
    width: 6,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    opacity: 0.5,
    transform: [{ rotate: '-10deg' }],
  },
  wearMark: {
    position: 'absolute',
    width: 8,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 2,
    opacity: 0.4,
  },
  
  // Enhanced cap details
  capRimInner: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },
  capRust: {
    position: 'absolute',
    width: 6,
    height: 8,
    backgroundColor: GAME_CONFIG.RUST_PRIMARY,
    borderRadius: 3,
    opacity: 0.6,
  },
  capMoss: {
    position: 'absolute',
    width: 5,
    height: 6,
    backgroundColor: GAME_CONFIG.MOSS_PRIMARY,
    borderRadius: 3,
    opacity: 0.7,
  },
});