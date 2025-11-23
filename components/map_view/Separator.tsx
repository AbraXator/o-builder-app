import { ThemeType, useTheme } from "@/libs/state/theme";
import { StyleSheet, View } from "react-native";

export function VerticalSeparator() {
  const styles = createStyles(useTheme().theme);

  return (
    <View style={styles.separator} />
  )
}

const createStyles = (theme: ThemeType) => StyleSheet.create({
  separator: {
    borderWidth: 1,
    borderColor: theme.control200
  },
  horizontalSeparator: {
    borderTopColor: theme.control200,
    borderBottomColor: theme.control200,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginHorizontal: 16
  }
})