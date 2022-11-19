import "./App.scss";
import { BrowserRouter as Router } from "react-router-dom";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import { FocusStyleManager } from "@blueprintjs/core";
// import Stats from "./pages/DeviceType/Stats/Stats";
// import DeviceLogs from "./pages/DeviceType/DeviceLogs/DeviceLogs";
// import SingleDevice from "./pages/DeviceType/SingleDevice/SingleDevice";
import { ToasterProvider } from "./context/ToasterContext";
import "./pages/Devices/Devices.sass";
import "./sassy.css";
import AuthProvider from "./context/AuthProvider";
import SocketIoProvider from "./context/SocketIoProvider";
import Routes from "./Routes";

function App() {
  FocusStyleManager.onlyShowFocusOnTabs();

  return (
    <ToasterProvider>
      <Router>
        <AuthProvider>
          <SocketIoProvider>
            <Routes />
          </SocketIoProvider>
        </AuthProvider>
      </Router>
    </ToasterProvider>
  );
}

export default App;
