import { create } from 'zustand';

interface AppState {
  currentCourse: Course;
  currentCourseState: CourseState;
  theme: String;
  createRoute: (route: Route) => void;
  updateRoute: (id: number, data: Partial<Route>) => void;
  removeRoute: (id: number) => void;
  updateCurrentCourse: (data: Partial<Course>) => void;
  setCurrentCourse: (course: Course) => void;
  updateCurrentCourseState: (data: Partial<CourseState>) => void;
  setTheme: (data: String) => void;
  update: (data: any) => void;
}

export const appState = create<AppState>((set) => ({
  currentCourse: {
    id: undefined,
    name: "",
    scale: null,
    map: "",
    routes: [],
    createdAt: -1,
  },
  currentCourseState: {
    selectedControlType: "control" as CourseState["selectedControlType"],
    selectedControl: null,
    mode: null,
    currentRoute: 0
  },
  theme: "light",
  createRoute: (route) => set((state) => {
    const lastRouteId = state.currentCourse.routes[state.currentCourse.routes.length - 1].id;
    const newRoute: Route = {
      ...route,
      id: lastRouteId,
    }
    return {
      currentCourse: {
        ...state.currentCourse,
        routes: [
          ...state.currentCourse.routes,
          newRoute,
        ]
      }
    }
  }),
  updateRoute: (id, newValues) => set((state) => {
    let routes = state.currentCourse.routes;
    
    return {
      currentCourse: {
        ...state.currentCourse,
        routes: state.currentCourse.routes.map((originalRoute) => originalRoute.id === id ? {...originalRoute, ...newValues} : originalRoute)
      }
    }
  }),
  removeRoute: (id) => set((state) => {
    return {
      currentCourse: {
        ...state.currentCourse,
        routes: state.currentCourse.routes.filter((r) => r.id !== id),
      }
    }
  }),
  updateCurrentCourse: (data) => set((state) => ({ currentCourse: { ...state.currentCourse, ...data } })),
  setCurrentCourse: (course) => set((state) => ({currentCourse: course })),
  updateCurrentCourseState: (data) => set((state) => ({ currentCourseState: { ...state.currentCourseState, ...data } })),
  setTheme: (data) => set((state) => ({theme: data})),
  update: (data: Partial<AppState>) => set(data),
}));