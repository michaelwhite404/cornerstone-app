import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import { useNavigate, useLocation } from "react-router-dom";
import { EmployeeModel } from "../../../src/types/models/employeeTypes";
import Home from "../pages/Home/Home";

interface AuthContextType {
  user: EmployeeModel | null;
  setUser: React.Dispatch<React.SetStateAction<EmployeeModel | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  logout: (callback?: VoidFunction) => Promise<void>;
  login: (email: string, password: string) => Promise<EmployeeModel>;
  loginFromGoogle: (
    googleData: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => Promise<EmployeeModel | undefined>;
  authLoaded: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<EmployeeModel | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchMe();

    async function fetchMe() {
      axios
        .get("/api/v2/users/me")
        .then((res) => {
          setUser(res.data.data.user);
          setIsAuthenticated(true);
        })
        .catch(() => navigate("/", { replace: true, state: { afterLogin: location.pathname } }))
        .finally(() => setAuthLoaded(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAuthSuccess = () => {
    setTimeout(() => {
      setIsAuthenticated(true);
      if ((location.state as any)?.afterLogin) {
        navigate((location.state as any)?.afterLogin, { replace: true });
      }
    }, 1250);
  };

  const logout = async (callback?: VoidFunction) => {
    try {
      await axios.post<{ status: "success" }>("/api/v2/users/logout");
      setTimeout(() => {
        setIsAuthenticated(false);
        navigate("/");
      }, 1250);
      callback && callback();
    } catch (err) {
      throw Error("There was an error. Please try again");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post("/api/v2/users/login", { email, password });
      setUser(res.data.data.employee);
      handleAuthSuccess();
      return res.data.data.employee as EmployeeModel;
    } catch (err) {
      throw Error(err.response.data.message as string);
    }
  };

  const loginFromGoogle = async (googleData: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    const data = googleData as GoogleLoginResponse;
    // @ts-ignore
    if (data.error === "popup_closed_by_user") return;
    try {
      const res = await axios.post("/api/v2/users/google", { token: data.tokenId });
      setUser(res.data.data.employee);
      handleAuthSuccess();
      return res.data.data.employee as EmployeeModel;
    } catch (err) {
      throw Error(err.response.data.message as string);
    }
  };

  const value = {
    user,
    isAuthenticated,
    setIsAuthenticated,
    logout,
    login,
    setUser,
    loginFromGoogle,
    authLoaded,
  };

  return (
    <AuthContext.Provider value={value}>
      {authLoaded && (isAuthenticated ? children : <Home />)}
    </AuthContext.Provider>
  );
}
