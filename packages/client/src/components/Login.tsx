import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import { useAuth, useToasterContext } from "../hooks";

export default function Login() {
  const { showToaster } = useToasterContext();
  const { loginFromGoogle } = useAuth();
  const handleLogin = async (
    googleData: GoogleLoginResponse | GoogleLoginResponseOffline
  ): Promise<void> => {
    loginFromGoogle(googleData)
      .then((employee) => employee && showToaster("Log in successful!", "success"))
      .catch((err) => showToaster(err.message, "danger"));
  };

  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}
      buttonText="Log in with Google"
      render={CustomButton}
      onSuccess={handleLogin}
      onFailure={handleLogin}
      cookiePolicy={"single_host_origin"}
    />
  );
}

const CustomButton = (props: { onClick: () => void; disabled?: boolean }) => (
  <button
    onClick={props.onClick}
    disabled={props.disabled}
    style={{
      backgroundColor: "white",
      outline: "none",
      border: "none",
      boxShadow: "#898989 0px 0px 3px 0px",
      padding: "0.625rem 1rem",
      borderRadius: 5,
      cursor: "pointer",
      width: "100%",
    }}
  >
    <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img src="google_icon_gray.png" alt="Google Logo" style={{ width: 20, marginRight: 15 }} />
      <span style={{ color: "#999999", fontWeight: 500 }}>Sign in with Google</span>
    </span>
  </button>
);
