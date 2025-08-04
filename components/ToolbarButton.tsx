import { lightTheme } from "@/constants/theme";
import { Text, TouchableOpacity } from "react-native";

export default function ToolbarButton({ active, icon, label, onPress }: {
  active?: boolean;
  icon?: React.JSX.Element;
  label?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={{
      backgroundColor: active ? lightTheme.second : lightTheme.third,
      padding: 4,
      borderRadius: 999,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      maxHeight: 32,
      maxWidth: 32,
    }}
      onPress={onPress}
    >
      {icon}
      {label && <Text>{label}</Text>}
    </TouchableOpacity>
  )
}