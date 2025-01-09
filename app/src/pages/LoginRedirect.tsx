import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginRedirect = () => {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    loginWithRedirect({
      appState: {
        returnTo: "/home",
      },
    });
  }, [loginWithRedirect]);

  return null;
};

export default LoginRedirect;
