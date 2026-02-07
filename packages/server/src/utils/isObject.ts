export default (obj: any) => typeof obj === "object" && !Array.isArray(obj) && obj !== null;
