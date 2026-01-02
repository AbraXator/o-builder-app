import { appState } from '@/libs/state/store';
import { ThemeType } from "@/libs/state/theme";
import { JSX, useState } from "react";
import { StyleSheet } from "react-native";

export enum CellTypes {
  DISPLAY,
  CONTROL_SYMBOL,
  CHOOSE_SYMBOL,
  FINISH
}

export type CellInteractionType = typeof CellTypes[keyof typeof CellTypes];

/*interface Cella = {
  type: CellInteractionType,
  size: number,
  text?: string;
}

interface TextCell extends BaseCell = {
  type: CellInteractionTypes.TEXT;
};

type ControlSymbolCell = {
  type: CellInteractionTypes.CONTROL_SYMBOL;
  symbol: ControlSymbol;
};

type DisplayCell = {
  type: CellInteractionTypes.DISPLAY;
};

type ChooseControlSymbolCell = {
  type: CellInteractionTypes.CONTROL_SYMBOL;
};*/

export type Cell = {
  type: CellInteractionType,
  size: number,
  text?: string,
  symbol?: ControlSymbol,
  finishType?: number
}

//PRESS
function pressTextCell(cell: TextCell) {

}

function pressControlSymbolCell(cell: SymbolCell, control: Control) {

}

function pressDisplayCell(cell: DisplayCell) {}

function pressChooseSymbolCell(cell: DisplayCell, control: Control) {

}

function TextCellRenderer(cell: TextCell) {

}

function ControlSymbolCellRenderer(cell: SymbolCell, control: Control) {

}

function DisplayCellRenderer(cell: DisplayCell) {}

function ChooseSymbolCellRenderer(cell: DisplayCell, control: Control) {

}

export default function CellRenderer(
  { cell, control }: { cell: Cell; control?: Control }
) {
  const [showTextModal, setShowTextModal] = useState<Boolean>(false);
  const currentCourseState = appState((s) => s.currentCourseState);

  const renderMethod = {
    [CellTypes.TEXT]: pressTextCell,
    [CellTypes.CONTROL_SYMBOL]: pressControlSymbolCell,
    [CellTypes.DISPLAY]: pressDisplayCell,
    [CellTypes.CHOOSE_SYMBOL]: pressChooseSymbolCell,
  } satisfies {
    [T in CellTypes]: (cell: Extract<Cell, { type: T }>, control: Control) => JSX.Element;
  };

  return (
    <View>

    </View>
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