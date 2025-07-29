import { Home, Settings } from '@/constants/icons/icons';
import { appState } from '@/libs/state/store';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    <FlatList
      data={courses}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
      contentContainerStyle={styles.courseList}
      renderItem={({ item }) => (
        <View style={styles.courseCard}>
          <Text style={styles.courseName}>{item.name}</Text>
          <Text style={styles.courseScale}>Scale: {item.scale}</Text>

          <Image source={{ uri: item.map }} style={styles.courseImage} />

          <View style={styles.actions}>
            <TouchableOpacity onPress={() => confirmDelete(item)} style={styles.button}>
              <Text>🗑</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setCurrentCourse(item);
                router.push('/map/map');
              }}
              style={styles.button}
            >
              <Text>📝</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
};

const RecentCoursesPage = () => {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.button}>
          <Home />
        </TouchableOpacity>
        <Text style={styles.title}>RECENT COURSES</Text>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.button}>
          <Settings />
        </TouchableOpacity>
      </View>
      <RecentCourseComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 64,
    backgroundColor: '#f4f4f5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
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
    flex: 1,
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