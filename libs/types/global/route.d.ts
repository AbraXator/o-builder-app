declare global {
  interface ControlSymbol {
    kind: string;
    code: number;
  }

  interface Control {
    type: ControlType;
    coords: [number, number];
    code: number;
    number: number;
    symbols: ControlSymbol[];
  }

  interface Route {
    id: number;
    name: string;
    length: number;
    climb: number;
    controls: Control[];
  }
}

export { };

