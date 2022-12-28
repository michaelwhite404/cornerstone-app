import { useState } from "react";
import { EmployeeModel } from "../../../../src/types/models";
import LabeledInput2 from "../../components/LabeledInput2";

export default function Password({ user }: { user: EmployeeModel }) {
  const [data, setData] = useState({ password: "", passwordConfirm: "" });
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  // const submitPasswordChange = () => {}

  return (
    <div className="mt-10 divide-y divide-gray-200">
      <div className="space-y-1">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Password</h3>
        <p className="max-w-2xl text-sm text-gray-500">Use this page to update your password.</p>
      </div>
      <div className="mt-6">
        <dl className="">
          <div className="py-4">
            <LabeledInput2
              label="New Password"
              name="password"
              type="password"
              value={data.password}
              onChange={handleChange}
            />
          </div>
          <div className="py-4">
            <LabeledInput2
              label="Confirm New Password"
              name="passwordConfirm"
              type="password"
              value={data.passwordConfirm}
              onChange={handleChange}
            />
          </div>
        </dl>
      </div>
    </div>
  );
}
