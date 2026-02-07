import React from "react";
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

Requests.Leaves = Leaves;
Requests.Reimbursements = Reimbursements;

export default Requests;
