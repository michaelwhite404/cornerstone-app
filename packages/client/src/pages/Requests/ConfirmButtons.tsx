import React, { useState } from "react";
import FadeIn from "../../components/FadeIn";

interface Props {
  submitApproval: (approved: boolean) => Promise<void>;
}

export default function ConfirmButtons(props: Props) {
  const [selection, setSelection] = useState<"approve" | "reject">();

  const handleClick = (pick: NonNullable<typeof selection>) => {
    if (!selection) return setSelection(pick);
    props.submitApproval(selection === "approve");
  };

  return (
    <div className="text-center">
      How would you like to finalize this request?
      <div className="space-x-6 mt-3">
        {selection !== undefined && (
          <>
            <FadeIn>
              <span>Are you sure?</span>
            </FadeIn>
            <button
              onClick={() => setSelection(undefined)}
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700"
            >
              Cancel
            </button>
          </>
        )}

        {selection !== "reject" && (
          <button
            onClick={() => handleClick("approve")}
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Approve
          </button>
        )}
        {selection !== "approve" && (
          <button
            onClick={() => handleClick("reject")}
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Reject
          </button>
        )}
      </div>
    </div>
  );
}
