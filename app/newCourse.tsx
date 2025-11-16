import { Back, Settings } from '@/constants/icons/icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { appState } from '../libs/state/store';
import { getCourses, saveCourse } from '../libs/storage/AsyncStorage';

interface FormData {
  courseName: string;
  courseScale: number | undefined;
  courseMap: string;
}

export default function CreateCoursePage() {
  const [formData, setFormData] = useState<FormData>({
    courseName: '',
    courseScale: undefined,
    courseMap: '',
  });

  const setCurrentCourse = appState((s) => s.setCurrentCourse);

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'courseScale' ? parseFloat(value) || undefined : value,
    }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images']
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setFormData((prev) => ({
        ...prev,
        courseMap: uri,
      }));
    }
  };

  const saveForm = async () => {
    if (formData.courseScale === undefined) return;

    await saveCourse({
      name: formData.courseName,
      scale: formData.courseScale,
      map: formData.courseMap,
      routes: [
        {
          id: 0,
          name: 'All Controls',
          length: -1,
          climb: -1,
          controls: [],
        },
      ],
    });

    const courses = await getCourses();

    courses.sort((a, b) => {
      if (a.id && b.id) {
        return b.id - a.id;
      }

      return 0;
    });

    setCurrentCourse(courses[0]);

    router.push('/map/map')
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.iconButton}>
          <Back/>
        </TouchableOpacity>
        <Text style={styles.headerText}>CREATE NEW COURSE</Text>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.iconButton}>
          <Settings/>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text>Course name:</Text>
          <TextInput
            style={styles.input}
            value={formData.courseName}
            onChangeText={(val) => handleChange('courseName', val)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text>Map file:</Text>
          <Button title="Pick Image" onPress={pickImage} />
          {formData.courseMap ? (
            <Image
              source={{ uri: formData.courseMap }}
              style={{ width: 100, height: 100, marginTop: 10 }}
            />
          ) : null}
        </View>

        <View style={styles.inputGroup}>
          <Text>Course scale:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={formData.courseScale?.toString() || ''}
            onChangeText={(val) => handleChange('courseScale', val)}
          />
        </View>

        <Button title="CREATE COURSE" onPress={saveForm} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    height: 60,
    backgroundColor: '#e4e4e7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  iconButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  form: {
    paddingTop: 24,
    gap: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#e4e4e7',
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
});
