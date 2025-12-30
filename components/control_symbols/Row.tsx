import { ThemeType } from "@/libs/state/theme";
import { FlatList, StyleSheet, View } from "react-native";
import CellRenderer, { Cell } from "./Cell";

export enum RowTypes {
  TITLE,
  ROUTE,
  INFO,
  CONTROL,
  CROSSING,
  FINISH
}

export type RowType = typeof RowTypes[keyof typeof RowTypes];


export default function Row(cells: Cell[]) {
  return (
    <View>
      <FlatList
        data={cells}
        renderItem={({ item }) => (
          <CellRenderer cell={item} />
        )}
      >

      </FlatList>
    </View>
  )
}

const createStyles = (theme: ThemeType) => StyleSheet.create({

});