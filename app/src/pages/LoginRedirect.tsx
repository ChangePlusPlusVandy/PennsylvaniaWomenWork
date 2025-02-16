import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginRedirect = () => {
  const { loginWithRedirect } = useAuth0();

  const returnPath = window.location.pathname === "/" ? "/home" : window.location.pathname;

  useEffect(() => {
    loginWithRedirect({
      appState: {
        returnTo: returnPath,
      },
    });
  }, [loginWithRedirect, returnPath]);

  return null;
};

export default LoginRedirect;
