import { Language, Sun } from '@/constants/icons/icons';
import { router } from 'expo-router';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function MainMenuPage() {
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
            <Pressable>
              <Sun/>
            </Pressable>
            <Pressable>
              <Language/>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

function MenuButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        onPress();
        console.log("Pressed")
      }}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 64,
    backgroundColor: '#ffffff',
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
    shadowColor: '#000', // iOS shadow
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
    backgroundColor: '#e5e5e5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
  },
  buttonPressed: {
    backgroundColor: '#d4d4d4',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
