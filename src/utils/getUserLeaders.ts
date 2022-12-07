import { DepartmentMember } from "@models";

export default async function getUserLeaders(employee: Employee) {
  // Don't use departments where you are the leader
  const myDepartments = employee.departments!.filter((d) => d.role !== "LEADER");
  const myDeptIds = myDepartments.map((myD) => myD._id.toString());
  const leaders = await DepartmentMember.find({
    department: { $in: myDeptIds },
    role: "LEADER",
  }).populate({ path: "department", select: "name" });
  return leaders.map((l) => ({
    _id: l.member._id,
    fullName: l.member.fullName,
    email: l.member.email,
    department: {
      _id: l.department._id,
      name: l.department.name,
    },
  }));
}
