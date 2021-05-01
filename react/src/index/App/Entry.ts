export interface Entry {
  id: number;
  type: "FILE" | "TEXT";
  data: string;
  created: string;
}
