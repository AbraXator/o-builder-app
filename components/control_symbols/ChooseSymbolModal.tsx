import { appState } from "@/libs/state/store";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { splitsForKind, symbolsForKind } from "./symbolsHooks";

function SymbolTypeColumn({
  type,
  controlIndex,
  kind,
  setShowModal
}: {
  type: ControlSymbolType;
  controlIndex: number;
  kind: number;
  setShowModal: SetState<boolean>;
}) {
  const symbols = symbolsForKind(kind).slice(type.start, type.end);

  const currentRoute = appState((s) => s.currentRoute);
  const updateCurrentRoute = appState((s) => s.updateCurrentRoute);

  const color = type.color ?? "#000000";

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
    setShowModal(false);
  };

  const renderItem = ({ item }: { item: ControlSymbolData }) => (
    <TouchableOpacity onPress={() => handleSelectingSymbol(item)}>
      <SvgXml xml={item.svg} width={24} height={24} />
    </TouchableOpacity>
  );

  return (
    <View>
      <Text style={{ color }}>{type.name}</Text>

      <FlatList
        data={symbols}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        horizontal
      />
    </View>
  );
}

export default function ChooseSymbolModal({ control, kind, setShowModal }: {
  control: number,
  kind: number,
  setShowModal: SetState<boolean>
}) {
  const splits = splitsForKind(kind);

  return (
    <View>
      <FlatList
        data={splits?.types}
        renderItem={(o) => <SymbolTypeColumn type={o.item} controlIndex={control} kind={kind} setShowModal={setShowModal} />}
      />
    </View>
  )
}