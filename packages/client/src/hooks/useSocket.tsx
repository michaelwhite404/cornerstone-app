import { useContext, useDebugValue } from "react";
import { SocketIoContext } from "../context/SocketIoProvider";

const useSocketIo = () => {
  const socketIoContext = useContext(SocketIoContext);
  useDebugValue(socketIoContext?.id);
  return socketIoContext;
};
export default useSocketIo;
