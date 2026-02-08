import { useState } from "react";
import { useToasterContext } from "../../../hooks";
import { Button, Checkbox, RadioGroup } from "../../../components/ui";

interface ResetBodyProps {
  close: () => void;
  resetDevice: (action: "wipe" | "powerwash") => Promise<string>;
}

export default function ResetBody({ close, resetDevice }: ResetBodyProps) {
  const { showToaster } = useToasterContext();
  const [radio, setRadio] = useState<"wipe" | "powerwash">();
  const [checked, setChecked] = useState(false);

  const handleRadioChange = (value: string) => setRadio(value as "wipe" | "powerwash");

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

  return (
    <>
      <div>
        <p>
          Resetting your device will remove data. Please select what type of device reset you would
          like to perform.
        </p>
        <div style={{ margin: "40px 0" }}>
          <RadioGroup
            name="reset-type"
            options={[
              {
                label:
                  "Clear User Profiles - remove all user profile data, but keep device policy and enrollment (RECOMMENDED)",
                value: "wipe",
              },
              {
                label:
                  "Factory Reset - remove all data including user profiles, device policies, and enrollment data. Warning: This will revert the device back to factory state with no enrollment, unless the device is subject to forced or auto re-enrollment.",
                value: "powerwash",
              },
            ]}
            value={radio}
            onChange={handleRadioChange}
          />
        </div>
        <div>
          <Checkbox
            size="lg"
            onChange={handleCheckboxChange}
            checked={checked}
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
