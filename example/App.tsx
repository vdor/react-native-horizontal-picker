import React from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import HorizontalPicker from '@vseslav/react-native-horizontal-picker/src';


const LN_SIDE_COLOR = '#0B5FA5AA';
const LN_CENTER_COLOR = '#0B5FA500';

const Items = Array.from(Array(20).keys());

const rednerItem = (item: number, index: number) => (
  <View style={styles.item}>
    <Text style={styles.itemText}>
      {
        item
      }
    </Text>
  </View>
)

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <HorizontalPicker
        defaultIndex={18}
        animatedScrollToDefaultIndex
        data={Items}
        renderItem={rednerItem}
        itemWidth={80}
      />
      <LinearGradient
        pointerEvents="none"
        style={styles.linearGradient}
        colors={[LN_SIDE_COLOR, LN_CENTER_COLOR, LN_SIDE_COLOR]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B5FA5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    width: 80,
  },
  itemText: {
    fontSize: 40,
    color: "#FF9400",
    textAlign: 'center',
  },
  linearGradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
