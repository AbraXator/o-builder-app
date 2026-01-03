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

  type Vec = { x: number; y: number }

  type ControlSymbolData = {
    index: number;
    id: string;
    name: string;
    kind: number;
    svg: string;
  }

  type ControlSymbolType = {
    id: number,
    name: string,
    start: number,
    end: number,
    color?: string
  }

  type ControlSymbolSplit = {
    kind: number,
    types: ControlSymbolType[],
  }
}

export { };

