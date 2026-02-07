import { useLayoutEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useSocket } from "../../hooks";
import { CurrentSession as SessionNow } from "../../types/aftercareTypes";
import ActiveSession from "./ActiveSession";
import InactiveSession from "./InactiveSession";

interface LionsDenOutletContext {
  currentSession: SessionNow;
  getCurrentSession: () => Promise<void>;
  setCurrentSession: React.Dispatch<React.SetStateAction<SessionNow>>;
}

export default function CurrentSession() {
  const socket = useSocket();
  const { currentSession, getCurrentSession, setCurrentSession } =
    useOutletContext<LionsDenOutletContext>();

  useLayoutEffect(() => {
    socket?.on("aftercareSignOutSuccess", getCurrentSession);
  }, [socket, getCurrentSession]);

  const Session = () =>
    currentSession.session ? (
      <ActiveSession attendance={currentSession.attendance} />
    ) : (
      <InactiveSession setCurrentSession={setCurrentSession} />
    );

  return <Session />;
}
