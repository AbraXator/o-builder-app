import React from 'react';
import { View } from 'react-native';
//import { exportAsImage, ExportDialog } from '../components/ExportCourse';
import ToolbarButton from '@/components/ToolbarButton';
import { GetIcon } from '@/constants/icons/controlIcons';
import { appState } from '@/libs/state/store';
import { ThemeType, useTheme } from '@/libs/state/theme';
import { ControlTypes } from '@/libs/types/enums';
import { StyleSheet } from 'react-native';

export default function PlacingLowerToolbar() {
  const setCurrentCourseState = appState((s) => s.updateCurrentCourseState);
  const currentCourseState = appState((s) => s.currentCourseState);
  const styles = createStyles(useTheme().theme);

  const ControlTypeButton: React.FC<{ type: ControlTypes }> = ({ type }) => (
    <ToolbarButton
      active={currentCourseState.selectedControlType === type}
      icon={<GetIcon type={type} />}
      onPress={() => setCurrentCourseState({ selectedControlType: type })}
    />
  );

  return (
    <View style={styles.lowerToolbarContainer}>
      <ControlTypeButton type={ControlTypes.START} />
      <ControlTypeButton type={ControlTypes.CONTROL} />
      <ControlTypeButton type={ControlTypes.FINISH} />
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