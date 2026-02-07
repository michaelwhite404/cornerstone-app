import { Link } from "react-router-dom";
import { EmployeeModel } from "../../types/models";
import { useAuth, useDocTitle } from "../../hooks";

const links = [
  {
    to: "/students",
    heading: "Students",
    text: "View, edit and filter students",
    show: () => true,
  },
  { to: "/devices", heading: "Devices", text: "View, manage and edit devices.", show: () => true },
  {
    to: "/textbooks",
    heading: "Textbooks",
    text: "View, manage and and checkout textbooks",
    show: () => true,
  },
  {
    to: "/lions-den",
    heading: "Lions Den",
    text: "View sessions from Lions Den",
    show: (user: EmployeeModel) =>
      user.departments && user.departments.find((dept) => dept.name === "Lions Den") ? true : false,
  },
];

const getLinks = (user: EmployeeModel) => links.filter((resource) => resource.show(user));

export default function Dashboard() {
  useDocTitle("Dashboard | Cornerstone App");
  const user = useAuth().user!;
  const links = getLinks(user);

  return (
    <div style={{ padding: "10px 25px 25px" }}>
      <div className="flex items-center justify-between">
        <h1 style={{ textTransform: "capitalize", marginBottom: "10px" }}>Dashboard</h1>
      </div>
      <div className="mt-5">
        <div className="grid gap-[15px] grid-cols-2 max-[700px]:grid-cols-1">
          {links.map(({ to, heading, text }) => (
            <Link key={heading} className="flex items-center p-5 bg-white rounded-lg shadow-[0_1px_20px_-3px_rgba(0,0,0,0.15)] transition-shadow duration-200 hover:shadow-[0_1px_20px_-3px_rgba(0,0,0,0.3)] no-underline text-gray-700" to={to}>
              <div>
                <div className="font-semibold text-base mb-[5px]">{heading}</div>
                <div>{text}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
