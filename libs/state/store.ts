import { sortControls } from '@/hooks/CourseHooks';
import { create } from 'zustand';
import { ControlTypes, InteractionModes } from '../types/enums';

interface AppState {
  currentCourse: Course;
  currentCourseState: CourseState;
  theme: String;

  currentRoute: () => Route;
  createRoute: (route: Route) => void;
  updateRoute: (id: number, data: Partial<Route>) => void;
  updateCurrentRoute: (data: Partial<Route>) => void;
  addControlToCurrentRoute: (control: Control) => void;
  addControlToAllControls: (control: Control) => void;
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
    mode: InteractionModes.NORMAL,
    currentRoute: 0
  },
  theme: "light",
  currentRoute: (): Route => {
    const state = appState.getState();
    return state.currentCourse.routes.find((r) => r.id === state.currentCourseState.currentRoute) || {
      id: 0,
      name: "",
      length: 0,
      climb: 0,
      controls: [],
    };
  },
  createRoute: (route) => set((state) => {
    const lastRouteId = state.currentCourse.routes[state.currentCourse.routes.length - 1].id;
    const newRoute: Route = {
      ...route,
      id: lastRouteId + 1,
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

    const codeForType = (type: ControlType, code: number) => {
      switch(type) {
        case ControlTypes.START: return -1;
        case ControlTypes.CONTROL: return code + 1;
        case ControlTypes.FINISH: return -2;
      }
    }

    const controls = sortControls(currentRoute.controls) || [];
    const controlsToCheck = controls.filter((c) => c.type === ControlTypes.CONTROL);
    const lastControlCode = controlsToCheck.length > 0 ? (controlsToCheck[controlsToCheck.length - 1]?.code ?? 0) : 0;
    const newControlCode = codeForType(control.type, lastControlCode);
    const newControl = { ...control, code: newControlCode };

    controls.push(newControl);

    const sortedControls = sortControls(controls);

    return {
      currentCourse: {
        ...state.currentCourse,
        routes: state.currentCourse.routes.map((r) =>
          r.id === currentRoute.id
            ? { ...r, controls: sortedControls }
            : r
        ),
      },
    };
  }),
  addControlToAllControls: (control) => set((state) => {
    const allControlsRoute = state.currentCourse.routes.find((r) => r.id === 0);
    if (!allControlsRoute) return state;

    const controls = allControlsRoute.controls || [];
    const lastControlCode = controls.length > 0 ? controls[controls.length - 1].code : 0;
    const newControl = { ...control, code: lastControlCode + 1 };

    return {
      currentCourse: {
        ...state.currentCourse,
        routes: state.currentCourse.routes.map((r) =>
          r.id === allControlsRoute.id
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