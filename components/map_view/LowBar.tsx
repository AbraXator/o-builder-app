import { Menu } from "@/constants/icons/icons";
import { appState } from "@/libs/state/store";
import { ThemeType, useTheme } from "@/libs/state/theme";
import { InteractionModes } from "@/libs/types/enums";
import { StyleSheet, Text, View } from "react-native";
import ToolbarButton from "../ToolbarButton";

export function LowBar() {
  const currentCourseState = appState((s) => s.currentCourseState);
  const interactionMode = currentCourseState.mode;
  const theme = useTheme().theme;
  const styles = createStyles(theme);
  const colorForMode = (mode: InteractionMode) => {
    switch (mode) {
      case InteractionModes.NORMAL: return { container: theme.control200, text: theme.control500 }
      case InteractionModes.PLACING: return { container: theme.accent100, text: theme.accent300 }
      case InteractionModes.EDITING: return { container: theme.info100, text: theme.info300 }
    }
  }

  return (
    <View style={styles.lowerToolbarContainer}>
      <View style={[styles.modeDisplay, {
        backgroundColor: colorForMode(interactionMode).container
      }]}>
        <Text style={[styles.modeText, {
          color: colorForMode(interactionMode).text

        }]}>
          {`MODE: ${interactionMode}`}
        </Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.menuButton}>
        <ToolbarButton
          icon={<Menu />}
          onPress={console.log}
        />
      </View>

    </View>
  )
}

const createStyles = (theme: ThemeType) => StyleSheet.create({
  lowerToolbarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: theme.neutral200,
    marginBottom: 16,
  },
  modeDisplay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 16,
    marginRight: 16,
    marginLeft: 8
  },
  modeText: {
    fontWeight: 600
  },
  separator: {
    width: 2,
    alignSelf: "stretch",
    marginRight: 16,
    backgroundColor: theme.control200
  },
  menuButton: {
    marginRight: 8,
  }
})