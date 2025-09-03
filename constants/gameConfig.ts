import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const GAME_CONFIG = {
  // Physics
  GRAVITY: 800,
  FLAP_VELOCITY: -350,
  MAX_FALL_SPEED: 500,
  
  // Spark
  SPARK_SIZE: 30,
  SPARK_X: SCREEN_WIDTH * 0.3,
  
  // Pipes
  PIPE_WIDTH: 60,
  PIPE_SPEED: 200,
  PIPE_SPACING: 250,
  GAP_SIZE: 180,
  
  // Colors
  SPARK_COLOR: '#FFD700',
  SPARK_GLOW: '#FFA500',
  PIPE_COLOR_TOP: '#00CC66',
  PIPE_COLOR_BOTTOM: '#009944',
  
  // Enhanced pipe colors matching reference image - weathered bronze/copper
  PIPE_HIGHLIGHT: '#A8B89A',
  PIPE_BASE: '#6B7A5C',
  PIPE_SHADOW: '#4A5A3C',
  
  // Pipe cap colors - aged bronze with patina
  PIPE_CAP_TOP: '#8A9B7A',
  PIPE_CAP_BOTTOM: '#5A6B4A',
  
  // Weathering colors matching reference
  RUST_PRIMARY: '#B85A2E',
  RUST_SECONDARY: '#A0471F',
  MOSS_PRIMARY: '#5A6B3A',
  MOSS_SECONDARY: '#3F4A2A',
  ALGAE_PRIMARY: '#4A5B2A',
  ALGAE_SECONDARY: '#3A4B1A',
  WATER_DROP: '#B8D4E3',
  WATER_SHINE: '#E8F4FF',
  
  // Joint and bolt colors
  JOINT_DARK: '#2A3A1A',
  JOINT_HIGHLIGHT: '#7A8B6A',
  BOLT_BASE: '#3A4A2A',
  BOLT_HIGHLIGHT: '#6A7B5A',
};