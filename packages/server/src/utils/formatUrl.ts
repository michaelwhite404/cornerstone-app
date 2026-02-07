/** Path type is a string that must start with a slash */
type Path = `/${string}`;

/**
 * Formats the url depending on the node env
 * @param path - The path to add to the url
 */
export const formatUrl = (path: Path = "/") =>
  process.env.NODE_ENV === "production"
    ? "https://app.cornerstone-schools.org" + path
    : "http://localhost:3000" + path;
