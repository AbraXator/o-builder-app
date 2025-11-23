import { InteractionModes, MoveTypes } from "../enums";

declare global {
  type InteractionMode = typeof InteractionModes[keyof typeof InteractionModes];
  
  type MoveType = typeof MoveTypes[keyof typeof MoveTypes];

  interface CourseState {
    selectedControlType: ControlType;
    selectedControl: number | null;
    mode: InteractionMode;
    currentRoute: number
  }
}

export { };

