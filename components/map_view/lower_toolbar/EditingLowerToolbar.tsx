import { NotificationState } from "@/components/Notification";
import ToolbarButton from "@/components/ToolbarButton";
import { Trashcan } from "@/constants/icons/icons";
import { getCurrentRoute, removeControl } from "@/hooks/CourseHooks";
import { appState } from "@/libs/state/store";
import { ThemeType, useTheme } from "@/libs/state/theme";
import { MoveTypes } from "@/libs/types/enums";
import { StyleSheet, View } from "react-native";
import { VerticalSeparator } from "../Separator";

function DisablableButton({ active, onPress, icon, label, setNotificationState }: {
  active?: boolean;
  onPress: () => void;
  icon?: React.JSX.Element;
  label?: string;
  setNotificationState: SetState<NotificationState>;
}) {
  const currentCourseState = appState((s) => s.currentCourseState);
  const theme = useTheme().theme;
  const canPress = currentCourseState.selectedControl !== null;
  const modifiedOnPress = () => {
    if (!canPress) {
      setNotificationState({
        message: "Please select a control first",
        type: "info",
        show: true,
      })
    };

    return onPress();
  }
  const color = () => {
    if (!canPress) return theme.disabled;
    if (active) return theme.control200;

    return theme.neutral300;
  }

  return (
    <ToolbarButton
      active={active}
      onPress={modifiedOnPress}
      icon={icon}
      label={label}
      addStyle={{
        backgroundColor: color()
      }}
    />
  )
}

export default function EditingLowerToolbar({ setNotificationState, setShowDeleteControlModal }: {
  setNotificationState: SetState<NotificationState>
  setShowDeleteControlModal: SetState<boolean>
}) {
  const theme = useTheme().theme;
  const styles = createStyles(theme);
  const moveType = appState((s) => s.moveType);
  const currentCourseState = appState((s) => s.currentCourseState);
  const currentCourse = appState((s) => s.currentCourse);
  const setMoveType = appState((s) => s.setMoveType);
  const updateCurrentCourseState = appState((s) => s.updateCurrentCourseState);
  const updateRoute = appState((s) => s.updateRoute);

  return (
    <View style={styles.lowerToolbarContainer}>
      <DisablableButton
        active={moveType === MoveTypes.CONTROL}
        onPress={() => setMoveType(MoveTypes.CONTROL)}
        label="MOVE CONTROL"
        setNotificationState={setNotificationState}
      />

      <VerticalSeparator />

      <DisablableButton
        active={moveType === MoveTypes.NUMBER}
        onPress={() => setMoveType(MoveTypes.NUMBER)}
        label="MOVE NUMBER"
        setNotificationState={setNotificationState}
      />

      <VerticalSeparator />

      <DisablableButton
        icon={<Trashcan />}
        onPress={() => {
          if (currentCourseState.selectedControl !== null) {
            removeControl(currentCourseState.selectedControl, getCurrentRoute(currentCourseState, currentCourse), currentCourse, updateRoute);
            updateCurrentCourseState({ selectedControl: undefined });
          }
        }}
        setNotificationState={setNotificationState}
      />
    </View>
  )
}

const createStyles = (theme: ThemeType) => StyleSheet.create({
  lowerToolbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    backgroundColor: theme.neutral200,
    borderTopColor: theme.neutral300,
    borderTopWidth: 2
  },
})