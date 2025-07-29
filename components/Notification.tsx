import { Alert, Checkmark, Info } from '@/constants/icons/icons';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

export interface NotificationState {
  show: boolean;
  message: string;
  type: 'error' | 'success' | 'info';
  onClose?: () => void;
  duration?: number;
}

interface NotificationProps {
  message: string;
  type: 'error' | 'success' | 'info';
  onClose?: () => void;
  duration?: number;
}

export function Notification({ message, type, onClose, duration = 1000 }: NotificationProps) {
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Fade out after duration
    const timeout = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onClose?.();
      });
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration, onClose]);

  const backgroundColor = {
    error: '#ef4444',   // red-500
    success: '#22c55e', // green-500
    info: '#3b82f6',    // blue-500
  }[type];

  const Icon = {
    error: Alert,
    success: Checkmark,
    info: Info,
  }[type];

  return (
    <Animated.View style={[styles.container, { backgroundColor, opacity }]}>
      <Icon />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
});
