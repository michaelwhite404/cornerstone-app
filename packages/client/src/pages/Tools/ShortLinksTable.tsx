import { ShortUrlModel } from "../../types/models";
import QRCode from "../../components/QRCode";
import TableWrapper from "../../components/TableWrapper";


const headers = ["Full URL", "Short Link", "Clicks", "QR Clicks", "QR Code"];

export default function ShortLinksTable({ links }: { links: ShortUrlModel[] }) {
  const getClickableLink = (link: string) => {
    return link.startsWith("http://") || link.startsWith("https://") ? link : `http://${link}`;
  };
  return (
    <div className="hidden md:block">
      <TableWrapper>
        <table className="[&_tr_td]:max-w-[250px] [&_tr_td]:overflow-hidden [&_tr_td]:text-ellipsis [&_tr_td]:whitespace-nowrap [&_tr_th]:max-w-[250px] [&_tr_th]:overflow-hidden [&_tr_th]:text-ellipsis [&_tr_th]:whitespace-nowrap [&_tr_:first-child]:pl-[15px] [&_tr_:first-child]:pr-[15px] [&_tr_td]:py-1.5 [&_tr_td]:pr-[15px]">
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link._id}>
                <td>
                  <a href={getClickableLink(link.full)} target="_blank" rel="noreferrer">
                    {link.full}
                  </a>
                </td>
                <td>
                  <a
                    href={`http://${import.meta.env.VITE_SHORT_URL_HOST}/${link.short}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {import.meta.env.VITE_SHORT_URL_HOST}/{link.short}
                  </a>
                </td>
                <td>{link.clicks}</td>
                <td>{link.qr_clicks}</td>
                <td>
                  <QRCode
                    size={40}
                    value={`${import.meta.env.VITE_SHORT_URL_HOST}/${link.short}?refer_method=qr`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>
    </div>
  );
}
