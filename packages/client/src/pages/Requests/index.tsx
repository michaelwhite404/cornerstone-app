import { Link } from "react-router-dom";
import { useDocTitle } from "../../hooks";
import Leaves from "./Leaves";
import Reimbursements from "./Reimbursements";

const links = [
  {
    to: "/requests/reimbursements",
    heading: "Reimbursement Requests",
    text: "Create a reimbursement requests for items you bought for our school.",
  },
  {
    to: "/requests/leaves",
    heading: "Leave Requests",
    text: "Planning on being away? Create a leave request to notify supervisors.",
  },
];

function Requests() {
  useDocTitle("Requests | Cornerstone App");
  return (
    <div style={{ padding: "10px 25px 25px" }}>
      <div className="flex items-center justify-between">
        <h1 style={{ textTransform: "capitalize", marginBottom: "10px" }}>Requests</h1>
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

Requests.Leaves = Leaves;
Requests.Reimbursements = Reimbursements;

export default Requests;
