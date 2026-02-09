import axios from "axios";

/**
 * Axios instance configured for the API.
 * All API calls should use this instance.
 */
export const apiClient = axios.create({
  baseURL: "/api/v2",
});

/**
 * Helper to extract data from API responses.
 * Our API returns { status, requestedAt, data: { ... } }
 */
export const extractData = <T>(response: { data: { data: T } }): T => response.data.data;
