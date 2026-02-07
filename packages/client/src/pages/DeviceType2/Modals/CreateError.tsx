import { Button, Classes } from "@blueprintjs/core";
import React, { useState } from "react";
import { DeviceModel } from "../../../types/models/deviceTypes";
import { ErrorLogModel } from "../../../types/models/errorLogTypes";
import LabeledInput from "../../../components/Inputs/LabeledInput";
import LabeledTextArea from "../../../components/Inputs/LabeledTextArea";
import { useToasterContext } from "../../../hooks";

interface CreateErrorProps {
  /**Closes the dialog */
  close: () => void;
  createError: (data: { title: string; description: string }) => Promise<{
    errorLog: ErrorLogModel;
    device: DeviceModel;
  }>;
  reFetchDevices: () => Promise<void>;
}

export default function CreateError({ close, createError, reFetchDevices }: CreateErrorProps) {
  const [data, setData] = useState({ title: "", description: "" });
  const { showToaster } = useToasterContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const submittable = Object.values(data).every((v) => v.length);
  const handleSubmit = () => {
    createError(data)
      .then(() => {
        showToaster("Error created successsfully", "success");
        reFetchDevices();
        close();
      })
      .catch((err) => showToaster(err.message, "danger"));
  };

  return (
    <>
      <div className={Classes.DIALOG_BODY}>
        <LabeledInput name="title" label="Title" required onChange={handleChange} />
        <LabeledTextArea
          name="description"
          label="Description"
          fill
          style={{ minHeight: 150 }}
          onChange={handleChange}
        />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button text="Cancel" onClick={close} />
          <Button
            text="Create Error"
            intent="primary"
            onClick={handleSubmit}
            disabled={!submittable}
          />
        </div>
      </div>
    </>
  );
}
