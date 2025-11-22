import { Add, Cross } from "@/constants/icons/icons";
import { createSharedStyles } from "@/constants/sharedStyles";
import { getCurrentRoute } from "@/hooks/CourseHooks";
import { appState } from "@/libs/state/store";
import { ThemeType, useTheme } from "@/libs/state/theme";
import { setCourse } from "@/libs/storage/AsyncStorage";
import { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import ToolbarButton from "./ToolbarButton";

export type RoutesModalProps = {
  routes: Route[];
  currentRoute: Route;
  showModal: boolean;
  onClose: () => void;
}

function SingleRoute({ route, highlighted }: {
  route: Route;
  highlighted: boolean;
}) {
  const { theme } = useTheme();
  const currentCourse = appState((s) => s.currentCourse);
  const routes = currentCourse.routes;
  const styles = createStyles(useTheme().theme);

  return (
    <TouchableOpacity
      onPress={() => {
        routes.filter
      }}
      style={[
        styles.route,
        { backgroundColor: highlighted ? theme.base200 : "transparent" }
      ]}>
      <Text>
        {`Route: ${route.name}`}
      </Text>
    </TouchableOpacity>
  )
}

enum ContentTypes {
  CHOOSE = "choose",
  CREATE = "create"
}

type ModalContentType = {
  type: typeof ContentTypes[keyof typeof ContentTypes];
}

type FormData = {
  routeName: string;
  routeLength: number;
  routeClimb: number;
}

function SelectRouteModal({ routesModalProps, setModalContent }: {
  routesModalProps: RoutesModalProps
  setModalContent: SetState<ModalContentType>
}) {
  const currentCourseState = appState().currentCourseState;
  const currentCourse = appState().currentCourse;
  const isRouteSelected = (route: Route) => {
    return route.id === getCurrentRoute(currentCourseState, currentCourse).id;
  }
  const createRoute = appState((s) => s.createRoute);
  const styles = createStyles(useTheme().theme);

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Routes</Text>
        <ToolbarButton onPress={routesModalProps.onClose} icon={<Cross />} />
      </View>

      <FlatList
        data={routesModalProps.routes}
        renderItem={({ item }) => <SingleRoute route={item} highlighted={isRouteSelected(item)} />}
        keyExtractor={(item, index) => item.id.toString()}
      />
      <View style={styles.LowerToolbar}>
        <ToolbarButton
          onPress={() => setModalContent({ type: ContentTypes.CREATE })}
          icon={<Add />}
        />
      </View>
    </View>
  )
}

function CreateRouteModal({ routesModalProps, setModalContent }: {
  routesModalProps: RoutesModalProps,
  setModalContent: SetState<ModalContentType>
}) {
  const currentCourse = appState().currentCourse;
  const currentCourseState = appState().currentCourseState;
  const styles = createStyles(useTheme().theme);
  const [formData, setFormData] = useState<FormData>({
    routeName: "",
    routeLength: -1,
    routeClimb: -1,
  })
  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name !== "routeName" ? parseFloat(value) || undefined : value,
    }));
  }
  const saveRoute = async () => {
    if (
      formData.routeClimb === -1 ||
      formData.routeLength === -1 ||
      formData.routeName === ""
    ) {
      return;
    }

    let editedRoutes: Route[] = currentCourse.routes;
    editedRoutes.push({
      id: currentCourse.routes.length,
      name: formData.routeName,
      climb: formData.routeClimb,
      length: formData.routeLength,
      controls: []
    })

    if (currentCourse.id !== undefined) {
      await setCourse({
        ...currentCourse,
        routes: editedRoutes
      }, currentCourse.id)

      setModalContent({ type: ContentTypes.CHOOSE })
      console.log(currentCourse.routes)
    }
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Create Route</Text>
        <ToolbarButton onPress={() => setModalContent({ type: ContentTypes.CHOOSE })} icon={<Cross />} />
      </View>

      <View>
        <Text>Route name:</Text>
        <TextInput
          value={formData.routeName}
          onChangeText={(val) => handleChange('routeName', val)}
        />
      </View>

      <View>
        <Text>Route length:</Text>
        <TextInput
          keyboardType="numeric"
          value={formData.routeLength !== -1 ? formData.routeLength.toString() : ''}
          onChangeText={(val) => handleChange('routeLength', val)}
        />
      </View>

      <View>
        <Text>Route climb:</Text>
        <TextInput
          keyboardType="numeric"
          value={formData.routeClimb !== -1 ? formData.routeClimb.toString() : ''}
          onChangeText={(val) => handleChange('routeClimb', val)}
        />
      </View>

      <TouchableOpacity onPress={saveRoute}>
        <Text>
          CREATE ROUTE
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export function RoutesModal({ routesModalProps }: {
  routesModalProps: RoutesModalProps
}) {
  console.log(routesModalProps.routes)
  const createRoute = appState((s) => s.createRoute);
  const [modalContent, setModalContent] = useState<ModalContentType>({
    type: ContentTypes.CHOOSE
  })
  const sharedStyles = createSharedStyles(useTheme().theme);
  const styles = createStyles(useTheme().theme);

  return (
    <View>
      <Modal
        transparent={true}
        animationType="fade"
        visible={routesModalProps.showModal}
        onRequestClose={routesModalProps.onClose}
      >
        <View style={{ flex: 1 }}>
          <View style={sharedStyles.modalBackdrop}>
            <View style={sharedStyles.modalContainer}>
              {modalContent.type === ContentTypes.CHOOSE &&
                <View>
                  <Text style={styles.title}>Routes</Text>
                  <FlatList
                    data={routesModalProps.routes}
                    renderItem={({ item }) => <SingleRoute route={item} highlighted={false} />}
                    keyExtractor={(item, index) => item.id.toString()}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      createRoute({
                        id: 0,
                        name: "asaifei",
                        length: 20,
                        climb: 20,
                        controls: [],
                      })
                    }}
                  >
                    <Text>
                      NEW ROUTE
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const createStyles = (theme: ThemeType) => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    marginVertical: 64
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingHorizontal: 16
  },
  LowerToolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
    paddingHorizontal: 16
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  route: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
})  