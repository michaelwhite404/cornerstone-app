import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useState } from "react";
import LabeledInput2 from "../../components/LabeledInput2";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { useToasterContext } from "../../hooks";

const initialData = { password: "", passwordConfirm: "" };

export default function Password() {
  const [data, setData] = useState(initialData);
  const [submitting, setSubmitting] = useState(false);
  const { showToaster, showError } = useToasterContext();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const validPassword = data.password.length >= 8;
  const confirmedPassword = data.password === data.passwordConfirm;

  const submittable = validPassword && confirmedPassword;

  const updatePassword = async () => {
    const res = await axios.patch("/api/v2/users/update-password", data);
    return res.data.data;
  };

  const submitPasswordChange = async () => {
    setSubmitting(true);
    await updatePassword()
      .then(() => {
        showToaster("Password changed", "success");
        setData(initialData);
      })
      .catch(showError);
    setSubmitting(false);
  };
  return (
    <div className="mt-10 divide-y divide-gray-200">
      <div className="space-y-1">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Password</h3>
        <p className="max-w-2xl text-sm text-gray-500">Password must be at least 8 characters.</p>
      </div>
      <div className="mt-6">
        <div className="">
          <div className="py-4 flex">
            <div className="flex-grow">
              <LabeledInput2
                label="New Password"
                name="password"
                type="password"
                value={data.password}
                onChange={handleChange}
              />
            </div>
            {validPassword ? (
              <CheckCircleIcon className="h-6 w-6 text-green-600 self-end mb-2.5 ml-3" />
            ) : (
              <XCircleIcon className="h-6 w-6 text-red-600 self-end mb-2.5 ml-3" />
            )}
          </div>
          <div className="py-4 flex">
            <div className="flex-grow">
              <LabeledInput2
                label="Confirm New Password"
                name="passwordConfirm"
                type="password"
                value={data.passwordConfirm}
                onChange={handleChange}
              />
            </div>
            {submittable ? (
              <CheckCircleIcon className="h-6 w-6 text-green-600 self-end mb-2.5 ml-3" />
            ) : (
              <XCircleIcon className="h-6 w-6 text-red-600 self-end mb-2.5 ml-3" />
            )}
          </div>
          <div className="py-4 flex justify-end">
            <PrimaryButton
              text="Save Password"
              disabled={submitting || !submittable}
              onClick={submitPasswordChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
