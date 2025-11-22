import { Language, Moon, Sun } from '@/constants/icons/icons';
import { ThemeType, useTheme } from '@/libs/state/theme';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MainMenuPage() {
  const { theme, themeId, toggleTheme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.navButtonGroup}>
          <MenuButton label="NEW COURSE" onPress={() => router.push('/newCourse')} />
          <MenuButton label="RECENT COURSES" onPress={() => router.push('/recentCourses')} />
          <MenuButton label="LOAD COURSE" onPress={() => { }} />
          <View style={styles.buttonGroup}>
            <UtilButton
              icon={themeId === "dark" ? <Moon /> : <Sun />}
              onPress={() => toggleTheme()}
            />
            <UtilButton
              icon={<Language />}
              onPress={() => console.log("Language changed pressed")}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function UtilButton({ icon, onPress }: {
  icon?: React.JSX.Element,
  onPress: () => void,
}) {
  const theme = useTheme().theme;
  const style = createStyles(theme);
  const coloredIcon = 
    icon && theme.neutral500
      ? React.cloneElement(icon, { color: theme.control300 })
      : icon;

  return (
    <TouchableOpacity
      style={style.utilButton}
      onPress={onPress}
    >
      {coloredIcon}
    </TouchableOpacity>
  )
}

function MenuButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
        console.log("Pressed")
      }}
      style={styles.button}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const { width } = Dimensions.get('window');

const createStyles = (theme: ThemeType) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 64,
    backgroundColor: theme.neutral100,
    alignItems: 'center',
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 64, // supported in React Native 0.71+
  },
  logoWrapper: {
    marginBottom: 32,
    elevation: 6, // Android shadow
    shadowColor: theme.neutral100, // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  logo: {
    width: width * 0.5,
    height: width * 0.3,
  },
  navButtonGroup: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  buttonGroup: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 16
  },
  button: {
    width: '100%',
    backgroundColor: theme.control100,
    borderColor: theme.control200,
    borderWidth: 4,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: theme.neutral300,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.neutral700
  },
  utilButton: {
    backgroundColor: theme.control200,
    padding: 4,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 32,
    maxWidth: 32,
  }
});
