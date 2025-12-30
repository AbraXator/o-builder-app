import { ThemeType } from "@/libs/state/theme";
import { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { TextCellModalProps } from "./TextCellModal";

enum CellInteractionTypes {
  DISPLAY,
  SYMBOL,
  TEXT,
}

type TextCell = {
  type: CellInteractionTypes.TEXT;
  text: string;
};

type SymbolCell = {
  type: CellInteractionTypes.SYMBOL;
  symbol: ControlSymbol;
};

type DisplayCell = {
  type: CellInteractionTypes.DISPLAY;
};

export type Cell = TextCell | SymbolCell | DisplayCell;

function pressTextCell(cell: TextCell, control: Control) {

}

function pressSymbolCell(cell: SymbolCell) {}

export default function CellRenderer(
  { cell, control }: { cell: Cell; control: Control }
) {
  const renderMethod = {
    [CellInteractionTypes.TEXT]: pressTextCell,
    [CellInteractionTypes.SYMBOL]: pressSymbolCell,
    [CellInteractionTypes.DISPLAY]: (cell, control) => {},
  } satisfies {
    [T in CellInteractionTypes]: (cell: Extract<Cell, { type: T }>, control: Control) => void;
  };
  const [modalProps, setModalProps] = useState<TextCellModalProps>({
    
  });

  return (
    <TouchableOpacity>

    </TouchableOpacity>
  )
}

const createStyles = (theme: ThemeType) => StyleSheet.create({
  cell: {
    borderWidth: 1,
    backgroundColor: "#FFF",
    borderColor: "#000",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});