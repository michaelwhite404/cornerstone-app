/**
 * Tests if any values in an array exist in another array
 * @param arr1 Array being tested
 * @param arr2 Array being tested against
 * @returns True if no values in `arr1` are in `arr2`
 */
const distinctArrays = (arr1: any[], arr2: any[]): boolean =>
  arr1.filter(function (val) {
    return arr2.indexOf(val) == -1;
  }).length === arr1.length;

export default distinctArrays;
