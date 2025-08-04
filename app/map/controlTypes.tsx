import { appState } from '@/libs/state/store';
import { ControlTypes } from '@/libs/types/enums';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Polygon } from 'react-native-svg';

function ControlTypeButton({ type, children }: { type: ControlType; children: React.ReactNode }) {
  const selectedControlType = appState((s) => s.currentCourseState.selectedControlType);
  const updateCurrentCourseState = appState((s) => s.updateCurrentCourseState);

  const handleItemClick = () => {
    updateCurrentCourseState({ selectedControlType: type });
  };

  const isActive = selectedControlType === type;

  return (
    <TouchableOpacity
      onPress={handleItemClick}
      style={[
        styles.button,
        { backgroundColor: isActive ? '#a1a1aa' : '#e4e4e7' }, // zinc-400 : zinc-200
      ]}
    >
      {children}
    </TouchableOpacity>
  );
}

export default function ItemsPage() {
  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>ITEMS</Text>
      </View>

      {/* Buttons */}
      <View style={styles.controlRow}>
        <ControlTypeButton type={ControlTypes.START}>
          <Svg width={32} height={32} viewBox="0 0 24 24">
            <Polygon points="12,4 20,20 4,20" stroke="#c01a6e" strokeWidth={2} fill="none" />
          </Svg>
        </ControlTypeButton>

        <ControlTypeButton type={ControlTypes.CONTROL}>
          <Svg width={32} height={32} viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="8" stroke="#c01a6e" strokeWidth={2} fill="none" />
          </Svg>
        </ControlTypeButton>

        <ControlTypeButton type={ControlTypes.FINISH}>
          <Svg width={32} height={32} viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="9" stroke="#c01a6e" strokeWidth={2} fill="none" />
            <Circle cx="12" cy="12" r="5" stroke="#c01a6e" strokeWidth={2} fill="none" />
          </Svg>
        </ControlTypeButton>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => router.push('/map/map')}>
          <Text style={styles.footerText}>🗺️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  footer: {
    backgroundColor: '#f4f4f5', // zinc-100
    paddingVertical: 12,
    alignItems: 'center',
  },
  footerButton: {
    backgroundColor: '#e4e4e7', // zinc-200
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  footerText: {
    fontSize: 18,
  },
});
