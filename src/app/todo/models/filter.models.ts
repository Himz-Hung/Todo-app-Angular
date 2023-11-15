export interface FilterTodo {
  type: Filter;
  label: string;
  activeCheck: boolean;
}
export enum Filter {
  All,
  Active,
  Completed,
}
