import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import SideTable from "../../components/SideTable/SideTable";
import { APITextbookSetsResponse } from "../../types/apiResponses";
import "./TextbooksTest.sass";

export default function Tables() {
  const [textbookSets, setTextbookSets] = useState<APITextbookSetsResponse["data"]["textbooks"]>(
    []
  );

  /**
  class: "Calculus"
  count: 7
  title: "AP Calculus AB"
 */

  const data = useMemo(() => textbookSets, [textbookSets]);
  const columns = useMemo(
    () => [
      {
        Header: "Class",
        accessor: "class",
      },
      {
        Header: "Count",
        accessor: "count",
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "First Letter",
        id: "firstLetter",
        accessor: ({ title }: { title: string }) => title[0].toUpperCase(),
      },
    ],
    []
  );

  useEffect(() => {
    getTextbookSets();
  }, []);
  async function getTextbookSets() {
    const res = await axios.get<APITextbookSetsResponse>("/api/v2/textbooks", {
      params: {
        sort: "title",
      },
    });
    setTextbookSets(res.data.data.textbooks);
  }

  return <SideTable data={data} columns={columns} /* groupBy={} */ />;
}
