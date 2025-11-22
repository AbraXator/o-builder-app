import { getCurrentControls, getCurrentRoute, getSelectedControl } from "@/hooks/CourseHooks";
import { appState } from "@/libs/state/store";
import { Gesture } from "react-native-gesture-handler";
import { runOnJS, SharedValue, useSharedValue } from "react-native-reanimated";
import { NotificationState } from "../Notification";
import { addControl, deselectControl } from "./MapViewHelpers";

type MapGesturesArgs = {
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  offsetX: SharedValue<number>;
  offsetY: SharedValue<number>;
  scale: SharedValue<number>;
  offsetScale: SharedValue<number>;
  rotation: SharedValue<number>;
  offsetRotation: SharedValue<number>;
  deselectControl: typeof deselectControl;
};

type PlaceGestureArgs = {
  deselectControl: typeof deselectControl;
  addControl: typeof addControl;
  setNotificationState: SetState<NotificationState>;
}

type MoveGestureArgs = {
  setNotificationState: SetState<NotificationState>;
  controlOffset: SharedValue<Vec>
}

type PanContext = {
  active: boolean;
}

export function MapGestures({
  translateX,
  translateY,
  offsetX,
  offsetY,
  scale,
  offsetScale,
  rotation,
  offsetRotation,
}: MapGesturesArgs) {
  const setCurrentCourseState = appState((s) => s.updateCurrentCourseState)
  const currentCourseState = appState((s) => s.currentCourseState)

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      'worklet';
      translateX.value = offsetX.value + event.translationX;
      translateY.value = offsetY.value + event.translationY;
    })
    .onEnd(() => {
      'worklet';
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      'worklet';
      scale.value = offsetScale.value * event.scale;
    })
    .onEnd(() => {
      'worklet';
      offsetScale.value = scale.value;
    });

  const rotationGesture = Gesture.Rotation()
    .onUpdate((event) => {
      'worklet';
      rotation.value = offsetRotation.value + event.rotation;
    })
    .onEnd(() => {
      'worklet';
      offsetRotation.value = rotation.value;
    });

  const tapGesture = Gesture.Tap().onStart((event) => {
    'worklet';
    runOnJS(deselectControl)(setCurrentCourseState, currentCourseState)
  });

  return Gesture.Exclusive(
    panGesture, pinchGesture, rotationGesture, tapGesture
  );
}

export function PlaceGestures({
  deselectControl,
  addControl,
  setNotificationState,
}: PlaceGestureArgs) {
  const setCurrentCourseState = appState((s) => s.updateCurrentCourseState);
  const currentCourseState = appState((s) => s.currentCourseState);

  const handlePlaceTap = (x: number, y: number) => {
    try {
      deselectControl(setCurrentCourseState, currentCourseState);
      addControl(x, y, setNotificationState);
    } catch (error) {
      console.error("Error handling tap gesture:", error);
    }
  }

  const tapGesture = Gesture.Tap()
    .onStart((event) => {
      'worklet';
      runOnJS(handlePlaceTap)(event.x, event.y);
    });

  return Gesture.Exclusive(
    tapGesture,
  );
}

export function EditGestures({ controlOffset }: MoveGestureArgs) {
  const currentCourseState = appState((s) => s.currentCourseState);
  const currentCourse = appState((s) => s.currentCourse);
  const updateCurrentCourse = appState((s) => s.updateCurrentCourse);
  const updateCurrentCourseState = appState((s) => s.updateCurrentCourseState);
  const canMove = useSharedValue(false);

  const currentRoute = getCurrentRoute(currentCourseState, currentCourse);
  const currentControls = getCurrentControls(currentCourseState, currentCourse);
  const selected = getSelectedControl(currentCourseState, currentCourse);

  if (!selected) {
    const panGesture = Gesture.Pan();
    return Gesture.Exclusive(panGesture);
  }

  const control = selected as Control;
  const controlCode = control.code;
  const originalCoords = { ...control.coords } as Vec;

  const canStart = (x: number, y: number) => {
    'worklet';
    const dx = control.coords.x - x;
    const dy = control.coords.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    console.log(`distance: ${dist}`)
    return dist <= 48;
  }

  const moveControl = (offset: Vec) => {
    const dx = offset.x;
    const dy = offset.y;

    const updatedControls = currentControls.map((c) =>
      c.code === controlCode ? {
        ...c,
        coords: {
          x: originalCoords.x + dx,
          y: originalCoords.y + dy,
        },
      } : c,
    );

    const updatedRoutes = currentCourse.routes.map((r) =>
      r.id === currentRoute.id
        ? {
          ...r,
          controls: updatedControls,
        }
        : r,
    );

    updateCurrentCourse({ routes: updatedRoutes });
  };

  const panGesture = Gesture.Pan()
    .onStart((event) => {
      'worklet';
      canMove.value = canStart(event.x, event.y);
    })
    .onUpdate((event) => {
      'worklet';
      if (!canMove.value) return;

      controlOffset.value = {
        x: event.translationX,
        y: event.translationY,
      };
    })
    .onEnd(() => {
      'worklet';
      const finalOffset = controlOffset.value;
      runOnJS(moveControl)(finalOffset);
      controlOffset.value = { x: 0, y: 0 };
      canMove.value = false;
    });

  const tapGesture = Gesture.Tap().onStart((event) => {
    'worklet';
    runOnJS(deselectControl)(updateCurrentCourseState, currentCourseState)
  });

  return Gesture.Exclusive(panGesture, tapGesture);
}
