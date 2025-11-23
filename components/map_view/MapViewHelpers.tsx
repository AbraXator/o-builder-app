import { getCurrentControls } from "@/hooks/CourseHooks";
import { appState } from "@/libs/state/store";
import { ControlTypes, InteractionModes } from "@/libs/types/enums";
import { NotificationState } from "../Notification";

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
    number: { number: -1, coords: { x, y } },
    symbols: [
      {
        kind: "C",
        symbolId: -1,
      },
      {
        kind: "D",
        symbolId: -1,
      },
      {
        kind: "E",
        symbolId: -1,
      },
      {
        kind: "F",
        symbolId: -1,
      },
      {
        kind: "G",
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