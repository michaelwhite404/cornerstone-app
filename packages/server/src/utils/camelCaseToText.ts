const camelCaseToText = (text: string, lower?: boolean) => {
  const result = text.replace(/([A-Z])/g, " $1");
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
  if (lower) return finalResult.toLowerCase();
  return finalResult;
};

export default camelCaseToText;
