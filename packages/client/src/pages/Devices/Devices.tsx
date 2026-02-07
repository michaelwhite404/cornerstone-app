import capitalize from "capitalize";
import pluralize from "pluralize";
import { Link } from "react-router-dom";
import { useDocTitle } from "../../hooks";

export default function Devices() {
  useDocTitle("Devices | Cornerstone App");

  const links = [
    {
      resource: "chromebook",
      img: {
        src: "/icons/chrome-icon.png",
        alt: "Chrome Icon",
      },
    },
    {
      resource: "tablet",
      img: {
        src: "/icons/tablet-icon.png",
        alt: "Tablet Icon",
      },
    },
    {
      resource: "robot",
      img: {
        src: "/icons/robot-icon.png",
        alt: "Robot Icon",
      },
    },
  ];

  return (
    <div style={{ padding: "10px 25px 25px" }}>
      <div className="flex items-center justify-between">
        <h1 style={{ marginBottom: "10px" }}>Devices</h1>
      </div>
      <div className="mt-5">
        <div className="grid gap-[15px] grid-cols-2 max-[700px]:grid-cols-1">
          {links.map(({ resource, img }) => (
            <Link className="flex w-full shadow-[0_1px_6px_#c3c3c3] p-5 rounded-lg no-underline transition-all duration-[400ms] bg-white hover:text-inherit hover:shadow-[0_1px_9px_3px_#c3c3c3]" to={`/devices/${pluralize(resource)}`} key={resource}>
              <img src={img.src} alt={img.alt} className="w-10 h-10" />
              <div className="ml-5">
                <div className="font-semibold text-base mb-[5px]">{capitalize(pluralize(resource))}</div>
                <div>View, edit, check in and check out {pluralize(resource)}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
