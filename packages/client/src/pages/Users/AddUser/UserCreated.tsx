import { Dialog } from "@headlessui/react";
import { ClipboardIcon } from "@heroicons/react/outline";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import { motion } from "framer-motion";
import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";
import { EmployeeModel } from "@/types/models";

interface UserCreatedProps {
  createdUser: EmployeeModel;
  close: () => void;
}

export default function UserCreated(props: UserCreatedProps) {
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { close, createdUser } = props;

  const goToUser = () => navigate(`/users/${createdUser.slug}`);

  return (
    <motion.div
      key="step2_modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{
        opacity: 0,
        transition: { ease: "easeOut", duration: 0.3 },
      }}
    >
      <Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
        <div>
          <div className="text-white px-6 pt-4 pb-2 bg-green-600">
            <span className="font-medium text-xl">User Created!</span>
            <p className="mt-1">The infomation for the new user is below</p>
          </div>
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 lg:w-96">
            <div className="flex mb-3">
              <div className="sm:w-28 w-20 font-medium text-gray-700">Name</div>
              <div>
                {createdUser.firstName} {createdUser.lastName}
              </div>
            </div>
            <div className="flex mb-8">
              <div className="sm:w-28 w-20 font-medium text-gray-700">Email</div>
              <div>{createdUser.email}</div>
            </div>
            <div className="flex align-center">
              <div className="sm:w-28 w-20 font-medium text-gray-700">Password</div>
              <div className="flex align-center justify-between flex-1">
                {showPassword ? (
                  <div>{createdUser.password}</div>
                ) : (
                  <div className="text-xl">
                    {Array.from({ length: createdUser.password.length })
                      .map(() => "•")
                      .join("")}
                  </div>
                )}
                <button
                  className="ml-4 w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-lg"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-center mt-6 mb-2">
              {!passwordCopied ? (
                <CopyToClipboard text={createdUser.password} onCopy={() => setPasswordCopied(true)}>
                  <button className="flex items-center px-2 py-1 rounded text-blue-400 font-medium">
                    <ClipboardIcon className="w-5 mr-2" />
                    Copy Password
                  </button>
                </CopyToClipboard>
              ) : (
                <div className="flex items-center px-2 py-1 rounded text-blue-400 font-medium">
                  PASSWORD COPIED!!!
                </div>
              )}
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="disabled:bg-gray-300 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={goToUser}
            >
              Go to User
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={close}
            >
              Stay on Page
            </button>
          </div>
        </div>
      </Dialog.Panel>
    </motion.div>
  );
}
