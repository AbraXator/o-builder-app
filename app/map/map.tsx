import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import ConfirmationModal from '../../components/ConfirmationModal';
import { MapView, MapViewProps } from '../../components/map_view/MapView';
//import { exportAsImage, ExportDialog } from '../components/ExportCourse';
import { LowBar } from '@/components/map_view/LowBar';
import EditingLowerToolbar from '@/components/map_view/lower_toolbar/EditingLowerToolbar';
import NormalLowerToolbar from '@/components/map_view/lower_toolbar/NormalLowerToolbar';
import PlacingLowerToolbar from '@/components/map_view/lower_toolbar/PlacingLowerToolbar';
import { VerticalSeparator } from '@/components/map_view/Separator';
import SwitchModeButton from '@/components/map_view/SwitchModeButton';
import { Notification, NotificationState } from '@/components/Notification';
import { RoutesModal, RoutesModalProps } from '@/components/RoutesModal';
import { getCurrentRoute } from '@/hooks/CourseHooks';
import { appState } from '@/libs/state/store';
import { ThemeType, useTheme } from '@/libs/state/theme';
import { InteractionModes } from '@/libs/types/enums';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

function UpperToolbar() {
  const currentCourseState = appState((s) => s.currentCourseState);
  const currentCourse = appState((s) => s.currentCourse);
  const currentRoute = appState((s) => s.currentRoute);
  const updateRoute = appState((s) => s.updateRoute);
  const updateCurrentCourseState = appState((s) => s.updateCurrentCourseState);
  const styles = createStyles(useTheme().theme);
  const buttonActive = (mode: InteractionMode) => {
    return currentCourseState.mode === mode;
  }

  return (
    <View style={styles.toolbarContainer}>
      <SwitchModeButton interactionMode={InteractionModes.NORMAL} />

      <VerticalSeparator />

      <SwitchModeButton interactionMode={InteractionModes.PLACING} />

      <VerticalSeparator />

      <SwitchModeButton interactionMode={InteractionModes.EDITING} />
    </View>
  );
}


export default function MapPage() {
  const [notificationState, setNotificationState] = useState<NotificationState>({
    show: false,
    message: '',
    type: 'info',
  });
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteControlModal, setShowDeleteControlModal] = useState(false);
  const [deleteControlEverywhere, setDeleteControlEverywhere] = useState(false);
  const [showRoutesModal, setShowRoutesModal] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const currentCourseState = appState((s) => s.currentCourseState);
  const currentCourse = appState((s) => s.currentCourse);
  const styles = createStyles(useTheme().theme);
  const mapViewProps: MapViewProps = {
    imageUri: appState((s) => s.currentCourse.map),
    scale: 10,
    rotation: 0,
    translationX: 0,
    translationY: 0,
  };

  const routesModalProps: RoutesModalProps = {
    routes: currentCourse.routes,
    currentRoute: getCurrentRoute(currentCourseState, currentCourse),
    showModal: showRoutesModal,
    onClose: () => setShowRoutesModal(false),
  }
  return (
    <SafeAreaView style={styles.container}>
      {showLeaveModal && (
        <ConfirmationModal
          title={'Exit to main page?'}
          message={'Any unsaved changes will be lost'}
          confirmText={'Exit'}
          onConfirm={() => router.push('/')}
          onCancel={() => setShowLeaveModal(false)}
          showModal={showLeaveModal}
        />
      )}
      {showLeaveModal && (
        <ConfirmationModal
          title={'Exit to main page?'}
          message={'Any unsaved changes will be lost'}
          confirmText={'Exit'}
          onConfirm={() => router.push('/')}
          onCancel={() => setShowLeaveModal(false)}
          showModal={showLeaveModal}
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

      {currentCourseState.mode === InteractionModes.NORMAL && (
        <NormalLowerToolbar
          setShowConfirmationModal={setShowLeaveModal}
          setNotificationState={setNotificationState}
          setShowRoutesModal={setShowRoutesModal}
        />
      )}

      {currentCourseState.mode === InteractionModes.PLACING && (
        <PlacingLowerToolbar />
      )}

      {currentCourseState.mode === InteractionModes.EDITING && (
        <EditingLowerToolbar
          setNotificationState={setNotificationState}
          setShowDeleteControlModal={setShowDeleteControlModal}
        />
      )}

      <View style={styles.horizontalSeparator} />

      <LowBar />

    </SafeAreaView>
  );
}

const createStyles = (theme: ThemeType) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.neutral200,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: theme.neutral100,
  },
  toolbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
    padding: 8,
    backgroundColor: theme.neutral200,
    borderBottomColor: theme.neutral300,
    borderBottomWidth: 2,
    zIndex: 100
  },
  lowerToolbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    backgroundColor: theme.neutral200,
    borderTopColor: theme.neutral300,
    borderTopWidth: 2
  },
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
});