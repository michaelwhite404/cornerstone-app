import { Dialog, Transition } from "@headlessui/react";
import { AnimatePresence } from "framer-motion";
import { Fragment, useState } from "react";
import { EmployeeModel } from "../../types/models";
import { CreateUserArgs } from "./Users";
import CreateUser from "./AddUser/CreateUser";
import UserCreated from "./AddUser/UserCreated";

interface AddUserProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createUser: (data: CreateUserArgs) => Promise<EmployeeModel>;
}

const initialUser = {
  firstName: "",
  lastName: "",
  email: "@cornerstone-schools.org",
  title: "",
  homeroomGrade: "" as string | number,
  role: "",
  timesheetEnabled: false,
  password: "",
  changePasswordAtNextLogin: true,
  doNotAddGoogleUser: false,
};

export default function AddUser(props: AddUserProps) {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(initialUser);
  const [createdUser, setCreatedUser] = useState<EmployeeModel>();
  const close = () => {
    props.setOpen(false);
    setTimeout(() => {
      setCreatedUser(undefined);
      setUser(initialUser);
      setStep(1);
    }, 300);
  };

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => null}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div>
                <AnimatePresence mode="wait" initial={false}>
                  {step === 1 && (
                    <CreateUser
                      setOpen={props.setOpen}
                      createUser={props.createUser}
                      setStep={setStep}
                      setCreatedUser={setCreatedUser}
                      user={user}
                      setUser={setUser}
                      close={close}
                    />
                  )}
                  {step === 2 && createdUser && (
                    <UserCreated createdUser={createdUser} close={close} />
                  )}
                </AnimatePresence>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
