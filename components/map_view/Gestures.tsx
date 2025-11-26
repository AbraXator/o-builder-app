import { getAllRoutesForControl, getCurrentControls, getCurrentRoute, getSelectedControl } from "@/hooks/CourseHooks";
import { appState } from "@/libs/state/store";
import { MoveTypes } from "@/libs/types/enums";
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
  controlOffset: SharedValue<Vec>;
  numberOffset: SharedValue<Vec>;
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

export function EditGestures({ controlOffset, numberOffset }: MoveGestureArgs) {
  const currentCourseState = appState((s) => s.currentCourseState);
  const currentCourse = appState((s) => s.currentCourse);
  const updateCurrentCourse = appState((s) => s.updateCurrentCourse);
  const updateCurrentCourseState = appState((s) => s.updateCurrentCourseState);
  const canMoveControl = useSharedValue(false);
  const canMoveNumber = useSharedValue(false);
  const moveType = appState((s) => s.moveType);

  const currentRoute = getCurrentRoute(currentCourseState, currentCourse);
  const currentControls = getCurrentControls(currentCourseState, currentCourse);
  const selected = getSelectedControl(currentCourseState, currentCourse);

  if (!selected) {
    const panGesture = Gesture.Pan();
    return Gesture.Exclusive(panGesture);
  }

  const control = selected as Control;
  const controlIndex = control.index;
  const originalControlCoords = { ...control.coords } as Vec;
  const originalNumberCoords = { ...control.number.coords } as Vec;
  const allRoutesForControl = getAllRoutesForControl(currentCourse, controlIndex);


  const canStartMovingControl = (x: number, y: number) => {
    'worklet';
    const dx = control.coords.x - x;
    const dy = control.coords.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist <= 48 && moveType === MoveTypes.CONTROL;
  }

  const canStartMovingNumber = (x: number, y: number) => {
    'worklet';
    /*const dx = control.number.coords.x - x;
    const dy = control.number.coords.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);*/
    //return dist <= 48 && moveType === MoveTypes.CONTROL;
    return moveType === MoveTypes.NUMBER;
  }

  const moveControl = (offset: Vec) => {
    const dx = offset.x;
    const dy = offset.y;

    const routeIdsForControl = new Set(allRoutesForControl.map((r) => r.id));

    const updatedRoutes = currentCourse.routes.map((route) => {
      if (!routeIdsForControl.has(route.id)) {
        return route;
      }

      const editedControls = route.controls.map((control) =>
        control.index === controlIndex
          ? {
            ...control,
            coords: {
              x: originalControlCoords.x + dx,
              y: originalControlCoords.y + dy,
            },
          }
          : control,
      );

      return {
        ...route,
        controls: editedControls,
      };
    });

    updateCurrentCourse({ routes: updatedRoutes });
  };

  const moveNumber = (offset: Vec) => {
    const dx = offset.x;
    const dy = offset.y;

    const routeIdsForControl = new Set(allRoutesForControl.map((r) => r.id));

    const updatedRoutes = currentCourse.routes.map((route) => {
      if (!routeIdsForControl.has(route.id)) {
        return route;
      }

      console.log(`Number: ${originalNumberCoords.x + dx} ${originalNumberCoords.y + dy}`)

      const newCoords = { x: originalNumberCoords.x + dx, y: originalNumberCoords.y + dy };

      const numberGlobalX = control.coords.x - 12 + newCoords.x;
      const numberGlobalY = control.coords.y - 12 + newCoords.y;

      const dx2 = numberGlobalX - control.coords.x;
      const dy2 = numberGlobalY - control.coords.y;

      const angle = Math.atan2(dy2, dx2);
      const r = 24;

      const snappedGlobalX = control.coords.x + Math.cos(angle) * r;
      const snappedGlobalY = control.coords.y + Math.sin(angle) * r;

      const snappedbackRelativeX = snappedGlobalX - (control.coords.x - 12);
      const snappedbackRelativeY = snappedGlobalY - (control.coords.y - 12);

      const editedControls = route.controls.map((control) =>
        control.index === controlIndex
          ? {
            ...control,
            number: {
              number: control.number.number,
              coords: {
                x: snappedbackRelativeX - 12,
                y: snappedbackRelativeY - 12,
              }
            }
          }
          : control,
      );

      return {
        ...route,
        controls: editedControls,
      };
    });

    updateCurrentCourse({ routes: updatedRoutes });
  };

  const panGesture = Gesture.Pan()
    .onStart((event) => {
      'worklet';
      canMoveControl.value = canStartMovingControl(event.x, event.y);
      canMoveNumber.value = canStartMovingNumber(event.x, event.y);
    })
    .onUpdate((event) => {
      'worklet';
      if (canMoveControl.value) {
        controlOffset.value = {
          x: event.translationX,
          y: event.translationY,
        };
      }
      if (canMoveNumber.value) {
        numberOffset.value = {
          x: event.translationX,
          y: event.translationY,
        };
      }
    })
    .onEnd(() => {
      'worklet';
      if (canMoveControl.value) {
        const finalOffset = controlOffset.value;
        runOnJS(moveControl)(finalOffset);
        controlOffset.value = { x: 0, y: 0 };
        canMoveControl.value = false;
      }
      if (canMoveNumber.value) {
        const finalOffset = numberOffset.value;
        runOnJS(moveNumber)(finalOffset);
        numberOffset.value = { x: 0, y: 0 };
        canMoveNumber.value = false;
      }
    });

  const tapGesture = Gesture.Tap().onStart((event) => {
    'worklet';
    runOnJS(deselectControl)(updateCurrentCourseState, currentCourseState)
  });

  return Gesture.Exclusive(panGesture, tapGesture);
}
