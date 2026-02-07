import React from "react";
import { Leave } from ".";
import EmptyState from "./EmptyState";
import MyLeavesList from "./MyLeavesList";
import MyLeavesTable from "./MyLeavesTable";

interface Props {
  leaves: Leave[];
  select: (leave: Leave) => void;
}

export default function MyLeaves(props: Props) {
  const { leaves, select } = props;
  return (
    <>
      {leaves.length > 0 ? (
        <div>
          <div className="hidden sm:block">
            <MyLeavesTable leaves={leaves} select={select} />
          </div>
          <div className="sm:hidden block">
            <MyLeavesList leaves={leaves} select={select} />
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </>
  );
}
