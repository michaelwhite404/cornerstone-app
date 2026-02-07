const omitFromObject = (obj: { [x: string]: any }, ...keys: string[]) => {
  keys.forEach((key) => delete obj[key]);
  return obj;
};

export default omitFromObject;
