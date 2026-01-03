import { appState } from "@/libs/state/store";
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
  control?: Control;
  route?: Route;
};

export function TitleRow({ row }: { row: Row }) {
  const currentCourse = appState((s) => s.currentCourse);

  return (
    <View style={styles.row}>
      <CellRenderer
        cell={{
          type: CellTypes.DISPLAY,
          size: 8,
          text: currentCourse.name,
        }}
      />
    </View>
  );
}

export function RouteRow({ row }: { row: Row }) {
  const route = row.route;

  if (!route) return <View style={styles.row} />;

  const cells: Cell[] = [
    { type: CellTypes.DISPLAY, size: 3, text: route.name },
    { type: CellTypes.DISPLAY, size: 3, text: route.length.toString() },
    { type: CellTypes.DISPLAY, size: 2, text: route.climb.toString() },
  ];

  return (
    <FlatList
      style={styles.row}
      data={cells}
      horizontal
      renderItem={({ item }) => <CellRenderer cell={item} />}
      keyExtractor={(_, index) => index.toString()}
    />
  );
}

export function ControlRow({ row }: { row: Row }) {
  if (!row.control) return <View style={styles.row} />;

  const cells: Cell[] = [
    { type: CellTypes.DISPLAY, size: 1, text: row.control.number.toString() },
    { type: CellTypes.DISPLAY, size: 1, text: row.control.code.toString() },
    ...row.control.symbols.slice(0, 6).map((symbol) => ({
      type: CellTypes.CONTROL_SYMBOL,
      size: 1,
      symbol,
      control: row.control,
    })),
  ];

  return (
    <FlatList
      style={styles.row}
      data={cells}
      horizontal
      renderItem={({ item }) => <CellRenderer cell={item} />}
      keyExtractor={(_, index) => index.toString()}
    />
  );
}

export function CrossingRow({ row }: { row: Row }) {
  return (
    <View style={styles.row}>
      <Text>TO-DO</Text>
    </View>
  );
}

export function FinishRow({ row }: { row: Row }) {
  return (
    <View style={styles.row}>
      <CellRenderer
        cell={{
          type: CellTypes.DISPLAY,
          size: 8,
        }}
      />
    </View>
  );
}

const rowComponentMap: Record<RowTypes, React.FC<{ row: Row }>> = {
  [RowTypes.TITLE]: TitleRow,
  [RowTypes.ROUTE]: RouteRow,
  [RowTypes.CONTROL]: ControlRow,
  [RowTypes.CROSSING]: CrossingRow,
  [RowTypes.FINISH]: FinishRow,
};

export default function RowRenderer({ row }: { row: Row }) {
  const RowComponent = rowComponentMap[row.type];
  if (!RowComponent) return null;

  return <RowComponent row={row} />;
}

const styles = StyleSheet.create({
  row: {
    marginVertical: 4,
  },
});