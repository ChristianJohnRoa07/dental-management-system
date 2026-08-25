export interface PatientRouteContext {
  params: Promise<{ id: string }> | { id: string };
}