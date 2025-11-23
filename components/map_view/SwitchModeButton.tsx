import { appState } from "@/libs/state/store";
import { useTheme } from "@/libs/state/theme";
import ToolbarButton from "../ToolbarButton";
import { colorForMode } from "./LowBar";

export default function SwitchModeButton({ interactionMode }: {
  interactionMode: InteractionMode;
}) {
  const updateCurrentCourseState = appState((s) => s.updateCurrentCourseState);
  const currentCourseState = appState((s) => s.currentCourseState);
  const theme = useTheme().theme;
  const buttonActive = currentCourseState.mode === interactionMode;
  const label = interactionMode.toString().toLocaleUpperCase();

  return (
    <ToolbarButton
      active={buttonActive}
      label={label}
      onPress={() => updateCurrentCourseState({ mode: interactionMode })}
      addStyle={{
        backgroundColor: buttonActive ? colorForMode(theme, interactionMode).container : theme.neutral300
      }}
    />
  )
}