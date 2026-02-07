import React from "react";
import { RM } from ".";
import EmptyStateIllustration from "../../../components/EmptyStateIllustration";
import ReimbursementList from "./ReimbursementList";
import ReimbursementTable from "./ReimbursementTable";

interface Props {
  reimbursements: RM[];
  select: (reimbursement: RM) => void;
}

export default function MyReimbursements(props: Props) {
  const { reimbursements, select } = props;
  return (
    <div className="relative">
      {reimbursements.length ? (
        <>
          <div className="hidden sm:block">
            <ReimbursementTable reimbursements={reimbursements} select={select} />
          </div>
          <div className="sm:hidden block">
            <ReimbursementList reimbursements={reimbursements} select={select} />
          </div>
        </>
      ) : (
        <EmptyStateIllustration
          text="You don't have any reimbursement so far"
          imgSrc="/Cashback_Illustration.png"
          xlWidth="70%"
        />
      )}
    </div>
  );
}
