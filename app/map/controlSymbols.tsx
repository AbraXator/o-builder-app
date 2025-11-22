import { MapView, MapViewProps, moveMapToCoords } from "@/components/map_view/MapView";
import { Notification, NotificationState } from "@/components/Notification";
import { kindToIndex } from "@/hooks/CourseHooks";
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
      content: 100,
    }
  ];
}

function renderCourseTitle(title: string) {
  return (
    <View style={styles.row}>
      <View style={[styles.cell, { flex: 8 }]}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </View>
  );
}

type RouteParams = {
  id: string,
  content: any
}[];

function renderRouteInfo(routeParams: { id: string, content: any }[]) {
  return (
    <View style={styles.row}>
      {routeParams.map((routeParameter: any, id: number) => (
        <View key={id} style={[styles.cell, { flex: 8 }]}>
          <Text style={styles.text}>{routeParameter.content}</Text>
        </View>
      ))}
    </View>
  );
}

function renderControls(setShowModal: SetState<boolean>, setChosenControl: SetState<Control | null>, setChosenKind: SetState<string | null>, controls: Control[], currentRoute: Route) {
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
        <Text style={styles.text}>{item.number.number}</Text>
      );
    }
  }

  const ControlSymbol = ({ control, index, kind, kindList, symbolId }: { control: Control, index: number, kind: string, kindList: any[], symbolId: number }) => {
    const symbolData = kindList[symbolId];
    const xml = symbolData ? symbolData.svg : null;
    const validSvgXml = xml !== null && xml !== undefined && xml.length > 0;

    return (
      <TouchableOpacity key={index} style={styles.cell} onPress={() => {
        setShowModal(true);
        setChosenKind(kind);
        setChosenControl(control);
      }}>
        {validSvgXml && <SvgXml xml={xml} width={24} height={24} />}
      </TouchableOpacity>
    );
  }

  return (
    <FlatList
      data={controls}
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
              <ControlSymbol control={item} key={i} index={i} kind={kind} kindList={kindList} symbolId={symbolId} />
            );
          })}
        </View>
      )}
    />
  );
}

function addEmptySymbolToModal(symbols: any[], kind: string) {
  symbols.unshift({ index: -1, id: "empty", name: "empty", kind: { kind }, svg: "" });
}

function ChooseSymbolModal({ currentRoute, updateCurrentRoute, control, kind, setShowModal }: { currentRoute: Route, updateCurrentRoute: (data: Partial<Route>) => void, control: Control | null, kind: string, setShowModal: SetState<boolean> }) {
  if (control === null) {
    console.warn("No control found");
    return null;
  }

  const safeControl = control!;

  const symbolsForKind = (symbols as any[]).filter((s) => s.kind === kind.toUpperCase() && s.svg);
  addEmptySymbolToModal(symbolsForKind, kind);

  const mapViewProps: MapViewProps = {
    imageUri: appState((s) => s.currentCourse.map),
    scale: 0.5,
    rotation: 0,
    translationX: safeControl.coords.x,
    translationY: safeControl.coords.y,
  }
  moveMapToCoords(safeControl.coords, mapViewProps);

  const IconForSymbol = ({ xml }: { xml: string }) => {
    if (xml && xml.length > 0) {
      return <SvgXml xml={xml} width={24} height={24} />;
    } else {
      return <Text style={styles.text}>None</Text>;
    }
  }

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
              const editedControls = currentRoute.controls;
              const controlIndex = editedControls.findIndex((c) => {
                return c.code === safeControl.code;
              });
              const symbolIndex = kindToIndex(kind);
              safeControl.symbols[symbolIndex] = {
                kind: kind,
                symbolId: item.index
              };
              const editedControl = { ...safeControl, symbols: [...safeControl.symbols] };

              editedControls[controlIndex] = editedControl;
              updateCurrentRoute({ controls: editedControls });
              setShowModal(false);
            }}>
              <IconForSymbol xml={item.svg} />
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

function renderFinish(distToFinish: number) {
  return (
    <View style={styles.row}>
      <View style={[styles.cell, { flex: 8 }]}>
        <Text>TODO: FINISH</Text>
      </View>
    </View>
  );
}

function initSymbolsPart<T>(symbolsPartObject: { id: string, content: any }, predicate: (content: any) => content is T, notificationState: NotificationState, setNotificationState: SetState<NotificationState>):
  symbolsPartObject is { id: string, content: T } {
  if (predicate(symbolsPartObject.content)) {
    return true;
  }

  setNotificationState({
    ...notificationState,
    show: true
  });

  return false;
}

const isContentForCourseTitle = (content: any): content is string => typeof content === "string";
const isContentForRouteInfo = (content: any): content is RouteParams => Array.isArray(content);
const isContentForControls = (content: any): content is Control[] => Array.isArray(content) && content.every(c => typeof c.code === "number" && Array.isArray(c.coords) && c.coords.length === 2);
const isContentForFinish = (content: any): content is number => typeof content === "number";

export default function ControlSymbolsPage() {
  const currentCourse = appState((s) => s.currentCourse);
  const currentCourseState = appState((s) => s.currentCourseState);
  const currentRoute = currentCourse.routes[currentCourseState.currentRoute];
  const controls = currentRoute.controls;
  const updateCurrentRoute = appState((s) => s.updateCurrentRoute);
  const [showModal, setShowModal] = useState(false);
  const [chosenKind, setChosenKind] = useState<string | null>(null);
  const [chosenControl, setChosenControl] = useState<Control | null>(null);
  const [notificationState, setNotificationState] = useState<NotificationState>({
    show: false,
    message: 'Unexpected error while loading symbols, please try again',
    type: 'error',
  });



  const renderMethod = {
    course_title: (object: any) =>
      initSymbolsPart(object, isContentForCourseTitle, notificationState, setNotificationState) ? renderCourseTitle(object.content) : null,
    route_info: (object: any) =>
      initSymbolsPart(object, isContentForRouteInfo, notificationState, setNotificationState) ? renderRouteInfo(object.content) : null,
    controls: (object: any) =>
      initSymbolsPart(object, isContentForControls, notificationState, setNotificationState) ? renderControls(setShowModal, setChosenControl, setChosenKind, object.content, currentRoute) : null,
    finish: (object: any) =>
      initSymbolsPart(object, isContentForFinish, notificationState, setNotificationState) ? renderFinish(object.content) : null,
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        {showModal && chosenKind && (
          <ChooseSymbolModal currentRoute={currentRoute} updateCurrentRoute={updateCurrentRoute} control={chosenControl} kind={chosenKind} setShowModal={setShowModal} />
        )}
        {notificationState.show && (
          <Notification message={notificationState.message} type={notificationState.type} onClose={() => setNotificationState({ ...notificationState, show: false })} />
        )}
        <FlatList
          data={fullSymbolsList(currentCourse, currentRoute, controls)}
          renderItem={({ item }) => (
            <View>{(renderMethod as any)[item.id](item)}</View>
          )}
        />
        {/*<TouchableOpacity onPress={() => {
          const controls = currentRoute.controls;
          const symbolsFromControl = controls.flatMap(control => control.symbols);
        }}><Text>Print controls</Text>
        </TouchableOpacity>*/}
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
