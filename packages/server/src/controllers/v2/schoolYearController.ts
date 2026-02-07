import { SchoolYear } from "@models";
import * as factory from "./handlerFactory";

export const getAllSchoolYears = factory.getAll(SchoolYear, "schoolYears");

export const getSchoolYear = factory.getOne(SchoolYear, "schoolYear");

export const createSchoolYear = factory.createOne(SchoolYear, "schoolYear");
