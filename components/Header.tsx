import { Home, Settings } from '@/constants/icons/icons';
import { Href, router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import ToolbarButton from './ToolbarButton';

export default function Header({ name, previousPage = "/" }: {
  name: string;
  previousPage?: Href
}) {
  return (
    <View style={{
      height: 64,
      backgroundColor: '#f4f4f5',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      elevation: 4,
    }}>
      <ToolbarButton onPress={() => router.push(previousPage)} icon={<Home />} />
      <Text style={{
        fontSize: 18,
        fontWeight: '600',
      }}>
        {name.toUpperCase()}
      </Text>
      <ToolbarButton onPress={() => router.push('/')} icon={<Settings />} />
    </View>
  );
}