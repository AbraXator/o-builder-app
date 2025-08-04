import { GetIcon } from '@/constants/icons/controlIcons';
import { appState } from '@/libs/state/store';
import { ControlTypes, InteractionModes } from '@/libs/types/enums';
import { useState } from 'react';
import { Dimensions, Text, TouchableOpacity } from 'react-native';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { Notification, NotificationState } from './Notification';


const window = Dimensions.get('window');

function ControlMarker({ control, index }: { control: Control; index: number }) {
  const currentCourseState = appState((s) => s.currentCourseState);
  const updateCurrentCourseState = appState((s) => s.updateCurrentCourseState);
  const interactionMode = appState((s) => s.currentCourseState.mode);

  const handleTap = () => {
    if (interactionMode === InteractionModes.SELECTING) {
      updateCurrentCourseState({ selectedControl: index });
    }
  }

  return (
    <TouchableOpacity
      key={index}
      onPress={handleTap}
      style={{
        position: 'absolute',
        left: control.coords[0],
        top: control.coords[1],
        height: 24,
        width: 24,
      }}
    >
      <GetIcon type={control.type} props={{ stroke: currentCourseState.selectedControl === index ? "#6a32ed" : "#ed3288"}} />
      <Text style={{ color: 'white', fontSize: 12 }}>
        {control.code}
      </Text>
    </TouchableOpacity>

  )
}

function addControl(x: number, y: number, type: ControlType, controlsList: Control[], setNotification: SetState<NotificationState>) {
  console.log("Tap detected at:", x, y);
  const state = appState.getState();
  const currentCourse = state.currentCourse;
  const currentCourseState = state.currentCourseState;
  const addControlToCurrentRoute = state.addControlToCurrentRoute;

  const cannotAddControl = (type: ControlType) => {
    return (type === ControlTypes.FINISH || type === ControlTypes.START) && controlsList.some(c => c.type === type);
  }

  if (cannotAddControl(type)) {
    setNotification({
      show: true,
      message: `Cannot add ${type} control more than once.`,
      type: 'error',
    });

    return;
  }

  addControlToCurrentRoute({
    type: type,
    coords: [x, y],
    code: 0,
    number: -1,
    symbols: [],
  });
}

function deselectControl(setCurrentCourseState: (data: Partial<CourseState>) => void, currentCourseState: CourseState) {
  console.log("Deselecting control");
  if( currentCourseState.mode !== InteractionModes.PLACING && currentCourseState.selectedControl !== null ) {
    setCurrentCourseState({ selectedControl: null });
    console.log(currentCourseState.selectedControl);
  }
}


export function MapView({ imageUri }: { imageUri: string }) {
  const scale = useSharedValue(1);
  const offsetScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const offsetRotation = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const interactionMode = appState((s) => s.currentCourseState.mode);
  const selectedControlType = appState((s) => s.currentCourseState.selectedControlType);
  const [currentNotificationState, setNotificationState] = useState<NotificationState>({ show: false, message: '', type: 'info' });
  const setCurrentCourseState = appState((s) => s.updateCurrentCourseState);
  const currentCourseState = appState((s) => s.currentCourseState);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = offsetX.value + event.translationX;
      translateY.value = offsetY.value + event.translationY;
    })
    .onEnd(() => {
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = offsetScale.value * event.scale;
    })
    .onEnd(() => {
      offsetScale.value = scale.value;
    });

  const rotationGesture = Gesture.Rotation()
    .onUpdate((event) => {
      rotation.value = offsetRotation.value + event.rotation;
    })
    .onEnd(() => {
      offsetRotation.value = rotation.value;
    });

  const tapGesture = Gesture.Tap()
    .onStart(runOnJS((event) => {
      try {
        deselectControl(setCurrentCourseState, currentCourseState);
        addControl(event.x, event.y, selectedControlType, appState.getState().currentRoute().controls, setNotificationState);
      } catch (error) {
        console.error("Error handling tap gesture:", error);
      }
    }));

  const composed = Gesture.Exclusive(
    panGesture, pinchGesture, rotationGesture
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}rad` },
    ],
  }));

  const controls = appState((s) => s.currentRoute()).controls;

  return (
    <GestureDetector gesture={interactionMode !== InteractionModes.PLACING ? composed : tapGesture}>
      <Animated.View
        style={[
          {
            width: window.width,
            height: window.height,
          },
          animatedStyle,
        ]}
      >
        {currentNotificationState.show && <Notification
          message={currentNotificationState.message}
          type={currentNotificationState.type}
          onClose={() => setNotificationState({ show: false, message: '', type: 'info' })}
        />}
        <Animated.Image
          source={{ uri: imageUri }}
          style={{
            width: window.width,
            height: window.height,
          }}
          resizeMode="contain"
        />

        {controls.map((control, index) => (
          <ControlMarker key={index} control={control} index={index} />
        ))}
      </Animated.View>

    </GestureDetector>
  )
}
