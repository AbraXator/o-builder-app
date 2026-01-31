import { Menu } from "@/constants/icons/icons";
import { appState } from "@/libs/state/store";
import { ThemeType, useTheme } from "@/libs/state/theme";
import { InteractionModes } from "@/libs/types/enums";
import { RefObject } from "react";
import { StyleSheet, Text, View, ViewComponent } from "react-native";
import { captureRef } from "react-native-view-shot";
import ToolbarButton from "../ToolbarButton";

export function colorForMode(theme: ThemeType, mode: InteractionMode) {
  switch (mode) {
    case InteractionModes.NORMAL: return { container: theme.control200, text: theme.control500 }
    case InteractionModes.PLACING: return { container: theme.accent100, text: theme.accent300 }
    case InteractionModes.EDITING: return { container: theme.info100, text: theme.info300 }
  }
}

export function LowBar({ mapExportRef }: {
  mapExportRef: RefObject<null | ViewComponent>
}) {
  const currentCourseState = appState((s) => s.currentCourseState);
  const interactionMode = currentCourseState.mode;
  const theme = useTheme().theme;
  const styles = createStyles(theme);

  const exportMap = async () => {
    console.log(`Exporting map, Ref: ${mapExportRef}`)
    if (!mapExportRef.current) return;

    const uri = await captureRef(mapExportRef, {
      format: "png",
      quality: 1,
    });

    console.log("Exported map:", uri);
  };

  return (
    <View style={styles.lowerToolbarContainer}>
      <View style={[styles.modeDisplay, {
        backgroundColor: colorForMode(theme, interactionMode).container
      }]}>
        <Text style={[styles.modeText, {
          color: colorForMode(theme, interactionMode).text

        }]}>
          {`MODE: ${interactionMode}`}
        </Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.menuButton}>
        <ToolbarButton
          icon={<Menu />}
          onPress={exportMap}
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