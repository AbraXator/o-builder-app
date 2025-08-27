export function removeControl(controlId, currentRoute, updateRoute) {
  const updatedRoute = { ...currentRoute };
  delete updatedRoute.controls[controlId];
  updateRoute(updatedRoute);
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