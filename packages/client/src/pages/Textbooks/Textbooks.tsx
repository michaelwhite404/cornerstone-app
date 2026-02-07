import { Button, Drawer, Menu, MenuItem, Toaster } from "@blueprintjs/core";
import axios, { AxiosError } from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { Popover2 } from "@blueprintjs/popover2";
import { TextbookModel } from "../../types/models/textbookTypes";
import { useDocTitle } from "../../hooks";
import { APIError } from "../../types/apiResponses";
import CheckoutTable from "./CheckoutTable";
import TextbooksTable from "./TextbooksTable";
import "./Table.sass";
import BadgeColor from "../../components/Badge/BadgeColor";
import Badge from "../../components/Badge/Badge";
import { numberToGrade } from "../../utils/grades";
import TableToolbox from "../../components/Table/TableToolbox";
import CheckinTable from "./CheckinTable";
import AddTable from "./AddTable";

export default function Textbooks() {
  useDocTitle("Textbooks | Cornerstone App");
  const [textbooks, setTextbooks] = useState<TextbookModel[]>([]);
  const [selected, setSelected] = useState<TextbookModel[]>([]);
  const [open, setOpen] = useState(false);
  const [pageStatus, setPageStatus] = useState<"Viewing" | "Check In" | "Check Out" | "Add">(
    "Viewing"
  );
  const toasterRef = useRef<Toaster>(null);

  const canCheckOut = selected.filter((t) => t.status === "Available");
  const canCheckIn = selected.filter((t) => t.status === "Checked Out");

  const handleClose = () => {
    setOpen(false);
    setPageStatus("Viewing");
  };

  const showToaster = (message: string, intent: "success" | "danger") => {
    toasterRef.current?.show({
      message,
      intent,
      icon: intent === "success" ? "tick" : "cross",
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "textbookSet.title",
        Cell: ({ value }: any) => {
          return <span className="set-name">{value}</span>;
        },
      },
      { Header: "Book #", accessor: "bookNumber" },
      {
        Header: "Quality",
        accessor: "quality",
        Cell: ({ row: { original } }: { row: { original?: TextbookModel } }) => {
          const quality = original?.quality;
          const statusColor: { [x: string]: BadgeColor } = {
            Excellent: "teal",
            Good: "lime",
            Acceptable: "sky",
            Poor: "fuchsia",
            Lost: "gray",
          };
          return quality ? <Badge color={statusColor[quality]} text={quality} /> || "" : null;
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row: { original } }: { row: { original?: TextbookModel } }) => {
          const status = original?.status;
          const statusColor: { [x: string]: BadgeColor } = {
            Available: "emerald",
            "Checked Out": "red",
            Replaced: "yellow",
            "Not Available": "blue",
          };
          return status ? <Badge color={statusColor[status]} text={status} /> || "" : null;
        },
      },
      {
        Header: "Student",
        accessor: "lastUser.fullName",
        Cell: ({ row: { original } }: { row: { original: TextbookModel } }) => {
          return original?.status === "Checked Out" && original.lastUser
            ? `${original.lastUser.fullName} (${numberToGrade(original.lastUser.grade!)})`
            : "";
        },
      },
    ],
    []
  );
  const data = useMemo(() => textbooks, [textbooks]);

  useEffect(() => {
    getTextbooks();

    async function getTextbooks() {
      try {
        const res = await axios.get("/api/v2/textbooks/books", {
          params: {
            sort: "textbookSet,bookNumber",
            active: true,
            limit: 100000,
          },
        });
        setTextbooks(res.data.data.books);
      } catch (err) {
        toasterRef.current?.show({
          message: `${(err as AxiosError<APIError>).response!.data.message}`,
          intent: "danger",
          icon: "cross",
        });
      }
    }
  }, []);

  const showAddTextbook = () => {
    setPageStatus("Add");
    setOpen(true);
  };

  const showCheckOutTextbook = () => {
    setPageStatus("Check Out");
    setOpen(true);
  };

  const showCheckInTextbook = () => {
    setPageStatus("Check In");
    setOpen(true);
  };

  const ActionsMenu = (
    <Menu className="custom-pop">
      <MenuItem icon="add" text="Add Textbooks" onClick={showAddTextbook} />

      {canCheckIn.length > 0 && (
        <MenuItem
          icon="log-in"
          text={`Check In ${canCheckIn.length} Textbooks`}
          onClick={showCheckInTextbook}
        />
      )}
      {canCheckOut.length > 0 && (
        <MenuItem
          icon="log-out"
          text={`Check Out ${canCheckOut.length} Textbooks`}
          onClick={showCheckOutTextbook}
        />
      )}
    </Menu>
  );

  return (
    <div>
      <div className="page-header">
        <h1 style={{ marginBottom: "10px" }}>Textbooks</h1>
        <Popover2 content={ActionsMenu} placement="bottom-end" className="menu-popover">
          <Button icon="settings" text="Actions" large />
        </Popover2>
      </div>
      <div className="table-wrapper">
        <TableToolbox></TableToolbox>
        <TextbooksTable columns={columns} data={data} setSelected={setSelected} />
      </div>
      <Drawer
        position="bottom"
        size="70%"
        usePortal
        isOpen={open}
        onClose={handleClose}
        hasBackdrop
        canEscapeKeyClose={false}
        canOutsideClickClose={false}
        title={`${pageStatus} Textbooks`}
      >
        {pageStatus === "Check Out" && (
          <CheckoutTable
            data={canCheckOut}
            setOpen={setOpen}
            setTextbooks={setTextbooks}
            showToaster={showToaster}
          />
        )}
        {pageStatus === "Check In" && (
          <CheckinTable
            data={canCheckIn}
            setOpen={setOpen}
            setTextbooks={setTextbooks}
            showToaster={showToaster}
          />
        )}
        {pageStatus === "Add" && (
          <AddTable setOpen={setOpen} setTextbooks={setTextbooks} showToaster={showToaster} />
        )}
      </Drawer>
      <Toaster position="top-right" ref={toasterRef} />
    </div>
  );
}
