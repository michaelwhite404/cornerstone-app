import React from "react";

export default function EmptyState() {
  return (
    <div className="flex justify-center w-full lg:absolute">
      <div className="flex align-center justify-center flex-col mt-8 py-5">
        <img
          className="w-[80%] lg:w-[70%] xl:w-[50%] opacity-70"
          src="/Sick_Leave_Illustration.png"
          alt="Sick Leave"
        />
        <div className="lg:text-lg text-md font-medium text-center mt-2 text-gray-500">
          You don't have any leave requests so far
        </div>
      </div>
    </div>
  );
}
