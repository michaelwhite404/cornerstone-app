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
      <div className="page-header">
        <h1 style={{ textTransform: "capitalize", marginBottom: "10px" }}>Requests</h1>
      </div>
      <div className="device-wrapper">
        <div className="device-grid-container">
          {links.map(({ to, heading, text }) => (
            <Link key={heading} className="device-item" to={to}>
              <div>
                <div className="device-heading">{heading}</div>
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
