import RowRenderer, { Row, RowTypes } from "@/components/control_symbols/Row";
import { appState } from "@/libs/state/store";
import { ThemeType, useTheme } from "@/libs/state/theme";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function controlSymbolsPage() {
  const styles = createStyles(useTheme().theme);
  const currentRoute = appState((s) => s.currentRoute);
  const rows: Row[] = [
    {
      type: RowTypes.TITLE,
    },
    {
      type: RowTypes.ROUTE,
      route: currentRoute(),
    },
    ...currentRoute().controls.map((control) => ({
      type: RowTypes.CONTROL,
      control: control,
    })),
    {
      type: RowTypes.FINISH,
    }
  ]

  return (
    <View style={styles.container}>
      <FlatList 
        data={rows}
        renderItem={({ item }) => <RowRenderer row={item}/>}
      />
    </View>
  )
}

const createStyles = (theme: ThemeType) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.control500
  }
})