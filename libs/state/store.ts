import { sortControls } from '@/hooks/CourseHooks';
import { create } from 'zustand';
import { ControlTypes, InteractionModes } from '../types/enums';
import { MoveTypes } from './../types/enums';

interface AppState {
  currentCourse: Course;
  currentCourseState: CourseState;
  theme: String;
  moveType: MoveType;

  currentRoute: () => Route;
  createRoute: (route: Route) => void;
  updateRoute: (id: number, data: Partial<Route>) => void;
  updateCurrentRoute: (data: Partial<Route>) => void;
  addControlToCurrentRoute: (control: Control) => void;
  addExistingControlToCurrentRoute: (control: Control) => void;
  addControlToAllControls: (control: Control) => void;
  removeRoute: (id: number) => void;
  updateCurrentCourse: (data: Partial<Course>) => void;
  setCurrentCourse: (course: Course) => void;
  updateCurrentCourseState: (data: Partial<CourseState>) => void;
  setTheme: (data: String) => void;
  setMoveType: (type: MoveType) => void;
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
  moveType: MoveTypes.NONE,
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
    const { currentCourse, currentCourseState } = state;
    const routes = currentCourse.routes;

    const allControlsRoute = routes[0];
    if (!allControlsRoute) return state;

    const currentRoute = routes.find(
      (r) => r.id === currentCourseState.currentRoute,
    );
    if (!currentRoute) return state;

    const sortedAllControls = sortControls(allControlsRoute.controls ?? []);
    const allControls = [...sortedAllControls];

    const existingRealControls = allControls.filter(
      (c) => c.type === ControlTypes.CONTROL,
    );
    const lastControlCode =
      existingRealControls.length > 0
        ? existingRealControls[existingRealControls.length - 1].code ?? 0
        : 0;

    const newControlCode =
      control.type === ControlTypes.CONTROL ? lastControlCode + 1 : -1;
    const newIndex = allControls.length;
    const newControl = {
      ...control,
      index: newIndex,
      code: newControlCode,
    };
    const nextAllControls = [...allControls, newControl];

    const nextRoutes = routes.map((r, idx) => {
      if (r.id === 0) {
        return {
          ...r,
          controls: nextAllControls,
        };
      }

      if (r.id === currentRoute.id && r.id !== 0) {
        return {
          ...r,
          controls: [...(r.controls ?? []), newControl],
        };
      }

      return r;
    });

    return {
      currentCourse: {
        ...currentCourse,
        routes: nextRoutes,
      },
    };
  }),
  addExistingControlToCurrentRoute: (control) => set((state) => {
    const { currentCourse, currentCourseState } = state;
    const routes = currentCourse.routes;

    const currentRoute = routes.find(
      (r) => r.id === currentCourseState.currentRoute,
    );
    if (!currentRoute) return state;

    const nextRoutes = routes.map((r, idx) => {
      if (r.id === currentRoute.id && r.id !== 0) {
        return {
          ...r,
          controls: [...(r.controls ?? []), control],
        };
      }

      return r;
    });

    return {
      currentCourse: {
        ...currentCourse,
        routes: nextRoutes,
      },
    };
  }),
  addControlToAllControls: (control) => set((state) => {
    const allControls = state.currentCourse.routes[0];
    if (!allControls) return state;

    const controls = sortControls(allControls.controls) || [];
    const controlsToCheck = controls.filter((c) => c.type === ControlTypes.CONTROL);
    const lastControlCode = controlsToCheck.length > 0 ? (controlsToCheck[controlsToCheck.length - 1]?.code ?? 0) : 0;
    const lastControlIndex = controls.length - 1;
    const newControlCode = control.type === ControlTypes.CONTROL ? lastControlCode + 1 : -1;
    const newControl = {
      ...control,
      index: lastControlIndex + 1,
      code: newControlCode
    };

    controls.push(newControl);

    return {
      currentCourse: {
        ...state.currentCourse,
        routes: state.currentCourse.routes.map((r) =>
          r.id === allControls.id
            ? { ...r, controls: controls }
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
  setMoveType: (type) => set((state) => ({ moveType: type })),
  update: (data: Partial<AppState>) => set(data),
}));