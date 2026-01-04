import { appState } from "@/libs/state/store";
import { ThemeType, useTheme } from "@/libs/state/theme";
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { splitsForKind, symbolsForKind } from "./symbolsHooks";

function SymbolTypeColumn({
  type,
  controlIndex,
  kind,
  closeModal
}: {
  type: ControlSymbolType;
  controlIndex: number;
  kind: number;
  closeModal: () => void;
}) {
  const symbols = symbolsForKind(kind).slice(type.start, type.end);

  const currentRoute = appState((s) => s.currentRoute);
  const updateCurrentRoute = appState((s) => s.updateCurrentRoute);

  const styles = createStyles(useTheme().theme);

  const color = type.color ?? "#000000";
  const iconSize = 24;
  const gap = 8;
  const screenWidth = Dimensions.get("window").width;

  const maxColumnsByWidth = Math.floor(
    screenWidth / (iconSize + gap * 2)
  );

  const numColumns = Math.max(
    1,
    Math.min(maxColumnsByWidth, symbols.length)
  );

  const handleSelectingSymbol = (symbol: ControlSymbolData) => {
    const route = currentRoute();

    const editedControls = route.controls.map((control) =>
      control.index === controlIndex
        ? {
          ...control,
          symbols: control.symbols.map(() => ({
            kind,
            symbolId: Number(symbol.id),
          })),
        }
        : control
    );

    updateCurrentRoute({ controls: editedControls });
    closeModal();
  };

  const renderItem = ({ item }: { item: ControlSymbolData }) => (
    <TouchableOpacity style={styles.symbolButton} onPress={() => handleSelectingSymbol(item)}>
      <SvgXml xml={item.svg} width={24} height={24} />
    </TouchableOpacity>
  );

  return (
    <View>
      <Text style={{ color }}>{type.name}</Text>

      <FlatList
        key={numColumns}
        numColumns={numColumns}
        data={symbols}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
      />
    </View>
  );
}

export default function ChooseSymbolModal({ control, kind, closeModal }: {
  control: number,
  kind: number,
  closeModal: () => void,
}) {
  const styles = createStyles(useTheme().theme);
  const splits = splitsForKind(kind);

  if (!splits) {
    console.error(`Unable to render symbol modal, no symbols for kind: ${kind} were found`);
    return <View></View>
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={splits?.types}
        renderItem={(o) => <SymbolTypeColumn type={o.item} controlIndex={control} kind={kind} closeModal={closeModal} />}
      />
    </View>
  )
}

const createStyles = (theme: ThemeType) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.neutral100
  },
  symbolButton: {
    margin: 2
  }
})