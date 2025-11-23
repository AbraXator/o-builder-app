export function removeControl(
  controlIndex: number,
  currentRoute: Route,
  currentCourse: Course,
  updateRoute: (id: number, data: Partial<Route>) => void,
) {
  const allRoutesForControl = getAllRoutesForControl(currentCourse, controlIndex);
  const routeIdsForControl = new Set(allRoutesForControl.map((r) => r.id));

  //const updatedRoutes = currentCourse.routes.map((route) =>)

  const filteredControls = currentRoute.controls
    .filter((c) => c.index !== controlIndex)
    .map((c, i) => ({
      ...c,
      index: i,
    }));
  const updatedRoute: Route = {
    ...currentRoute,
    controls: filteredControls,
  }

  updateRoute(currentRoute.id, updatedRoute);
}

export function getCurrentRoute(currentCourseState: CourseState, currentCourse: Course) {
  return (
    currentCourse.routes.find((r) => r.id === currentCourseState.currentRoute) || {
      id: 0,
      name: "",
      length: 0,
      climb: 0,
      controls: [],
    }
  );
}

export function getCurrentControls(currentCourseState: CourseState, currentCourse: Course) {
  return getCurrentRoute(currentCourseState, currentCourse).controls;
}

export function getSelectedControl(currentCourseState: CourseState, currentCourse: Course) {
  const selectedIndex = currentCourseState.selectedControl;

  if (selectedIndex !== null) {
    return getCurrentControls(currentCourseState, currentCourse).find((c) => c.index === selectedIndex);
  }

  return undefined;
}

export function getAllRoutesForControl(currentCourse: Course, control: number) {
  return currentCourse.routes.filter((r) => r.controls.some((c) => c.index === control));
}

export function sortControls(controls: Control[]) {
  return [
    ...controls.filter((c: Control) => c.type === 'start'),
    ...controls.filter((c: Control) => c.type === 'control'),
    ...controls.filter((c: Control) => c.type === 'finish')
  ]
}

export function kindToIndex(kind: string) {
  switch (kind) {
    case "C":
      return 0;
    case "D":
      return 1;
    case "E":
      return 2;
    case "F":
      return 3;
    case "G":
      return 4;
    case "H":
      return 5;
    default:
      return -1;
  }
}

export function indexToKind(index: number) {
  switch (index) {
    case 0:
      return "C";
    case 1:
      return "D";
    case 2:
      return "E";
    case 3:
      return "F";
    case 4:
      return "G";
    case 5:
      return "H";
    default:
      return null;
  }
}