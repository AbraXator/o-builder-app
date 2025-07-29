import { create } from 'zustand';

interface AppState {
  currentCourse: Course;
  currentCourseState: CourseState;
  theme: String;
  currentRoute: () => Route;
  createRoute: (route: Route) => void;
  updateRoute: (id: number, data: Partial<Route>) => void;
  updateCurrentRoute: (data: Partial<Route>) => void;
  addControlToCurrentRoute: (control: Control) => void;
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
  currentRoute: (): Route => {
    const state = appState.getState();
    return state.currentCourse.routes.find((r) => r.id === state.currentCourseState.currentRoute) || {
      id: 0,
      name: "",
      length: 0,
      controls: [],
    };
  },
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
      routes: state.currentCourse.routes.map((originalRoute) => originalRoute.id === id ? { ...originalRoute, ...newValues } : originalRoute)
      }
    }
    }),
    updateCurrentRoute: (newValues) => set((state) => ({
    currentCourse: {
      ...state.currentCourse,
      routes: state.currentCourse.routes.map((originalRoute) =>
      originalRoute.id === state.currentCourseState.currentRoute
        ? { ...originalRoute, ...newValues }
        : originalRoute
      ),
    },
    })),
    addControlToCurrentRoute: (control) => set((state) => {
    const currentRoute = state.currentCourse.routes.find((r) => r.id === state.currentCourseState.currentRoute);
    if (!currentRoute) return state;

    const controls = currentRoute.controls || [];
    const lastControlCode = controls.length > 0 ? controls[controls.length - 1].code : 0;
    const newControl = { ...control, code: lastControlCode + 1 };

    return {
      currentCourse: {
      ...state.currentCourse,
      routes: state.currentCourse.routes.map((r) =>
        r.id === currentRoute.id
        ? { ...r, controls: [...controls, newControl] }
        : r
      ),
      },
    };
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
  setCurrentCourse: (course) => set((state) => ({ currentCourse: course })),
  updateCurrentCourseState: (data) => set((state) => ({ currentCourseState: { ...state.currentCourseState, ...data } })),
  setTheme: (data) => set((state) => ({ theme: data })),
  update: (data: Partial<AppState>) => set(data),
}));