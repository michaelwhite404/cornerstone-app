import axios from "axios";
import React, { useEffect, useState } from "react";
import classnames from "classnames";
import { TextbookSetModel } from "../../../src/types/models/textbookSetTypes";
import Badge from "../components/Badge/Badge";
import PageHeader from "../components/PageHeader";
import { APITextbookSetsResponse } from "../types/apiResponses";
import "./TextbooksTest.sass";
import ContentPanels from "./ContentPanels";

interface LetterGroup {
  letter: string;
  children: TextbookSetModel[];
}

export default function TextbooksTest() {
  const [letterGroup, setLetterGroup] = useState<LetterGroup[]>([]);
  const [selected, setSelected] = useState<TextbookSetModel>();

  useEffect(() => {
    getTextbookSets();

    async function getTextbookSets() {
      const res = await axios.get<APITextbookSetsResponse>("/api/v2/textbooks", {
        params: {
          sort: "title",
        },
      });

      let groups = res.data.data.textbooks.reduce((r, e) => {
        let letter = e.title[0].toUpperCase();
        if (!r[letter]) r[letter] = { letter, children: [e] };
        else r[letter].children.push(e);
        return r;
      }, {} as { [letter: string]: LetterGroup });

      const letterGroup = Object.values(groups).sort((a, b) => {
        var nameA = a.letter;
        var nameB = b.letter;
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });

      setLetterGroup(letterGroup);
    }
  }, []);

  return (
    <div className="flex" style={{ height: "100%" }}>
      <aside className="side-table">
        <div className="side-table-top">
          <PageHeader text="Textbooks" />
          <p>Search directory of many books</p>
        </div>
        <div className="side-table-content">
          {letterGroup.map((group) => (
            <div className="letter-group">
              <div className="letter-header">{group.letter}</div>
              <ul className="letter-list">
                {group.children.map((set) => (
                  <li onClick={() => setSelected(set)}>
                    <div
                      className={classnames("book-set", { selected: selected?._id === set._id })}
                    >
                      <span>
                        <span style={{ fontWeight: 500, marginRight: "0.5rem" }}>{set.title}</span>
                        <Badge text={set.count.toString()} color="blue" noDot />
                      </span>
                      <div className="book-subject">{set.class}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>
      <main className="main-content">{selected && <ContentPanels textbook={selected} />}</main>
    </div>
  );
}