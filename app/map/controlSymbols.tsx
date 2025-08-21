import { appState } from "@/libs/state/store";
import { ControlTypes } from "@/libs/types/enums";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

function renderControls(object: RenderSymbolsPartParams, currentRoute: Route) {
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

  const ControlSymbol = ({ index, kind, kindList }: { index: number, kind: string, kindList: any[] }) => {
    return (
      <TouchableOpacity key={index} style={styles.cell} onPress={() => {
        console.log(`Pressed ${kind} symbol`);
      }}>
        {kindList[0] && <SvgXml xml={kindList[0].svg} width={24} height={24} />}
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
            return (
              <ControlSymbol key={i} index={i} kind={kind} kindList={kindList} />
            );
          })}

          {/* Extra column */}
          <View style={styles.cell} />
        </View>
      )}
    />
  );
}

function chooseSymbolModal({ kind }: { kind: string }) {
  
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

  const renderMethod = {
    course_title: (object: any) => renderCourseTitle(object),
    route_info: (object: any) => renderRouteInfo(object),
    controls: (object: any) => renderControls(object, currentRoute),
    finish: (object: any) => renderFinish(object),
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
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
