
export function removeControl(
  controlId: number,
  currentRoute: Route,
  updateRoute: (id: number, data: Partial<Route>) => void,
) {
  const updatedRoute = { ...currentRoute };
  updatedRoute.controls = updatedRoute.controls.filter((_, i) => i !== controlId);

  updatedRoute.controls.forEach((c, i) => {
    if (c.code >= controlId + 1) {
      c.code = c.code - 1;
    }
  });

  updateRoute(currentRoute.id, updatedRoute);
}

export function getCurrentRoute(currentCourseState: CourseState, currentCourse: Course) {
  return currentCourse.routes[currentCourseState.currentRoute];
}

export function getCurrentControls(currentCourseState: CourseState, currentCourse: Course) {
  return getCurrentRoute(currentCourseState, currentCourse).controls;
}

export function getSelectedControl(currentCourseState: CourseState, currentCourse: Course) {
  const selectedControl = currentCourseState.selectedControl;

  if (selectedControl !== null) {
    return getCurrentControls(currentCourseState, currentCourse).at(selectedControl);
  }

  return undefined;
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