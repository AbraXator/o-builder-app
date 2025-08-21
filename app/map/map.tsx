import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import ConfirmationModal from '../../components/ConfirmationModal';
import { MapView } from '../../components/MapView';
//import { exportAsImage, ExportDialog } from '../components/ExportCourse';
import { Notification, NotificationState } from '@/components/Notification';
import { GetIcon } from '@/constants/icons/controlIcons';
import { Home, Pointer, Print, Save, Trashcan, Undo } from '@/constants/icons/icons';
import { removeControl } from '@/hooks/ControlHooks';
import { appState } from '@/libs/state/store';
import { setCourse } from '@/libs/storage/AsyncStorage';
import { ControlTypes, InteractionModes } from '@/libs/types/enums';
import { router } from 'expo-router';
import { runOnJS } from 'react-native-reanimated';
import ToolbarButton from '../../components/ToolbarButton';

function UpperToolbar() {
  const currentCourseState = appState((s) => s.currentCourseState);
  const currentCourse = appState((s) => s.currentCourse);
  const updateRoute = appState((s) => s.updateRoute);
  const updateCurrentCourseState = appState((s) => s.updateCurrentCourseState);

  return (
    <View style={styles.toolbarContainer}>
      <ToolbarButton
        active={currentCourseState.mode === InteractionModes.INTERACTING}
        icon={<Pointer />}
        onPress={runOnJS(() => updateCurrentCourseState({ mode: InteractionModes.INTERACTING }))}
      />

      <ToolbarButton
        active={currentCourseState.mode === InteractionModes.PLACING}
        icon={<GetIcon type={currentCourseState.selectedControlType} />}
        onPress={runOnJS(() => updateCurrentCourseState({ mode: InteractionModes.PLACING }))}
      />

      <ToolbarButton
        icon={<Trashcan />}
        onPress={() => {
          if (currentCourseState.selectedControl !== undefined) {
            removeControl(currentCourseState.selectedControl, currentCourse, updateRoute);
            updateCurrentCourseState({ selectedControl: undefined });
          }
        }}
      />

      <ToolbarButton icon={<Undo />} onPress={() => { }} />
    </View>
  );
}

export function ChangeControlTypeLowerToolbar() {
  const setCurrentCourseState = appState((s) => s.updateCurrentCourseState);
  const currentCourseState = appState((s) => s.currentCourseState);

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

export function LowerToolbar({ setShowModal, setNotificationState }: {
  setShowModal: (show: boolean) => void;
  setNotificationState: SetState<NotificationState>;
}) {
  const currentCourse = appState((s) => s.currentCourse);
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

  return (
    <View style={styles.lowerToolbarContainer}>
      <ToolbarButton icon={<Home />} onPress={() => setShowModal(true)} />
      <ToolbarButton icon={<Save />} onPress={saveCurrentCourse} />
      <ToolbarButton icon={<Print />} onPress={() => console.log('PRINT')} />
      <ToolbarButton label="Controls" onPress={() => router.push('/map/controlSymbols')} />
      <ToolbarButton label="Routes" onPress={() => router.push('/map/routes')} />
    </View>
  );
}

export default function MapPage() {
  const [notificationState, setNotificationState] = useState<NotificationState>({
    show: false,
    message: '',
    type: 'info',
  });
  const [showModal, setShowModal] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const currentCourseState = appState((s) => s.currentCourseState);

  return (
    <SafeAreaView style={styles.container}>
      {showModal && (
        <ConfirmationModal
          title={'Exit to main page?'}
          message={'Any unsaved changes will be lost'}
          confirmText={'Exit'}
          onConfirm={() => router.push('/')}
          onCancel={() => setShowModal(false)}
          showModal={showModal}
        />
      )}
      {/* {showExportDialog && <ExportDialog />} */}
      {notificationState.show && (
        <Notification
          message={notificationState.message}
          onClose={() => setNotificationState({ show: false, message: '', type: 'info' })}
          type={notificationState.type}
        />
      )}

      <UpperToolbar />

      <View style={styles.mapContainer}>
        <MapView imageUri={appState((s) => s.currentCourse.map)} />
      </View>

      {currentCourseState.mode === InteractionModes.PLACING && (
        <ChangeControlTypeLowerToolbar />
      )}

      {currentCourseState.mode !== InteractionModes.PLACING && (
        <LowerToolbar
          setShowModal={setShowModal}
          setNotificationState={setNotificationState}
        />
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
  },
  toolbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
    padding: 8,
    backgroundColor: '#f4f4f4',
    maxHeight: 48,
  },
  lowerToolbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    backgroundColor: '#e2e2e2',
    height : 48,
  },
});