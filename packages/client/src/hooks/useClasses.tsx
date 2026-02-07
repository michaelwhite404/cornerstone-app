import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { APIError } from "../types/apiResponses";
import Class from "../types/class";
import { grades } from "../utils/grades";
import { HTMLSelect } from "@blueprintjs/core";

interface IUseClasses {
  classes: Class[];
  /** HTML Select component of all grades in the school. Selecting an grade option value
   * changes the options in the `GradeSelect` component and the gradePicked variable.
   */
  GradeSelect: ({
    value,
    onChange,
  }: {
    value?: number;
    /**
     * @param value - The changed value of the input
     */
    onChange?: (value: number) => any;
  }) => JSX.Element;
  /** HTML Select component of all students in a given grade. Student options are
   * determined by the gradePicked variable.
   * */
  StudentSelect: ({
    value,
    onChange,
  }: {
    value?: string;
    onChange?: (value: string) => any;
  }) => JSX.Element;
  /** The current selected grade. -1 if no grade is selected  */
  gradePicked: number;
  /** The current selected sudent. "-1" if no student is selected  */
  studentPicked: string;
  setGradePicked: React.Dispatch<React.SetStateAction<number>>;
  setStudentPicked: React.Dispatch<React.SetStateAction<string>>;
  /** Indicates whether the classes have been loaded */
  loaded: boolean;
  /** Resets grade and student to initial state */
  reset: () => void;
}

export default function useClasses(fetchedClasses?: Class[]): IUseClasses {
  const [classes, setClasses] = useState<Class[]>([]);
  const [gradePicked, setGradePicked] = useState(-1);
  const [studentPicked, setStudentPicked] = useState("-1");
  const [loaded, setLoaded] = useState(Boolean(fetchedClasses));

  useEffect(() => {
    fetchedClasses ? setClasses(fetchedClasses) : getClasses();

    async function getClasses() {
      try {
        const res = await axios.get("/api/v2/students/group");
        setClasses(res.data.data.grades);
        setLoaded(true);
      } catch (err) {
        console.log((err as AxiosError<APIError>).response!.data);
      }
    }
  }, [fetchedClasses]);

  const gradeValues = grades.map((value, i) => ({
    value: `${i}`,
    label: i === 0 ? "Kindergarten" : value,
  }));
  gradeValues.unshift({ value: "-1", label: "Select a grade" });
  const selectAStudent = { label: "Select A Student", value: "-1" };
  const studentOptions =
    gradePicked === -1
      ? undefined
      : classes.length > 0
      ? classes[gradePicked].students.map((s) => ({
          label: s.fullName,
          value: s.id,
        }))
      : undefined;
  studentOptions?.unshift(selectAStudent);

  const changeGrade = (
    e: React.ChangeEvent<HTMLSelectElement>,
    onChange?: (value: number) => any
  ) => {
    setGradePicked(+e.target.value);
    setStudentPicked("-1");
    onChange && onChange(+e.target.value);
  };

  const GradeSelect = ({
    value,
    onChange,
  }: {
    value?: number;
    onChange?: (value: number) => any;
  }) => {
    useEffect(() => {
      value && setGradePicked(value);
    }, [value]);
    return (
      <HTMLSelect
        value={value ?? gradePicked}
        options={gradeValues}
        onChange={(e) => changeGrade(e, onChange)}
      />
    );
  };

  const changeStudent = (
    e: React.ChangeEvent<HTMLSelectElement>,
    onChange?: (value: string) => any
  ) => {
    setStudentPicked(e.target.value);
    onChange && onChange(e.target.value);
  };

  const StudentSelect = ({
    value,
    onChange,
  }: {
    value?: string;
    onChange?: (value: string) => any;
  }) => (
    <HTMLSelect
      disabled={gradePicked < 0}
      value={value ?? studentPicked}
      options={studentOptions || [selectAStudent]}
      onChange={(e) => changeStudent(e, onChange)}
    />
  );

  const reset = useCallback(() => {
    setGradePicked(-1);
    setStudentPicked("-1");
  }, []);

  return {
    classes,
    GradeSelect,
    StudentSelect,
    gradePicked,
    studentPicked,
    setGradePicked,
    setStudentPicked,
    loaded,
    reset,
  };
}
