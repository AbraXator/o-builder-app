import { languages } from "@/libs/state/i18n";
import { useTheme } from "@/libs/state/theme";
import { useTranslation } from "react-i18next";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

type LangRenderingType = {
  id: string;
  name: string | undefined;
}

function LanguageRenderer({ langProps }: {
  langProps: LangRenderingType
}) {
  const { i18n } = useTranslation();
  const isLangNamePresent = langProps.name !== undefined;
  let stringToRender = langProps.name;

  if (!isLangNamePresent) {
    console.warn(`Language ${langProps.id} not read correctly`);
    stringToRender = langProps.id;
  }

  return (
    <TouchableOpacity
      onPress={() => i18n.changeLanguage(langProps.id)}
    >
      <Text>
        {stringToRender}
      </Text>
    </TouchableOpacity>
  )
}

export default function LanguageModal() {
  const { t, i18n } = useTranslation();
  const sharedStyles = sharedStyles(useTheme().theme);
  const listOfLangs = [];

  for (const [key, value] of Object.entries(languages)) {
    listOfLangs.push({
      id: key,
      name: new Intl.DisplayNames(key, { type: "language" }).of(key),
    } as LangRenderingType);
  }

  return (
    <View>
      <Modal>
        <View style={{ flex: 1 }}>
          <View style={sharedStyles.modalBackdrop}>
            <View style={sharedStyles.modalContainer}>
              <Text style={sharedStyles.modalTitle}>
                {t("modal.change-lang")}
              </Text>
              
              <FlatList
                data={listOfLangs}
                renderItem={({ item }) => <LanguageRenderer langProps={item}/>}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}