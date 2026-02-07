import axios from "axios";
import { useEffect, useState } from "react";
import { DepartmentModel } from "../../types/models";
import CreateDepartmentModal from "./CreateDepartmentModal";
import DepartmentDetails from "./DepartmentDetails";
import DepartmentsTable from "./DepartmentsTable";
import DirectoryMainButton from "./DirectoryMainButton";

export default function Departments() {
  const [departments, setDepartments] = useState<DepartmentModel[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchDepartments = async () => {
    const res = await axios.get("/api/v2/departments");
    setDepartments(res.data.data.departments);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const createDepartment = async (data: { name: string }) => {
    const res = await axios.post("/api/v2/departments", data);
    return res.data.data.department as DepartmentModel;
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
