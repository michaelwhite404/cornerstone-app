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
            <Link
              key={heading}
              className="flex w-full shadow-[0_1px_6px_#c3c3c3] p-5 rounded-lg no-underline transition-all duration-[400ms] bg-white hover:text-inherit hover:shadow-[0_1px_9px_3px_#c3c3c3]"
              to={to}
            >
              <div className="ml-5">
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
