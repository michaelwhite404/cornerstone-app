import { KnownValueDescription, SettingFieldType } from "@@types/models";

export default function settingValueValid(
  value: any,
  type: SettingFieldType,
  knownValueDescriptions?: KnownValueDescription[]
): boolean {
  const map = {
    TYPE_BOOL: isBoolean,
    TYPE_STRING: isString,
    TYPE_ENUM: isValidEnum,
    TYPE_ENUM_ARRAY: isValidEnumArray,
    TYPE_INT32: isInt32,
    TYPE_DOUBLE: notImplemeted,
    TYPE_FLOAT: notImplemeted,
    TYPE_INT64: notImplemeted,
  };
  return map[type](value, knownValueDescriptions || []);
}

const isBoolean = (value: any) => typeof value === "boolean";
const isString = (value: any) => typeof value === "string";
const isValidEnum = (value: any, validValues: KnownValueDescription[]) =>
  validValues.findIndex((known) => known.value === value) > -1;
const isValidEnumArray = (values: any, validValues: KnownValueDescription[]) => {
  if (!Array.isArray(values)) return false;
  if ([...new Set(values)].length !== values.length) return false;
  return values.every((value) => isValidEnum(value, validValues));
};
const isInt32 = (value: any) =>
  !Number.isNaN(value) && Number.isInteger(value) && value > -2147483648 && value < 2147483647;
const notImplemeted = () => false;
