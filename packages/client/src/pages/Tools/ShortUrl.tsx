import { useMemo, useState } from "react";
import { AxiosError } from "axios";
import { Checkbox, Label, Switch } from "../../components/ui";
import { nanoid } from "nanoid";
import { useShortUrls, useCreateShortUrl } from "../../api";
import { useAuth, useDocTitle, useToasterContext, useToggle } from "../../hooks";
import LabeledInput from "../../components/Inputs/LabeledInput";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import { APIError } from "../../types/apiResponses";
import ShortLinksTable from "./ShortLinksTable";
import ShortLinksTableMobile from "./ShortLinksTableMobile";

export default function ShortUrl() {
  useDocTitle("Short URL | Tools | Cornerstone App");
  const { showToaster } = useToasterContext();
  const [newLink, setNewLink] = useState({
    full: "",
    short: "",
    autogenerate: false,
  });
  const [staff, toggle] = useToggle();
  const { user } = useAuth();

  const { data: shortLinks = [] } = useShortUrls();
  const createShortUrlMutation = useCreateShortUrl();

  const myLinks = useMemo(
    () => shortLinks.filter((link) => link.createdBy === user?._id),
    [shortLinks, user?._id]
  );

  const clear = () =>
    setNewLink({
      full: "",
      short: newLink.autogenerate ? nanoid(8) : "",
      autogenerate: newLink.autogenerate,
    });

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setNewLink({ ...newLink, [e.target.name]: e.target.value });

  const toggleCheckbox: React.FormEventHandler<HTMLInputElement> = () => {
    newLink.autogenerate
      ? setNewLink({ full: newLink.full, short: "", autogenerate: false })
      : setNewLink({ full: newLink.full, short: nanoid(8), autogenerate: true });
  };

  const handleSubmit = async () => {
    try {
      await createShortUrlMutation.mutateAsync({
        full: newLink.full,
        short: newLink.short,
      });
      showToaster("Short link created", "success");
      clear();
    } catch (err) {
      showToaster((err as AxiosError<APIError>).response!.data.message, "danger");
    }
  };

  const submittable = newLink.full.length > 0 && newLink.short.length > 0;

  return (
    <div style={{ padding: "10px 25px 25px" }}>
      <div className="flex items-center justify-between">
        <h1 style={{ marginBottom: "10px" }}>Short URL</h1>
        <p>Create short links with Cornerstone branding</p>
      </div>
      <div className="align-center flex md:flex-row mt-10 flex-col space-between">
        <div className="w-full md:w-1/3">
          <LabeledInput
            label="Full URL"
            name="full"
            value={newLink.full}
            onChange={handleChange}
            placeholder="https://your-full-link.com/example-ending"
            fill
          />
        </div>
        <div className="w-full md:w-1/3">
          <LabeledInput
            label="Short Ending"
            name="short"
            value={newLink.short}
            onChange={handleChange}
            disabled={newLink.autogenerate}
            fill
          />
        </div>
        <PrimaryButton
          className="hidden md:block"
          text="+ Add Short Link"
          onClick={handleSubmit}
          disabled={!submittable}
        />
      </div>
      <div>
        <Label>
          Short Link: {process.env.REACT_APP_SHORT_URL_HOST}/
          <span style={{ color: "dodgerblue" }}>{newLink.short}</span>
        </Label>
        <Checkbox
          style={{ userSelect: "none" }}
          checked={newLink.autogenerate}
          onChange={toggleCheckbox}
          label="Auto-generate short link"
        />
        <PrimaryButton
          className="md:hidden block ml-auto mt-6"
          text="+ Add Short Link"
          onClick={handleSubmit}
          disabled={!submittable}
        />
      </div>
      <div className="mt-24">
        <div className="flex flex-col sm:flex-row space-between">
          <h3 className="mb-3 sm:mt-0">Short Link Created by {staff ? "Staff" : "You"}</h3>
          <Switch checked={staff} onChange={toggle} label="View All Staff" />
        </div>
        <ShortLinksTable links={staff ? shortLinks : myLinks} />
        <ShortLinksTableMobile links={staff ? shortLinks : myLinks} />
      </div>
    </div>
  );
}
