declare global {
  interface ControlSymbol {
    kind: number;
    symbolId: number;
  }

  interface ControlNumber {
    number: number;
    coords: Vec;
  }

  interface Control {
    index: number;
    type: ControlType;
    coords: Vec;
    code: number;
    number: ControlNumber;
    symbols: ControlSymbol[];
  }

  interface Route {
    id: number;
    name: string;
    length: number;
    climb: number;
    controls: Control[];
    finishType: number
  }
}

export { };

