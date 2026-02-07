import { ParsedQs } from "qs";

export interface ParsedQueryString extends ParsedQs {
  sort?: string;
  page?: string;
  limit?: string;
  fields?: string;
}

export default ParsedQueryString;
