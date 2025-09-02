import { ThemeType, useTheme } from "@/libs/state/theme";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function ToolbarButton({ active, icon, label, onPress }: {
  active?: boolean;
  icon?: React.JSX.Element;
  label?: string;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const style = createStyles(theme);

  return (
    <TouchableOpacity style={[
      style.button,
      { backgroundColor: active ? theme.neutral300 : theme.neutral200 }
    ]}
      onPress={onPress}
    >
      {icon}
      {label && <Text>{label}</Text>}
    </TouchableOpacity>
  )
}

const createStyles = (theme: ThemeType) => StyleSheet.create({
  button: {
    padding: 4,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 32,
    maxWidth: 32,
  }
});