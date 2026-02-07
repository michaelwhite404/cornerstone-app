import { Button, Checkbox, Classes, Radio, RadioGroup } from "@blueprintjs/core";
import { useState } from "react";
import { useToasterContext } from "../../../hooks";

interface ResetBodyProps {
  close: () => void;
  resetDevice: (action: "wipe" | "powerwash") => Promise<string>;
}

export default function ResetBody({ close, resetDevice }: ResetBodyProps) {
  const { showToaster } = useToasterContext();
  const [radio, setRadio] = useState<"wipe" | "powerwash">();
  const [checked, setChecked] = useState(false);

  const handleRadioChange = (event: React.FormEvent<HTMLInputElement>) =>
    setRadio(event.currentTarget.value as "wipe" | "powerwash");

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
      <div className={Classes.DIALOG_BODY}>
        <p>
          Resetting your device will remove data. Please select what type of device reset you would
          like to perform.
        </p>
        <div style={{ margin: "40px 0" }}>
          <RadioGroup onChange={handleRadioChange} selectedValue={radio}>
            <Radio className="radio" value="wipe" large>
              <strong>Clear User Profiles</strong> to remove all user profile data, but keep device
              policy and enrollment <strong>(RECOMMENDED)</strong>
            </Radio>
            <br />
            <Radio className="radio" value="powerwash" large>
              <strong>Factory Reset</strong> to remove all data including user profiles, device
              policies, and enrollment data. {/* <span style={{ color: "red" }}> */}Warning:
              {/* </span> */} This will revert the device back to factory state with no enrollment,
              unless the device is subject to forced or auto re-enrollment.
            </Radio>
          </RadioGroup>
        </div>
        <div>
          <Checkbox large onChange={handleCheckboxChange}>
            I understand this will remove data from the device and cannot be undone.
          </Checkbox>
        </div>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button text="Cancel" onClick={close} />
          <Button text="Reset" intent="primary" onClick={handleSubmit} disabled={!submittable} />
        </div>
      </div>
    </>
  );
}
