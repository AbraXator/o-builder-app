import { ThemeType, useTheme } from "@/libs/state/theme";
import { StyleSheet, View } from "react-native";

export default function controlSymbolsPage() {
  const styles = createStyles(useTheme().theme);
  
  return (
    <View style={styles.container}>

    </View>
  )
}

const createStyles = (theme: ThemeType) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.control500
  }
})