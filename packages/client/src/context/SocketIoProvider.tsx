import { createContext, ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../hooks";

export const SocketIoContext = createContext<Socket | undefined>(undefined);
const uri =
  process.env.NODE_ENV === "production"
    ? "https://app.cornerstone-schools.org"
    : "http://127.0.0.1:8080";

export default function SocketIoProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket>();
  const { user } = useAuth();

  useEffect(() => {
    const newSocket = io(uri);
    setSocket(newSocket);
    newSocket.emit("userConnected", user);
  }, [user]);

  return <SocketIoContext.Provider value={socket}>{children}</SocketIoContext.Provider>;
}
