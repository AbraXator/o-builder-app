import { appState } from "@/libs/state/store";
import { ThemeType } from "@/libs/state/theme";
import { FlatList, StyleSheet, Text, View } from "react-native";
import CellRenderer, { Cell, CellTypes } from "./Cell";

export enum RowTypes {
  TITLE,
  ROUTE,
  CONTROL,
  CROSSING,
  FINISH
}

export type RowType = typeof RowTypes[keyof typeof RowTypes];

export type Row = {
  type: RowTypes;
  control: Control
};

function renderTitleRow(row: Row) { //TITLE
  const currentCourse = appState((s) => s.currentCourse);

  return (
    <View>
      <CellRenderer
        cell={{
          type: CellTypes.DISPLAY,
          size: 8,
          text: currentCourse.name
        }}
      />
    </View>
  );
}

function renderRouteRow(row: Row) { //ROUTE NAME, ROUTE LENGTH, ROUTE CLIMB
  const currentRoute = appState((s) => s.currentRoute);
  const cells: Cell[] = [
    { type: CellTypes.DISPLAY, size: 3, text: currentRoute().name },
    { type: CellTypes.DISPLAY, size: 3, text: currentRoute().length.toString() },
    { type: CellTypes.DISPLAY, size: 2, text: currentRoute().climb.toString() },
  ]

  return (
    <FlatList
      data={cells}
      renderItem={({ item }) => (
        <CellRenderer cell={item} />
      )}
    />
  );
}

function renderControlRow(row: Row) { //CONTROL NUMBER, CONTROL CODE, 6 CONTROL SYMBOLS
  const cells: Cell[] = [
    {
      type: CellTypes.DISPLAY,
      size: 1,
      text: row.control.number.toString(),
    },
    {
      type: CellTypes.DISPLAY,
      size: 1,
      text: row.control.code.toString(),
    },
    ...row.control.symbols.slice(0, 6).map(symbol => ({
      type: CellTypes.CONTROL_SYMBOL,
      size: 1,
      symbol,
    })),
  ];

  return (
    <FlatList
      data={cells}
      renderItem={({ item }) => (
        <CellRenderer cell={item} />
      )}
    />
  );
}

function renderCrossingRow(row: Row) {
  return <Text>TO-DO</Text>;
}

function renderFinishRow(row: Row) {
  return (
    <View>
      <CellRenderer
        cell={{
          type: CellTypes.DISPLAY,
          size: 8,
        }}
      />
    </View>
  );
}


export default function Row(cells: Cell[]) {
  const renderRowMethod = {
    [RowTypes.TITLE]: renderTitleRow,
    [RowTypes.ROUTE]: renderRouteRow,
    [RowTypes.CONTROL]: renderControlRow,
    [RowTypes.CROSSING]: renderCrossingRow,
    [RowTypes.FINISH]: renderFinishRow,
  } as any;


  return (
    <View>
      <FlatList
        data={cells}
        renderItem={({ item }) => (
          <CellRenderer cell={item} />
        )}
      />
    </View>
  )
}

const createStyles = (theme: ThemeType) => StyleSheet.create({

});