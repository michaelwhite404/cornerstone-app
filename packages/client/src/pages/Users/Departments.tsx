import { useState } from "react";
import { useDepartments, useCreateDepartment } from "../../api";
import CreateDepartmentModal from "./CreateDepartmentModal";
import DepartmentDetails from "./DepartmentDetails";
import DepartmentsTable from "./DepartmentsTable";
import DirectoryMainButton from "./DirectoryMainButton";

export default function Departments() {
  const { data: departments = [] } = useDepartments();
  const createDepartmentMutation = useCreateDepartment();
  const [modalOpen, setModalOpen] = useState(false);

  const createDepartment = async (data: { name: string }) => {
    return await createDepartmentMutation.mutateAsync(data);
  };

  return (
    <div>
      <DirectoryMainButton text="+ Create Department" onClick={() => setModalOpen(true)} />
      <DepartmentsTable departments={departments} />
      <CreateDepartmentModal
        open={modalOpen}
        setOpen={setModalOpen}
        createDepartment={createDepartment}
      />
    </div>
  );
}

Departments.Detail = DepartmentDetails;
