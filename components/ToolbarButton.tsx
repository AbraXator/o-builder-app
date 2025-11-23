import { ThemeType, useTheme } from "@/libs/state/theme";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function ToolbarButton({ active, icon, label, onPress, addStyle, disabled }: {
  active?: boolean;
  icon?: React.JSX.Element;
  label?: string;
  onPress: () => void;
  addStyle?: any;
  disabled?: boolean;
}) {
  const { theme } = useTheme();
  const style = createStyles(theme);

  return (
    <TouchableOpacity style={[
      style.button, { 
        backgroundColor: active ? theme.control200 : theme.neutral300,
        aspectRatio: label ? 0 : 1,
        padding: label ? 8 : 4
      },
      addStyle
    ]}
      onPress={onPress}
      disabled={disabled}
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
  }
});