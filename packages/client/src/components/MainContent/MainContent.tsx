import { ReactNode } from "react";
import MainContentFooter from "./MainContentFooter";
import MainContentHeader from "./MainContentHeader";
import MainContentInnerWrapper from "./MainContentInnerWrapper";

function MainContent({ children }: { children?: ReactNode }) {
  return <main className="flex-grow overflow-auto bg-white">{children}</main>;
}

MainContent.InnerWrapper = MainContentInnerWrapper;
MainContent.Header = MainContentHeader;
MainContent.Footer = MainContentFooter;

export default MainContent;
