import { Panel, PanelStack2 } from "@blueprintjs/core";
import React, { useEffect } from "react";
import { TextbookSetModel } from "../../types/models/textbookSetTypes";
import TextbooksTestContent from "./Panels/TextbooksTestPanel";

export default function ContentPanels({
  textbook,
  setSelected,
  setPageState,
}: {
  textbook: TextbookSetModel;
  setSelected: React.Dispatch<React.SetStateAction<TextbookSetModel | undefined>>;
  setPageState: React.Dispatch<React.SetStateAction<"blank" | "view" | "add">>;
}) {
  //--- PANEL STATES ---//
  const initialPanel: Panel<{
    textbook: TextbookSetModel;
    setSelected: React.Dispatch<React.SetStateAction<TextbookSetModel | undefined>>;
    setPageState: React.Dispatch<React.SetStateAction<"blank" | "view" | "add">>;
  }> = {
    props: {
      textbook,
      setSelected,
      setPageState,
    },
    renderPanel: TextbooksTestContent,
    title: "Panel 1",
  };
  const [currentPanelStack, setCurrentPanelStack] = React.useState<Array<Panel<any>>>([
    initialPanel,
  ]);
  //--- END PANEL STATES ---//
  const addToPanelStack = React.useCallback(
    (newPanel: Panel<any>) => setCurrentPanelStack((stack) => [...stack, newPanel]),
    []
  );
  const removeFromPanelStack = React.useCallback(
    () => setCurrentPanelStack((stack) => stack.slice(0, -1)),
    []
  );

  useEffect(() => {
    setCurrentPanelStack([initialPanel]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textbook._id]);

  return (
    <PanelStack2
      renderActivePanelOnly={true}
      stack={currentPanelStack}
      showPanelHeader={false}
      onOpen={addToPanelStack}
      onClose={removeFromPanelStack}
      className="custom-panel-stack"
    />
  );
}
