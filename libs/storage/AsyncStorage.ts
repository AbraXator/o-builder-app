import AsyncStorage from '@react-native-async-storage/async-storage';

const COURSES_KEY = 'courses';

export const saveCourse = async (course: Course) => {
  try {
    const coursesJson = await AsyncStorage.getItem(COURSES_KEY);
    let courses: Course[] = coursesJson ? JSON.parse(coursesJson) : [];

    if (!course.id) {
      const maxId = courses.reduce((max, c) => (c.id && c.id > max ? c.id : max), 0);
      course.id = maxId + 1;
      course.createdAt = Date.now();
      courses.push(course);
    } else {
      courses = courses.map((c) => (c.id === course.id ? course : c));
    }

    await AsyncStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  } catch (e) {
    console.error('Error saving course', e);
    throw e;
  }
};

export const setCourse = async (course: Course, id: number) => {
  try {
    const coursesJson = await AsyncStorage.getItem(COURSES_KEY);
    let courses: Course[] = coursesJson ? JSON.parse(coursesJson) : [];

    const index = courses.findIndex((c) => c.id === id);
    if (index !== -1) {
      courses[index] = { ...course, id };
    } else {
      courses.push({ ...course, id });
    }

    await AsyncStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  } catch (e) {
    console.error('Error setting course', e);
  }
};

export const getCourses = async (): Promise<Course[]> => {
  try {
    const coursesJson = await AsyncStorage.getItem(COURSES_KEY);
    return coursesJson ? JSON.parse(coursesJson) : [];
  } catch (e) {
    console.error('Error loading courses', e);
    return [];
  }
};

export const deleteCourse = async (id: number) => {
  try {
    const coursesJson = await AsyncStorage.getItem(COURSES_KEY);
    let courses: Course[] = coursesJson ? JSON.parse(coursesJson) : [];

    courses = courses.filter((c) => c.id !== id);
    await AsyncStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  } catch (e) {
    console.error('Error deleting course', e);
  }
};
