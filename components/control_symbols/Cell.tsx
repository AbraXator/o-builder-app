import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ControlSymbolIcon } from "./symbolsHooks";

export enum CellTypes {
  DISPLAY,
  CONTROL_SYMBOL,
  CHOOSE_SYMBOL,
  FINISH
}

export type CellInteractionType = typeof CellTypes[keyof typeof CellTypes];

export type Cell = {
  type: CellInteractionType;
  size: number;
  text?: string;
  control?: Control;
  symbol?: ControlSymbol;
  finishType?: number;
};

export type CellRenderContext = {
  setShowChooseSymbols: React.Dispatch<React.SetStateAction<boolean>>;
  setChosenKind: React.Dispatch<React.SetStateAction<number | undefined>>;
  setChosenControl: React.Dispatch<React.SetStateAction<number | undefined>>;
};

export function DisplayCell({ cell, ctx }: {
  cell: Cell,
  ctx: CellRenderContext;
}) {
  const text = cell.text ?? "UNDEFINED";
  return (
    <View style={styles.cell}>
      <Text>{text}</Text>
    </View>
  );
}

export function ControlSymbolCell({ cell, ctx }: {
  cell: Cell;
  ctx: CellRenderContext;
}) {
  const { kind = 0, symbolId: id = 0 } = cell.symbol ?? {};
  const controlId = cell.control?.index;

  if (!controlId) return <View style={styles.cell} />;

  const handlePress = () => {
    ctx.setShowChooseSymbols(true);
    ctx.setChosenKind(kind);
    ctx.setChosenControl(controlId);
  };

  return (
    <TouchableOpacity style={styles.cell} onPress={handlePress}>
      <ControlSymbolIcon kind={kind} id={id} />
    </TouchableOpacity>
  );
}

export function ChooseSymbolCell({ cell, ctx }: {
  cell: Cell,
  ctx: CellRenderContext
}) {
  return <View style={styles.cell} />;
}

export function FinishCell({ cell, ctx }: {
  cell: Cell,
  ctx: CellRenderContext
}) {
  return (
    <View style={styles.cell}>
      <Text>FINISH</Text>
    </View>
  );
}

const cellComponentMap: Record<
  CellTypes,
  React.FC<{ cell: Cell; ctx: CellRenderContext }>
> = {
  [CellTypes.DISPLAY]: DisplayCell,
  [CellTypes.CONTROL_SYMBOL]: ControlSymbolCell,
  [CellTypes.CHOOSE_SYMBOL]: ChooseSymbolCell,
  [CellTypes.FINISH]: FinishCell,
};

export default function CellRenderer({ cell }: { cell: Cell }) {
  const [showChooseSymbols, setShowChooseSymbols] = useState(false);
  const [chosenKind, setChosenKind] = useState<number | undefined>();
  const [chosenControl, setChosenControl] = useState<number | undefined>();

  const CellComponent = cellComponentMap[cell.type];

  if (!CellComponent) return null;

  const ctx: CellRenderContext = {
    setShowChooseSymbols,
    setChosenKind,
    setChosenControl,
  };

  return <CellComponent cell={cell} ctx={ctx} />;
}

const styles = StyleSheet.create({
  cell: {
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
