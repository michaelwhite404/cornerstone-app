import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import { ToasterProvider } from "./context/ToasterContext";
import "./sassy.css";
import AuthProvider from "./context/AuthProvider";
import SocketIoProvider from "./context/SocketIoProvider";
import Routes from "./Routes";
import { queryClient } from "./lib/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
