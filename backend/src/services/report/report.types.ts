export interface SalesFilter {
  startDate?: string;
  endDate?: string;
  groupBy: "transaction" | "property" | "user";
  sortBy: "date" | "total";
  sortOrder: "asc" | "desc";
}
