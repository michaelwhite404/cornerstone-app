import { useContext } from "react";
import { ToasterContext } from "../context/ToasterContext";

const useToasterContext = () => useContext(ToasterContext);
export default useToasterContext;
