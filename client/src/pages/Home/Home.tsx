import { InputGroup, Label } from "@blueprintjs/core";
import { useState } from "react";
import { EmployeeModel } from "../../../../src/types/models/employeeTypes";
import CornerstoneLogo from "../../components/CornerstoneLogo";
import Login from "../../components/Login";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import TextOverLine from "../../components/TextOverLine";
import { useDocTitle } from "../../hooks";
import "./Home.sass";

export default function Home({
  setIsAuthenticated,
  setUser,
}: {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<EmployeeModel | null>>;
}) {
  useDocTitle("Login Page | Cornerstone App");
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="home-container">
        <div className="login-main">
          <div className="welcome-section">
            <CornerstoneLogo style={{ width: 50 }} />
            <h1 style={{ fontWeight: 600, margin: "5px 0" }}>Welcome Back</h1>
            <p>Sign into your account</p>
          </div>
          <div>
            <Label>
              <span style={{ fontWeight: 500 }}>Sign in with Cornestone Gmail Account</span>
            </Label>
            <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
          </div>
          <span style={{ padding: "1rem 0" }}>
            <TextOverLine text="Or continue with" />
          </span>
          <div className="sign-in-form">
            <div style={{ padding: "5px 0" }}>
              <Label>
                <span style={{ fontWeight: 500 }}>Email Address</span>
                <InputGroup fill value={credentials.email} onChange={handleChange} name="email" />
              </Label>
            </div>
            <div style={{ padding: "5px 0" }}>
              <Label>
                <span style={{ fontWeight: 500 }}>Password</span>
                <InputGroup
                  fill
                  value={credentials.password}
                  onChange={handleChange}
                  name="password"
                  type="password"
                />
              </Label>
            </div>
            <PrimaryButton text="Sign In" />
          </div>
        </div>
        <div className="login-image-banner" style={{ backgroundImage: "url(Lions+Den_18.jpeg)" }} />
      </div>
    </div>
  );
}
