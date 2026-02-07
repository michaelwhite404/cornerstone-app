import { ShortUrlModel } from "../../types/models";
import QRCode from "../../components/QRCode";
import TableWrapper from "../../components/TableWrapper";

export default function ShortLinksTableMobile({ links }: { links: ShortUrlModel[] }) {
  return (
    <div className="short-link-table-mobile md:hidden">
      <TableWrapper>
        {links.map((link) => (
          <div key={link._id} className="flex space-between align-center px-4 py-3 border-b">
            <div className="overflow-hidden">
              <div className="mb-1.5 truncate pr-5">
                <span className="header">Full:</span> {link.full}
              </div>
              <div className="mb-1.5 truncate pr-5">
                <span className="header">Short:</span> http://
                {process.env.REACT_APP_SHORT_URL_HOST}/{link.short}
              </div>
              <div className="truncate pr-5">
                <span className="mr-3">
                  <span className="header">Clicks:</span> {link.clicks}
                </span>
                <span>
                  <span className="header">QR Clicks:</span> {link.qr_clicks}
                </span>
              </div>
            </div>
            <div style={{ minWidth: 40 }}>
              <QRCode
                size={40}
                value={`${process.env.REACT_APP_SHORT_URL_HOST}/${link.short}?refer_method=qr`}
              />
            </div>
          </div>
        ))}
      </TableWrapper>
    </div>
  );
}
