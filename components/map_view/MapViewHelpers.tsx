import { getCurrentControls } from "@/hooks/CourseHooks";
import { appState } from "@/libs/state/store";
import { ControlTypes, InteractionModes } from "@/libs/types/enums";
import { useRef } from "react";
import { View } from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import { NotificationState } from "../Notification";
import { MapView } from "./MapView";

export function deselectControl(setCurrentCourseState: (data: Partial<CourseState>) => void, currentCourseState: CourseState) {
  if (currentCourseState.mode !== InteractionModes.PLACING && currentCourseState.selectedControl !== null) {
    setCurrentCourseState({ selectedControl: null });
  }
}

export function addControl(x: number, y: number, setNotification: SetState<NotificationState>) {
  const state = appState.getState();
  const currentCourse = state.currentCourse;
  const currentCourseState = state.currentCourseState;
  const addControlToCurrentRoute = state.addControlToCurrentRoute;
  const addExistingControlToCurrentRoute = state.addExistingControlToCurrentRoute;
  const currentRoute = state.currentRoute();
  const allControls = currentCourse.routes.find((r) => r.id === 0) as Route;
  const type = currentCourseState.selectedControlType;

  const controlOnSpot = allControls.controls.find((c) => {
    const dx = c.coords.x - x;
    const dy = c.coords.y - y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    return dist <= 24;
  })

  const initDefaultControl: Control = {
    index: 0,
    type: currentCourseState.selectedControlType,
    coords: { x, y },
    code: -1,
    number: { number: -1, coords: { x: 5, y: 5 } },
    symbols: [
      {
        kind: 0,
        symbolId: -1,
      },
      {
        kind: 1,
        symbolId: -1,
      },
      {
        kind: 2,
        symbolId: -1,
      },
      {
        kind: 3,
        symbolId: -1,
      },
      {
        kind: 4,
        symbolId: -1,
      }
    ],
  };

  const cannotAddControl = (type: ControlType) => {
    return (currentRoute.id !== 0) && (type === ControlTypes.FINISH || type === ControlTypes.START) && getCurrentControls(currentCourseState, currentCourse).some(c => c.type === type);
  }

  if (cannotAddControl(type)) {
    setNotification({
      show: true,
      message: `Cannot add ${type} control more than once.`,
      type: 'error',
    });

    return;
  }

  if (controlOnSpot) {
    addExistingControlToCurrentRoute(controlOnSpot);
  } else {
    addControlToCurrentRoute(initDefaultControl);
  }
  //if(currentRoute.id !== 0) addControlToAllControls(initDefaultControl);
}

export async function exportMap() {
  const mapRef = useRef<View>(null);
  const EXPORT_WIDTH = 2480; // A4 @ 300 DPI
  const EXPORT_HEIGHT = 3508;

  const MapViewShot =() => {(
    <ViewShot
      ref={mapRef}
      options={{ format: "png", quality: 1 }}
      style={{
        position: "absolute",
        left: -10000, // off-screen
        width: EXPORT_WIDTH,
        height: EXPORT_HEIGHT,
      }}
    >
      <MapView mapViewProps={{
        rotation: 0,
        scale: 1,
        translationX: 0,
        translationY: 0,
      }} />
    </ViewShot>
  )}

  if (!mapRef.current) return;

  const uri = await captureRef(mapRef, {
    format: "png",
    quality: 1,
  });

  console.log("Exported map image:", uri);
}