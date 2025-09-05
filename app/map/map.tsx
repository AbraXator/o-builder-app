import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import ConfirmationModal from '../../components/ConfirmationModal';
import { MapView, MapViewProps } from '../../components/MapView';
//import { exportAsImage, ExportDialog } from '../components/ExportCourse';
import { Notification, NotificationState } from '@/components/Notification';
import { RoutesModal, RoutesModalProps } from '@/components/RoutesModal';
import { GetIcon } from '@/constants/icons/controlIcons';
import { Home, Pointer, Print, Save, Trashcan, Undo } from '@/constants/icons/icons';
import { getCurrentRoute, removeControl } from '@/hooks/CourseHooks';
import { appState } from '@/libs/state/store';
import { ThemeType, useTheme } from '@/libs/state/theme';
import { setCourse } from '@/libs/storage/AsyncStorage';
import { ControlTypes, InteractionModes } from '@/libs/types/enums';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { runOnJS } from 'react-native-reanimated';
import ToolbarButton from '../../components/ToolbarButton';

function UpperToolbar() {
  const currentCourseState = appState((s) => s.currentCourseState);
  const currentCourse = appState((s) => s.currentCourse);
  const currentRoute = appState((s) => s.currentRoute);
  const updateRoute = appState((s) => s.updateRoute);
  const updateCurrentCourseState = appState((s) => s.updateCurrentCourseState);
  const styles = createStyles(useTheme().theme);
  
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
         if (currentCourseState.selectedControl !== null) {
            removeControl(currentCourseState.selectedControl, getCurrentRoute(currentCourseState, currentCourse), updateRoute);
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

export function LowerToolbar({ setShowConfirmationModal, setNotificationState, setShowRoutesModal }: {
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

  return (
    <View style={styles.lowerToolbarContainer}>
      <ToolbarButton icon={<Home />} onPress={() => setShowConfirmationModal(true)} />
      <ToolbarButton icon={<Save />} onPress={saveCurrentCourse} />
      <ToolbarButton icon={<Print />} onPress={() => console.log('PRINT')} />
      <ToolbarButton label="Controls" onPress={() => router.push('/map/controlSymbols')} />
      <ToolbarButton label="Routes" onPress={() => setShowRoutesModal(true)} />
    </View>
  );
}

export default function MapPage() {
  const [notificationState, setNotificationState] = useState<NotificationState>({
    show: false,
    message: '',
    type: 'info',
  });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showRoutesModal, setShowRoutesModal] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const currentCourseState = appState((s) => s.currentCourseState);
  const currentCourse = appState((s) => s.currentCourse);
  const styles = createStyles(useTheme().theme);
  const mapViewProps: MapViewProps = {
    imageUri: appState((s) => s.currentCourse.map),
    scale: 1,
    rotation: 0,
    translationX: 0,
    translationY: 0,
  };

  const routesModalProps: RoutesModalProps = {
    routes:  currentCourse.routes,
    currentRoute: getCurrentRoute(currentCourseState, currentCourse),
    showModal: showRoutesModal,
    onClose: () => setShowRoutesModal(false), 
  } 
  return (
    <SafeAreaView style={styles.container}>
      {showConfirmationModal && (
        <ConfirmationModal
          title={'Exit to main page?'}
          message={'Any unsaved changes will be lost'}
          confirmText={'Exit'}
          onConfirm={() => router.push('/')}
          onCancel={() => setShowConfirmationModal(false)}
          showModal={showConfirmationModal}
        />
      )}
      {showRoutesModal && (
        <RoutesModal 
          routesModalProps={routesModalProps}
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
        <MapView mapViewProps={mapViewProps} />
      </View>

      {currentCourseState.mode === InteractionModes.PLACING && (
        <ChangeControlTypeLowerToolbar />
      )}

      {currentCourseState.mode !== InteractionModes.PLACING && (
        <LowerToolbar
          setShowConfirmationModal={setShowConfirmationModal}
          setNotificationState={setNotificationState}
          setShowRoutesModal={setShowRoutesModal}
        />
      )}

    </SafeAreaView>
  );
}

const createStyles = (theme: ThemeType) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.neutral100,
  },
  mapContainer: {
    flex: 1,
  },
  toolbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
    padding: 8,
    backgroundColor: theme.neutral200,
    maxHeight: 48,
  },
  lowerToolbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    backgroundColor: theme.neutral200,
    height : 48,
  },
});