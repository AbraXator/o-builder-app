import { getCurrentControls, getCurrentRoute } from "@/hooks/CourseHooks";
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
  const addControlToAllControls = state.addControlToAllControls;
  const currentRoute = state.currentRoute();
  const type = currentCourseState.selectedControlType;

  const initDefaultControl: Control = {
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
    return (type === ControlTypes.FINISH || type === ControlTypes.START) && getCurrentControls(currentCourseState, currentCourse).some(c => c.type === type);
  }

  if (cannotAddControl(type)) {
    setNotification({
      show: true,
      message: `Cannot add ${type} control more than once.`,
      type: 'error',
    });

    return;
  }

  currentRoute.controls.forEach((c) => {
    console.log(`Control code: ${c.code}`)
    console.log(`Control type: ${c.type}`)
  })
  console.log(`------------------------`)
  addControlToCurrentRoute(initDefaultControl);
  //addControlToAllControls(initDefaultControl);
  getCurrentRoute(appState.getState().currentCourseState, appState.getState().currentCourse).controls.forEach((c) => {
    console.log(`Control code: ${c.code}`)
    console.log(`Control type: ${c.type}`)

  })
  console.log(`------------------------`)
  console.log(`------------------------`)
  console.log(`------------------------`)
}