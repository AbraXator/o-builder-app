declare global {
    interface Course {
    id?: number;
    name: string;
    scale: number | null;
    map: string;
    routes: Route[];
    createdAt?: number;
  }
}

export { };

