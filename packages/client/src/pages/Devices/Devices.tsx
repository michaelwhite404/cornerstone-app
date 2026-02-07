import capitalize from "capitalize";
import pluralize from "pluralize";
import { Link } from "react-router-dom";
import { useDocTitle } from "../../hooks";
import "./Devices.sass";

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
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Devices</h1>
      </div>
      <div className="device-wrapper">
        <div className="device-grid-container">
          {links.map(({ resource, img }) => (
            <Link className="device-item" to={`/devices/${pluralize(resource)}`} key={resource}>
              <img src={img.src} alt={img.alt} />
              <div>
                <div className="device-heading">{capitalize(pluralize(resource))}</div>
                <div>View, edit, check in and check out {pluralize(resource)}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
