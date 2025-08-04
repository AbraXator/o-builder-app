import { ActionTypes, ControlTypes } from "../enums";

declare global {
  type ControlType = typeof ControlTypes[keyof typeof ControlTypes];

  interface Window {
    mapView?: any;
  }

  type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

  type ActionsHistory = {
    
  }

  type Action = {
    type: typeof ActionTypes[keyof typeof ActionTypes];
    control: Control;
    previousCoords?: [number, number];
    controlIndex?: number;
  }
}

export { };

