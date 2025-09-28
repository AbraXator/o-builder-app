import { Cross } from "@/constants/icons/icons";
import { createSharedStyles } from "@/constants/icons/sharedStyles";
import { appState } from "@/libs/state/store";
import { ThemeType, useTheme } from "@/libs/state/theme";
import { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
const updateCurrentCourse = appState((s) => s.updateCurrentCourse)
const removeRoute = (id: number) => {

}

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

export function RoutesModal({ routesModalProps }: {
routesModalProps: RoutesModalProps
}) {
console.log(routesModalProps.routes)
const createRoute = appState((s) => s.createRoute);
const [modalContent, setModalContent] = useState<ModalContentType>({
  type: ContentTypes.CHOOSE
})
const styles = createStyle(useTheme().theme)
const sharedStyles = createSharedStyles(useTheme().theme);

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
                  <View style={styles.header}>
                    <Text style={styles.title}>Routes</Text>
                    <ToolbarButton 
                      onPress={routesModalProps.onClose}
                      icon={<Cross/>}
                    />
                  </View>
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

export const createStyle = (theme: ThemeType) => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    marginBottom: 20,
  },
  route: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    flex: 1, 
    flexDirection: "row",
    justifyContent: "space-between"
  }
})  