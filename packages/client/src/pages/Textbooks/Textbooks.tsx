import { Menu as HMenu, Transition } from "@headlessui/react";
import { CogIcon, PlusIcon, LoginIcon, LogoutIcon } from "@heroicons/react/solid";
import axios, { AxiosError } from "axios";
import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui";
import Slideover from "../../components/Slideover";
import { ToasterContext } from "../../context/ToasterContext";
import { TextbookModel } from "../../types/models/textbookTypes";
import { useDocTitle } from "../../hooks";
import { APIError } from "../../types/apiResponses";
import CheckoutTable from "./CheckoutTable";
import TextbooksTable from "./TextbooksTable";

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
  const { showToaster } = useContext(ToasterContext);

  const canCheckOut = selected.filter((t) => t.status === "Available");
  const canCheckIn = selected.filter((t) => t.status === "Checked Out");

  const handleClose = () => {
    setOpen(false);
    setPageStatus("Viewing");
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "textbookSet.title",
        Cell: ({ value }: any) => {
          return <span className="font-medium">{value}</span>;
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
        showToaster(
          `${(err as AxiosError<APIError>).response!.data.message}`,
          "danger"
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 style={{ marginBottom: "10px" }}>Textbooks</h1>
        <HMenu as="div" className="relative">
          <HMenu.Button as={Fragment}>
            <Button
              icon={<CogIcon className="h-5 w-5" />}
              text="Actions"
              size="lg"
            />
          </HMenu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <HMenu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <HMenu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-gray-100" : ""
                      } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                      onClick={showAddTextbook}
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Add Textbooks
                    </button>
                  )}
                </HMenu.Item>
                {canCheckIn.length > 0 && (
                  <HMenu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-100" : ""
                        } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                        onClick={showCheckInTextbook}
                      >
                        <LoginIcon className="h-5 w-5 mr-2" />
                        Check In {canCheckIn.length} Textbooks
                      </button>
                    )}
                  </HMenu.Item>
                )}
                {canCheckOut.length > 0 && (
                  <HMenu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-gray-100" : ""
                        } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                        onClick={showCheckOutTextbook}
                      >
                        <LogoutIcon className="h-5 w-5 mr-2" />
                        Check Out {canCheckOut.length} Textbooks
                      </button>
                    )}
                  </HMenu.Item>
                )}
              </div>
            </HMenu.Items>
          </Transition>
        </HMenu>
      </div>
      <div className="mt-[15px] shadow-[0px_1px_20px_-3px_rgba(0,0,0,0.15)] rounded-lg overflow-hidden w-full select-none">
        <TableToolbox></TableToolbox>
        <TextbooksTable columns={columns} data={data} setSelected={setSelected} />
      </div>
      <Slideover open={open} onOverlayClick={handleClose}>
        <div className="flex h-full flex-col bg-white shadow-xl">
          <div className="px-4 py-6 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">{pageStatus} Textbooks</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
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
          </div>
        </div>
      </Slideover>
    </div>
  );
}
