import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import { ToasterProvider } from "./context/ToasterContext";
import "./sassy.css";
import AuthProvider from "./context/AuthProvider";
import SocketIoProvider from "./context/SocketIoProvider";
import Routes from "./Routes";

function App() {
  return (
    <ToasterProvider>
      <Toaster position="top-right" richColors />
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
