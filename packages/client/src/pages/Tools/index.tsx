import { useDocTitle } from "../../hooks";
import ShortUrl from "./ShortUrl";

function Tools() {
  useDocTitle("Tools | Cornerstone App");
  return (
    <div style={{ padding: "10px 25px 25px" }}>
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Tools</h1>
      </div>
      <div className="device-wrapper">
        <div className="device-grid-container">
          {/* {links.map(({ resource, img }) => (
            <Link className="device-item" to={`/devices/${pluralize(resource)}`} key={resource}>
              <img src={img.src} alt={img.alt} />
              <div>
                <div className="device-heading">{capitalize(pluralize(resource))}</div>
                <div>View, edit, check in and check out {pluralize(resource)}</div>
              </div>
            </Link>
          ))} */}
        </div>
      </div>
    </div>
  );
}

Tools.ShortUrl = ShortUrl;

export default Tools;
