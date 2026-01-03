import { Text } from "react-native";
import { SvgXml } from "react-native-svg";
import symbols from "../../assets/data/symbols.json";
import splits from "../../assets/data/symbolsSplit.json";

export function symbolsForKind(kind: number) {
  return (symbols as ControlSymbolData[]).filter((s) => s.kind === kind);
}

export function splitsForKind(kind: number) {
  return (splits as ControlSymbolSplit[]).find((s) => s.kind === kind);
}

export function ControlSymbolIcon({ kind, id }: {
  kind: number, 
  id: number
}) {
  const symbols = symbolsForKind(kind);
  const symbolData = symbols[id];

  if(!symbolData) return <Text>None</Text>;

  const xml: any = symbolData.svg ?? null;

  if (!xml) return <Text>None</Text>;

  return <SvgXml xml={xml} width={24} height={24} />;
}