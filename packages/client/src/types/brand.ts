export interface Brand {
  models: Model[];
  count: number;
  brand: string;
}

export interface Model {
  model: string;
  count: number;
  statuses: StatusElement[];
}

export interface StatusElement {
  status: StatusEnum;
  count: number;
}

export enum StatusEnum {
  Available = "Available",
  Broken = "Broken",
  CheckedOut = "Checked Out",
  NotAvailable = "Not Available",
}

export interface Totals extends Omit<Model, "model"> {}
