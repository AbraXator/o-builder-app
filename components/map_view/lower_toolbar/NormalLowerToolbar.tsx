import { NotificationState } from "@/components/Notification";
import ToolbarButton from "@/components/ToolbarButton";
import { Home, Save } from "@/constants/icons/icons";
import { realDistanceMeters } from "@/hooks/CourseHooks";
import { appState } from "@/libs/state/store";
import { ThemeType, useTheme } from "@/libs/state/theme";
import { setCourse } from "@/libs/storage/AsyncStorage";
import { StyleSheet, View } from "react-native";

export default function NormalLowerToolbar({ setShowConfirmationModal, setNotificationState, setShowRoutesModal }: {
  setShowConfirmationModal: (show: boolean) => void;
  setNotificationState: SetState<NotificationState>;
  setShowRoutesModal: (show: boolean) => void;
}) {
  const currentCourse = appState((s) => s.currentCourse);
  const styles = createStyles(useTheme().theme);
  const saveCurrentCourse = () => {

    const id = currentCourse.id;
    if (!id) {
      setNotificationState({
        show: true,
        message: 'Unable to save current course, please try again.',
        type: 'error',
      });
      return;
    }
    setCourse(currentCourse, id);
    setNotificationState({ show: true, message: 'Course saved successfully', type: 'success' });
  };

  const symbols = () => {
    const a = {x: 1, y: 1};
    const b = {x: 2, y: 2};
    const dist = realDistanceMeters(a, b, 4000);

    console.log(currentCourse.map);
  }

  return (
    <View style={styles.lowerToolbarContainer}>
      <ToolbarButton icon={<Home />} onPress={() => setShowConfirmationModal(true)} />
      <ToolbarButton icon={<Save />} onPress={saveCurrentCourse} />
      <ToolbarButton label="SYMBOLS" onPress={symbols} />
      <ToolbarButton label="ROUTES" onPress={() => setShowRoutesModal(true)} />
    </View>
  );
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