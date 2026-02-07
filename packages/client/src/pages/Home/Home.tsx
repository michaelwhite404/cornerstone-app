import { Label } from "../../components/ui";
import { useState } from "react";
import Div100vh from "react-div-100vh";
import CornerstoneLogo from "../../components/CornerstoneLogo";
import Login from "../../components/Login";
import LabeledInput2 from "../../components/LabeledInput2";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import TextOverLine from "../../components/TextOverLine";
import { useAuth, useDocTitle, useToasterContext } from "../../hooks";


export default function Home() {
  useDocTitle("Login Page | Cornerstone App");
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { showToaster } = useToasterContext();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(credentials.email, credentials.password)
      .then(() => showToaster("Log in successful!", "success"))
      .catch((err) => showToaster(err.message, "danger"));
  };

  return (
    <div>
      <Div100vh className="flex w-screen">
        <div className="w-[35%] flex flex-col justify-center relative py-[25px] px-10 overflow-scroll max-[991px]:w-[45%] max-[767px]:w-[55%] max-[640px]:block max-[640px]:w-full">
          <div className="mb-[30px]">
            <CornerstoneLogo style={{ width: 50 }} />
            <h1 style={{ fontWeight: 600, margin: "5px 0" }}>Welcome Back!!</h1>
            <p>Sign into your account</p>
          </div>
          <div>
            <Label>
              <span style={{ fontWeight: 500 }}>Sign in with Cornerstone Gmail Account</span>
            </Label>
            <Login />
          </div>
          <span style={{ padding: "1rem 0" }}>
            <TextOverLine text="Or continue with" />
          </span>
          <div className="sign-in-form">
            <form onSubmit={handleSubmit}>
              <div className="mb-4 pb-1.5">
                <LabeledInput2
                  label="Email Address"
                  value={credentials.email}
                  onChange={handleChange}
                  name="email"
                  type="email"
                  required
                />
              </div>
              <div className="mb-4 pb-1.5">
                <LabeledInput2
                  label="Password"
                  value={credentials.password}
                  onChange={handleChange}
                  name="password"
                  type="password"
                  required
                />
              </div>
              <PrimaryButton text="Sign In" type="submit" fill />
            </form>
          </div>
          <span className="absolute text-[10px] bottom-2 mx-auto left-0 right-0 text-center font-[cursive]">Love. Integrity. Opportunity. Nobilty. Strength.</span>
        </div>
        <div
          className="w-[65%] h-full bg-center contrast-50 max-[991px]:w-[55%] max-[767px]:w-[45%] max-[640px]:hidden"
          style={{ backgroundImage: "url(/Lions+Den_18.jpeg)" }}
        />
      </Div100vh>
    </div>
  );
}
