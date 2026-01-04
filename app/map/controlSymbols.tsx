import ChooseSymbolModal from "@/components/control_symbols/ChooseSymbolModal";
import RowRenderer, { Row, RowTypes } from "@/components/control_symbols/Row";
import { appState } from "@/libs/state/store";
import { ThemeType, useTheme } from "@/libs/state/theme";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function controlSymbolsPage() {
  const styles = createStyles(useTheme().theme);
  const currentRoute = appState((s) => s.currentRoute);
  const [showChooseSymbols, setShowChooseSymbols] = useState(false);
  const [chosenKind, setChosenKind] = useState<number | undefined>();
  const [chosenControl, setChosenControl] = useState<number | undefined>();

  const openSymbolsModal = (kind: number, control: number) => {
    setShowChooseSymbols(true);
    setChosenKind(kind)
    setChosenControl(control)
  }
  const closeSymbolsModal = () => {
    setShowChooseSymbols(false);
    setChosenKind(undefined);
    setChosenControl(undefined);
  }
  const canShowModal = showChooseSymbols && chosenKind !== undefined && chosenControl !== undefined;

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
      openSymbolsModal: openSymbolsModal,
    })),
    {
      type: RowTypes.FINISH,
    }
  ]

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        {canShowModal && <ChooseSymbolModal control={chosenControl} kind={chosenKind} closeModal={closeSymbolsModal} />}
        {!canShowModal && <FlatList
          data={rows}
          renderItem={({ item }) => <RowRenderer row={item} />}
        />}
      </View>
    </View>
  )
}

const createStyles = (theme: ThemeType) => StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: theme.control500
  },
  container: {
    flex: 1,
    marginVertical: 16
  }
})