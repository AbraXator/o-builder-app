import { ControlTypes } from "../enums";

declare global {
  type ControlType = typeof ControlTypes[keyof typeof ControlTypes];

  interface Window {
    mapView?: any;
  }

  type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
}

export { };

