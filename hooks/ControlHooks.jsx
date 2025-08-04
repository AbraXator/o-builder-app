export function removeControl(controlId, currentRoute, updateRoute) {
  const updatedRoute = { ...currentRoute };
  delete updatedRoute.controls[controlId];
  updateRoute(updatedRoute);
}

