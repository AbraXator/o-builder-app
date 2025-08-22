export function removeControl(controlId, currentRoute, updateRoute) {
  const updatedRoute = { ...currentRoute };
  delete updatedRoute.controls[controlId];
  updateRoute(updatedRoute);
}

export function kindToIndex(kind: string) {
  switch (kind) {
    case "A":
      return 0;
    case "B":
      return 1;
    case "C":
      return 2;
    case "D":
      return 3;
    case "E":
      return 4;
    default:
      return -1;
  }
}

export function indexToKind(index: number) {
  switch (index) {
    case 0:
      return "A";
    case 1:
      return "B";
    case 2:
      return "C";
    case 3:
      return "D";
    case 4:
      return "E";
    default:
      return null;
  }
}