import ToolbarButton from '@/components/ToolbarButton';
import { appState } from '@/libs/state/store';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { deleteCourse, getCourses } from '../libs/storage/AsyncStorage';

const RecentCourseComponent = () => {
  const setCurrentCourse = appState((s) => s.setCurrentCourse);
  const [courses, setCourses] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    const result = await getCourses();
    setCourses(result.length > 0 ? result : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const confirmDelete = (course: any) => {
    Alert.alert(
      'Delete Course?',
      `Are you sure you want to delete ${course.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteCourse(course.id);
            fetchCourses();
          },
        },
      ]
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
  }

  if (courses.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No recent courses</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={courses}
          keyExtractor={(index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.courseList}
          renderItem={({ item }) => (
            <View style={styles.courseCard}>
              <Text style={styles.courseName}>{item.name}</Text>
              <Text style={styles.courseScale}>Scale: {item.scale}</Text>

              <Image source={{ uri: item.map }} style={styles.courseImage} />

              <View style={styles.actions}>
                <ToolbarButton onPress={() => confirmDelete(item)} icon={<Text>🗑</Text>} />
                <ToolbarButton
                  label="Edit"
                  onPress={() => {
                    setCurrentCourse(item);
                    router.push('/map/map');
                  }}
                />
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const RecentCoursesPage = () => {
  return (
    <View style={{ flex: 1 }}>
      <Header name="Recent Courses" />
      <RecentCourseComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    backgroundColor: '#e4e4e7',
    borderRadius: 999,
  },
  courseList: {
    padding: 8,
    alignItems: 'center',
  },
  courseCard: {
    backgroundColor: '#e4e4e7',
    padding: 16,
    borderRadius: 12,
    margin: 8,
    alignItems: 'center',
  },
  courseName: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  courseScale: {
    marginBottom: 8,
  },
  courseImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RecentCoursesPage;