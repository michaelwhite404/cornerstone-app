import { useGoogleLogin } from "@react-oauth/google";
import { useAuth, useToasterContext } from "../hooks";

export default function Login() {
  const { showToaster } = useToasterContext();
  const { loginFromGoogle } = useAuth();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      loginFromGoogle(tokenResponse.access_token)
        .then((employee) => employee && showToaster("Log in successful!", "success"))
        .catch((err) => showToaster(err.message, "danger"));
    },
    onError: (error) => {
      console.error("Google login error:", error);
      showToaster("Google login failed", "danger");
    },
  });

  return (
    <button
      onClick={() => login()}
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
}
