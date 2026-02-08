import { useDocTitle } from "../../hooks";
import ShortUrl from "./ShortUrl";

function Tools() {
  useDocTitle("Tools | Cornerstone App");
  return (
    <div style={{ padding: "10px 25px 25px" }}>
      <div className="flex items-center justify-between">
        <h1 style={{ marginBottom: "10px" }}>Tools</h1>
      </div>
      <div className="mt-5">
        <div className="grid gap-[15px] grid-cols-2 max-[700px]:grid-cols-1">
          {/* {links.map(({ resource, img }) => (
            <Link className="flex items-center p-5 bg-white rounded-lg shadow-[0_1px_20px_-3px_rgba(0,0,0,0.15)] transition-shadow duration-200 hover:shadow-[0_1px_20px_-3px_rgba(0,0,0,0.3)] no-underline text-gray-700" to={`/devices/${pluralize(resource)}`} key={resource}>
              <img src={img.src} alt={img.alt} />
              <div>
                <div className="font-semibold text-base mb-[5px]">{capitalize(pluralize(resource))}</div>
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
