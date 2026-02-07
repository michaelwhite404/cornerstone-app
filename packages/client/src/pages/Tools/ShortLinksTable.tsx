import { ShortUrlModel } from "../../types/models";
import QRCode from "../../components/QRCode";
import TableWrapper from "../../components/TableWrapper";
import "./ShortLinksTable.sass";

const headers = ["Full URL", "Short Link", "Clicks", "QR Clicks", "QR Code"];

export default function ShortLinksTable({ links }: { links: ShortUrlModel[] }) {
  const getClickableLink = (link: string) => {
    return link.startsWith("http://") || link.startsWith("https://") ? link : `http://${link}`;
  };
  return (
    <div className="hidden md:block">
      <TableWrapper>
        <table className="short-link-table">
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
                    href={`http://${process.env.REACT_APP_SHORT_URL_HOST}/${link.short}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {process.env.REACT_APP_SHORT_URL_HOST}/{link.short}
                  </a>
                </td>
                <td>{link.clicks}</td>
                <td>{link.qr_clicks}</td>
                <td>
                  <QRCode
                    size={40}
                    value={`${process.env.REACT_APP_SHORT_URL_HOST}/${link.short}?refer_method=qr`}
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
