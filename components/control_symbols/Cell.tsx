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
  openSymbolsModal?: (kind: number, control: number) => void;
};

export function DisplayCell({ cell }: {
  cell: Cell,
}) {
  const text = cell.text ?? "UNDEFINED";
  return (
    <View style={styles.cell}>
      <Text>{text}</Text>
    </View>
  );
}

export function ControlSymbolCell({ cell }: {
  cell: Cell;
}) {
  const { kind = 0, symbolId: id = 0 } = cell.symbol ?? {};
  const controlId = cell.control?.index;

  if (!controlId) return <View style={styles.cell} />;

  const handlePress = () => {
    if(!cell.openSymbolsModal) {
      console.error(`Could not open symbol modal for cell: ${cell}`)
      return;
    }

    return cell.openSymbolsModal(kind, controlId);
  };

  return (
    <TouchableOpacity style={styles.cell} onPress={handlePress}>
      <ControlSymbolIcon kind={kind} id={id} />
    </TouchableOpacity>
  );
}

export function ChooseSymbolCell({ cell }: {
  cell: Cell,
}) {
  return <View style={styles.cell} />;
}

export function FinishCell({ cell }: {
  cell: Cell,
}) {
  return (
    <View style={styles.cell}>
      <Text>FINISH</Text>
    </View>
  );
}

const cellComponentMap: Record<
  CellTypes,
  React.FC<{ cell: Cell }>
> = {
  [CellTypes.DISPLAY]: DisplayCell,
  [CellTypes.CONTROL_SYMBOL]: ControlSymbolCell,
  [CellTypes.CHOOSE_SYMBOL]: ChooseSymbolCell,
  [CellTypes.FINISH]: FinishCell,
};

export default function CellRenderer({ cell }: { cell: Cell }) {
  const CellComponent = cellComponentMap[cell.type];

  if (!CellComponent) return null;

  return <CellComponent cell={cell} />;
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
