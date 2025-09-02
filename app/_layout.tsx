import i18n from "@/libs/state/i18n";
import { ThemeProvider } from "@/libs/state/theme";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from "react-i18next";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <StatusBar style="auto" />
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </I18nextProvider>
  );
}
