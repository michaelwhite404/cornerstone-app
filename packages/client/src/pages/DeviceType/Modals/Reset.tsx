import { Button, Checkbox, RadioGroup } from "@/components/ui";
import React, { useState } from "react";
import { useToasterContext } from "@/hooks";

interface ResetBodyProps {
  close: () => void;
  resetDevice: (action: "wipe" | "powerwash") => Promise<string>;
}

export default function Reset({ close, resetDevice }: ResetBodyProps) {
  const [radio, setRadio] = useState<"wipe" | "powerwash">();
  const [checked, setChecked] = useState(false);
  const { showToaster } = useToasterContext();

  const handleCheckboxChange = () => setChecked(!checked);
  const submittable = Boolean(radio) && checked;
  const handleSubmit = async () => {
    if (!submittable) return;
    try {
      const message = await resetDevice(radio!);
      showToaster(message, "success");
      close();
    } catch {
      showToaster("There was an issue resetting the device", "danger");
    }
  };

  const radioOptions = [
    {
      label:
        "Clear User Profiles — to remove all user profile data, but keep device policy and enrollment (RECOMMENDED)",
      value: "wipe",
    },
    {
      label:
        "Factory Reset — to remove all data including user profiles, device policies, and enrollment data. Warning: This will revert the device back to factory state with no enrollment, unless the device is subject to forced or auto re-enrollment.",
      value: "powerwash",
    },
  ];

  return (
    <>
      <div>
        <p>
          Resetting your device will remove data. Please select what type of device reset you would
          like to perform.
        </p>
        <div style={{ margin: "40px 0" }}>
          <RadioGroup
            name="reset-action"
            options={radioOptions}
            value={radio}
            onChange={(value) => setRadio(value as "wipe" | "powerwash")}
          />
        </div>
        <div>
          <Checkbox
            size="lg"
            onChange={handleCheckboxChange}
            label="I understand this will remove data from the device and cannot be undone."
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button text="Cancel" onClick={close} />
        <Button text="Reset" variant="primary" onClick={handleSubmit} disabled={!submittable} />
      </div>
    </>
  );
}
