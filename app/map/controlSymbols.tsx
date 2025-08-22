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
    return (
      <TouchableOpacity key={index} style={styles.cell} onPress={() => {
        setShowModal(true);
        setChosenKind(kind);
      }}>
        {kindList[0] && <SvgXml xml={kindList[symbolId].svg} width={24} height={24} />}
      </TouchableOpacity>
    )
  }

  return (
    <FlatList
      data={object.content as Control[]}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.row}>
          {/* Control number */}
          <View style={styles.cell}>
            <SymbolA item={item} />
          </View>

          {/* Control code */}
          <View style={styles.cell}>
            <Text style={styles.text}>{item.code}</Text>
          </View>

          {/* Symbol columns */}
          {Array.from({ length: 3 }).map((_, i) => {
            const kind = String.fromCharCode(99 + i).toUpperCase();
            const kindList = (symbols as any[]).filter((s) => s.kind === kind);
            const symbolId = item.symbols[kindToIndex(kind)].code !== undefined? item.symbols[kindToIndex(kind)].code : 0;
            return (
              <ControlSymbol key={i} index={i} kind={kind} kindList={kindList} symbolId={symbolId} />
            );
          })}

          {/* Extra column */}
          <View style={styles.cell} />
        </View>
      )}
    />
  );
}

function ChooseSymbolModal({ currentRoute, updateCurrentRoute, control, kind, setShowModal }: { currentRoute: Route, updateCurrentRoute: (data: Partial<Route>) => void, control: Control, kind: string, setShowModal: SetState<boolean> }) {
  console.log(`ChooseSymbolModal opened for kind: ${kind}`);
  const symbolsForKind = (symbols as any[]).filter((s) => s.kind === kind.toUpperCase() && s.svg);

  if(!symbolsForKind.length) {
    console.warn("No symbols found for kind");
  } 

  return (
    <View>
      <Modal>
        <FlatList
          data={symbolsForKind}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {
              console.log(`Selected symbol: ${item.id}`);
              const editedControls = currentRoute.controls;
              const controlIndex = editedControls.findIndex((c) => c === control);
              const symbolIndex = kindToIndex(kind);
              const editedSymbols = control.symbols.splice(symbolIndex, 0, item.id);
              control = { ...control, symbols: [...editedSymbols] };

              editedControls.splice(controlIndex, 0, control);
              updateCurrentRoute({ controls: editedControls });
              setShowModal(false);
            }}>
              <SvgXml xml={item.svg} width={24} height={24} />
            </TouchableOpacity>
          )}
        />
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
      {Array.from({ length: 5 }).map((_, i) => (
        <View key={i} style={styles.cell} />
      ))}
      <View style={styles.cell} />
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
