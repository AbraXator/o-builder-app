import { InteractionModes } from "../enums";

declare global {
  type InteractionMode = typeof InteractionModes[keyof typeof InteractionModes];

  interface CourseState {
    selectedControlType: ControlType;
    selectedControl: number | null;
    mode: InteractionMode;
    currentRoute: number
  }
}

export { };

