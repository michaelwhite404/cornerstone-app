const STUDENT_COLUMNS = [
  { Header: "Name", accessor: "fullName" },
  { Header: "Grade", accessor: "grade", Cell: ({ value }: any) => (value === 0 ? "K" : value) },
  { Header: "RenWeb ID", accessor: "customID" },
  { Header: "Email", accessor: "schoolEmail", width: 200 },
];

export default STUDENT_COLUMNS;
