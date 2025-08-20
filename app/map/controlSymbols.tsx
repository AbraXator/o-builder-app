import { Start } from "@/constants/icons/controlIcons";
import { appState } from "@/libs/state/store";
import { ControlTypes } from "@/libs/types/enums";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

function fullSymbolsList(currentCourse: Course, currentRoute: Route, controls: Control[]) {
  return [
    {
      id: "course_title",
      content: currentCourse.name,
    },
    {
      id: "route_info",
      content: [
        {
          id: "route_title",
          content: currentRoute.name
        },
        {
          id: "route_lenght",
          content: currentRoute.length
        },
        {
          id: "route_climb",
          content: currentRoute.climb
        }
      ]
    },
    {
      id: "controls",
      content: controls,
    },
    {
      id: "finish",
      content: 100 //TODO: Calculate last control - finish distance
    }
  ];
}

type RenderSymbolsPartParams = { id: string, content: any };

function renderCourseTitle(object: RenderSymbolsPartParams) {
  const title = object.content as string;

  return (
    <View>
      <Text>
        o
      </Text>
    </View>
  )
}

function renderRouteInfo(object: RenderSymbolsPartParams) {
  return (
    <View>
      <FlatList
        data={object.content as RenderSymbolsPartParams[]}
        renderItem={({ item }) =>
          <View>
            <Text>
              {item.content as String}
            </Text>
          </View>
        }
      />
    </View>
  )
}

function renderControls(object: RenderSymbolsPartParams) {
  return (
    <FlatList
      data={object.content as Control[]}
      renderItem={({ item }) =>
        <View>
          <View>
            {item.type === ControlTypes.START && <Start />}
            {item.type === ControlTypes.CONTROL && item.number}
          </View>

          <View>
            {item.code}
          </View>

          {Array.from({ length: 5 }).map((_, i) => {
            const kind = String.fromCharCode(97 + i)
            return (
              <View>
                <SvgXml xml={}>
              </View>
            )
          })}
        </View>
      }
    />
  )
}

export default function controlSymbolsPage() {
  const currentCourse = appState((s) => s.currentCourse);
  const currentCourseState = appState((s) => s.currentCourseState);
  const currentRoute = currentCourse.routes[currentCourseState.currentRoute];
  const controls = currentRoute.controls;
  const renderMethod = {
    course_title: (object: any) => renderCourseTitle(object),
    route_info: (object: any) => renderRouteInfo(object),
    controls: (object: any) => renderControls(object),
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <FlatList
          data={fullSymbolsList(currentCourse, currentRoute, controls)}
          renderItem={(object) => {
            return <View></View>;
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}