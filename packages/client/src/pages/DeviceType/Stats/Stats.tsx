/* eslint-disable jsx-a11y/no-redundant-roles */
import capitalize from "capitalize";
import { useParams } from "react-router-dom";
import { useDeviceStats } from "../../../api";
import { useDocTitle } from "../../../hooks";
import StatsTable from "./StatsTable";

export default function Stats() {
  const { deviceType } = useParams<{ deviceType: string }>();
  useDocTitle(`${capitalize(deviceType!)} Stats | Cornerstone App`);
  const { data } = useDeviceStats(deviceType!);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1
          style={{ textTransform: "capitalize", marginBottom: "10px" }}
        >{`${deviceType} Stats`}</h1>
      </div>
      {data?.totals && <StatsTable brands={data.brands} totals={data.totals} />}
    </>
  );
}
