import { MapView, MapViewProps, moveMapToCoords } from "@/components/MapView";
import { kindToIndex } from "@/hooks/ControlHooks";
import { appState } from "@/libs/state/store";
import { ControlTypes } from "@/libs/types/enums";
import { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import symbols from "../../assets/data/symbols.json";

function fullSymbolsList(currentCourse: Course, currentRoute: Route, controls: Control[]) {
  return [
    {
      id: "course_title",
      content: currentCourse.name,
    },
    {
      id: "route_info",
      content: [
        { id: "route_title", content: currentRoute.name },
        { id: "route_length", content: `${currentRoute.length} km` },
        { id: "route_climb", content: `${currentRoute.climb} m` }
      ]
    },
    {
      id: "controls",
      content: controls,
    },
    {
      id: "finish",
      content: "Finish"
    }
  ];
}

type RenderSymbolsPartParams = { id: string, content: any };

function renderCourseTitle(object: RenderSymbolsPartParams) {
  return (
    <View style={styles.row}>
      <View style={[styles.cell, { flex: 8 }]}>
        <Text style={styles.text}>{object.content}</Text>
      </View>
    </View>
  );
}

function renderRouteInfo(object: RenderSymbolsPartParams) {
  return (
    <View style={styles.row}>
      {object.content.map((item: any, idx: number) => (
        <View key={idx} style={[styles.cell, { flex: 8 }]}>
          <Text style={styles.text}>{item.content}</Text>
        </View>
      ))}
    </View>
  );
}

function renderControls(setShowModal: SetState<boolean>, setChosenKind: SetState<string | null>, object: RenderSymbolsPartParams, currentRoute: Route) {
  const SymbolA = ({ item }: { item: Control }) => {
    const isAllControls = currentRoute.id === 0;
    const isStart = item.type === ControlTypes.START;

    if (isStart) {
      return (
        <SvgXml xml={(symbols as any[]).filter((s) => s.kind === "A")[0].svg} width={24} height={24} />
      )
    } else if (isAllControls) {
      return;
    } else {
      return (
        <Text style={styles.text}>{item.number}</Text>
      );
    }
  }

  const ControlSymbol = ({ index, kind, kindList, symbolId }: { index: number, kind: string, kindList: any[], symbolId: number }) => {
    const symbolData = kindList[symbolId];
    const xml = symbolData ? symbolData.svg : null;
    const validSvgXml = xml !== null && xml !== undefined && xml.length > 0;

    return (
      <TouchableOpacity key={index} style={styles.cell} onPress={() => {
        setShowModal(true);
        setChosenKind(kind);
      }}>
        {validSvgXml && <SvgXml xml={xml} width={24} height={24} />}
      </TouchableOpacity>
    );
  }

  return (
    <FlatList
      data={object.content as Control[]}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View style={styles.cell}>
            <SymbolA item={item} />
          </View>

          <View style={styles.cell}>
            <Text style={styles.text}>{item.code}</Text>
          </View>

          {Array.from({ length: 6 }).map((_, i) => {
            const kind = String.fromCharCode(99 + i).toUpperCase();
            const kindList = (symbols as any[]).filter((s) => s.kind === kind);
            const symbolId = item.symbols[kindToIndex(kind)]?.symbolId ?? -1;
            return (
              <ControlSymbol key={i} index={i} kind={kind} kindList={kindList} symbolId={symbolId} />
            );
          })}
        </View>
      )}
    />
  );
}

function ChooseSymbolModal({ currentRoute, updateCurrentRoute, control, kind, setShowModal }: { currentRoute: Route, updateCurrentRoute: (data: Partial<Route>) => void, control: Control, kind: string, setShowModal: SetState<boolean> }) {
  console.log(`ChooseSymbolModal opened for kind: ${kind}`);
  const symbolsForKind = (symbols as any[]).filter((s) => s.kind === kind.toUpperCase() && s.svg);
  const mapViewProps: MapViewProps = {
    imageUri: appState((s) => s.currentCourse.map),
    scale: 0.5,
    rotation: 0,
    translationX: control.coords[0],
    translationY: control.coords[1],
  }
  moveMapToCoords(control.coords, mapViewProps);

  if (!symbolsForKind.length) {
    console.warn("No symbols found for kind");
  }

  return (
    <View style={{ flex: 1 }}>
      <Modal>
        <FlatList
          data={symbolsForKind}
          keyExtractor={(item) => item.id}
          numColumns={5}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {
              console.log(`Selected symbol: ${item.id}`);
              const editedControls = currentRoute.controls;
              const controlIndex = editedControls.findIndex((c) => c === control);
              const symbolIndex = kindToIndex(kind);
              console.log("item: ", item);
              control.symbols[symbolIndex] = {
                kind: kind,
                symbolId: item.index
              };
              control = { ...control, symbols: [...control.symbols] };

              editedControls[controlIndex] = control;
              updateCurrentRoute({ controls: editedControls });
              setShowModal(false);
            }}>
              <SvgXml xml={item.svg} width={24} height={24} />
            </TouchableOpacity>
          )}
        />
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', maxHeight: 400, maxWidth: 50 }}>
          <Text>Control preview</Text>
          <View style={{ flex: 1, backgroundColor: '#ff0000ff', maxHeight: 100, maxWidth: 50 }}>
            <MapView mapViewProps={mapViewProps} />
          </View>
        </View>
      </Modal>
    </View>
  )
}

function renderFinish(object: RenderSymbolsPartParams) {
  return (
    <View style={styles.row}>
      <View style={styles.cell}>
        <Text style={styles.text}>◎</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.text}>{object.content}</Text>
      </View>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} style={styles.cell} />
      ))}
    </View>
  );
}

export default function ControlSymbolsPage() {
  const currentCourse = appState((s) => s.currentCourse);
  const currentCourseState = appState((s) => s.currentCourseState);
  const currentRoute = currentCourse.routes[currentCourseState.currentRoute];
  const controls = currentRoute.controls;
  const updateCurrentRoute = appState((s) => s.updateCurrentRoute);
  const [showModal, setShowModal] = useState(false);
  const [chosenKind, setChosenKind] = useState<string | null>(null);

  const renderMethod = {
    course_title: (object: any) => renderCourseTitle(object),
    route_info: (object: any) => renderRouteInfo(object),
    controls: (object: any) => renderControls(setShowModal, setChosenKind, object, currentRoute),
    finish: (object: any) => renderFinish(object),
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        {showModal && chosenKind && (
          <ChooseSymbolModal currentRoute={currentRoute} updateCurrentRoute={updateCurrentRoute} control={currentRoute.controls[0]} kind={chosenKind} setShowModal={setShowModal} />
        )}
        <FlatList
          data={fullSymbolsList(currentCourse, currentRoute, controls)}
          renderItem={({ item }) => (
            <View>{(renderMethod as any)[item.id](item)}</View>
          )}
        />
        <TouchableOpacity onPress={() => {
          const controls = currentRoute.controls;
          console.log("Current route controls:", controls);
          const symbolsFromControl = controls.flatMap(control => control.symbols);
          console.log("Symbols from controls:", symbolsFromControl);
        }}><Text>Print controls</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  cell: {
    borderWidth: 1,
    borderColor: "#000",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    textAlign: "center",
  },
});
