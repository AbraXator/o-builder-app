import { useTheme } from "@/libs/state/theme";
import { Modal, StyleSheet, Text, View } from "react-native";

type RoutesModalProps = {
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

  return (
    <View style={[
      styles.route,
      { backgroundColor: highlighted ? theme.base200 : "transparent" }
    ]}>

    </View>
  )
}

export default function RoutesModal({ routesModalProps }: {
  routesModalProps: RoutesModalProps
}) {
  return (
    <View>
      <Modal
        transparent={true}
        animationType="fade"
        visible={routesModalProps.showModal}
        onRequestClose={routesModalProps.onClose}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.backdrop}>
            <View style={styles.container}>
              <Text style={styles.title}>Routes</Text>

            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
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
    justifyContent: "space-evenly",
    alignItems: "center"
  }
})