export interface ExamplePreset<T> {
  id: string;
  label: string;
  description: string;
  values: T;
}
