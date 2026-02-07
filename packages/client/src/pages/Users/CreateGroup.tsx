import { useState } from "react";
import { AddOnInput } from "../../components/Inputs";
import Modal from "../../components/Modal";
import { useToasterContext } from "../../hooks";

interface CreateGroupProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createGroup: (data: { name: string; email: string; description: string }) => Promise<void>;
}

const initialGroup = {
  name: "",
  description: "",
  email: "@cornerstone-schools.org",
};

export default function CreateGroup(props: CreateGroupProps) {
  const [group, setGroup] = useState(initialGroup);
  const { showToaster } = useToasterContext();

  const close = () => {
    props.setOpen(false);
    setGroup(initialGroup);
  };

  const submittable = group.name && group.email.split("@")[0].length > 0;

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    let { name, value } = e.target;
    if (name === "email") value = value + "@cornerstone-schools.org";
    setGroup({ ...group, [name]: value });
  };

  const submit = () =>
    props
      .createGroup(group)
      .then(() => {
        showToaster("Group Created!", "success");
        close();
      })
      .catch((err: Error) => showToaster(err.message, "danger"));

  return (
    <Modal
      open={props.open}
      setOpen={props.setOpen}
      onClose={() => props.setOpen(false)}
      disableOverlayClick
    >
      <div className="font-medium text-xl mb-5">Create Group</div>
      <div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="divide-y divide-gray-200 px-4">
            <div className="space-y-6 pt-6 pb-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                  Group Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    onChange={handleChange}
                    value={group.name}
                  />
                </div>
              </div>
              <div>
                <AddOnInput
                  addOnText="@cornerstone-schools.org"
                  name="email"
                  id="email"
                  label="Email"
                  addOnSide="right"
                  onChange={handleChange}
                  value={group.email.split("@")[0]}
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    onChange={handleChange}
                    value={group.description}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className="disabled:bg-gray-300 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={submit}
          disabled={!submittable}
        >
          Create Group
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
          onClick={close}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
