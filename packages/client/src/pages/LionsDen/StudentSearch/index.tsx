import { useState } from "react";
import Select from "react-select";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import { StudentModel } from "../../../types/models";
import "./StudentSearch.sass";
import pluralize from "pluralize";

interface StudentSearchProps {
  students: StudentModel[];
  onSubmit?: (students: Option[]) => Promise<void>;
}

interface Option {
  label: string;
  value: string;
}

export default function StudentSearch(props: StudentSearchProps) {
  const [selected, setSelected] = useState<Option[]>([]);

  const options: Option[] = props.students.map((student) => ({
    label: student.fullName,
    value: student._id,
  }));

  const clear = () => setSelected([]);

  const submit = () => {
    props
      .onSubmit?.(selected)
      .then(clear)
      .catch(() => {});
  };

  const handleChange = (newValue: Option[] | any, _: any) => setSelected(newValue);

  const btnTxt = `+ Add ${pluralize("Students", selected.length, selected.length > 1)}`;
  return (
    <div className="add-student-container">
      <Select
        isMulti
        placeholder="Students to Add"
        options={options}
        onChange={handleChange}
        value={selected}
      />
      <PrimaryButton disabled={selected.length === 0} onClick={submit}>
        {btnTxt}
      </PrimaryButton>
    </div>
  );
}
