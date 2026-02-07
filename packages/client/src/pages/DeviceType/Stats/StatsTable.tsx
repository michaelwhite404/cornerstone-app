import { Brand, Model, Totals } from "../../../types/brand";
import "./StatsTable.sass";

/* eslint-disable jsx-a11y/no-redundant-roles */
export default function StatsTable({ brands, totals }: { brands: Brand[]; totals: Totals }) {
  const headings = ["Brand", "Total", "Available", "Checked Out", "Broken", "Not Available"];

  const rows = brands.map((brand) => (
    <>
      <BrandRow brand={brand} key={brand.brand} />
      {brand.models
        .sort((a, b) => (a.model > b.model ? 1 : a.model < b.model ? -1 : 0))
        .map((model) => (
          <ModelRow model={model} />
        ))}
    </>
  ));

  return (
    <table className="table-wrapper table-expanded device-stats-table">
      <colgroup>
        <col width="40%"></col>
        <col width="15%"></col>
      </colgroup>
      <thead>
        <tr>
          {headings.map((heading) => (
            <th key={heading}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody role="rowgroup">{rows}</tbody>
      <tfoot>
        <TotalsRow totals={totals} />
      </tfoot>
    </table>
  );
}

const BrandRow = ({ brand }: { brand: Brand }) => {
  return (
    <tr className="brand-row">
      <td>
        <div className="brand-title">
          <img
            src={`/device-logos/${brand.brand}-Logo.png`}
            alt={brand.brand + " Logo"}
            style={{ width: 30, marginRight: 15 }}
          />
          {brand.brand}
        </div>
      </td>
      <td>{brand.count}</td>
      <td>{getBrandStatusCount(brand.models, "Available")}</td>
      <td>{getBrandStatusCount(brand.models, "Checked Out")}</td>
      <td>{getBrandStatusCount(brand.models, "Broken")}</td>
      <td>{getBrandStatusCount(brand.models, "Not Available")}</td>
    </tr>
  );
};

const ModelRow = ({ model }: { model: Model }) => {
  return (
    <tr className="model-row">
      <td>{model.model}</td>
      <td>{model.count}</td>
      <td>{getModelStatusCount(model.statuses, "Available")}</td>
      <td>{getModelStatusCount(model.statuses, "Checked Out")}</td>
      <td>{getModelStatusCount(model.statuses, "Broken")}</td>
      <td>{getModelStatusCount(model.statuses, "Not Available")}</td>
    </tr>
  );
};

const TotalsRow = ({ totals }: { totals: Totals }) => {
  return (
    <tr className="totals-row">
      <td>Total</td>
      <td>{totals.count}</td>
      <td>{getModelStatusCount(totals.statuses, "Available")}</td>
      <td>{getModelStatusCount(totals.statuses, "Checked Out")}</td>
      <td>{getModelStatusCount(totals.statuses, "Broken")}</td>
      <td>{getModelStatusCount(totals.statuses, "Not Available")}</td>
    </tr>
  );
};

const getModelStatusCount = (array: any[], status: string): number => {
  const statusIndex = array.findIndex((x) => x.status === status);
  return statusIndex === -1 ? 0 : array[statusIndex].count;
};

const getBrandStatusCount = (array: any[], status: string): number => {
  let nOfStatus = 0;
  for (let i = 0; i < array.length; i++) {
    nOfStatus += getModelStatusCount(array[i].statuses, status);
  }
  return nOfStatus;
};
