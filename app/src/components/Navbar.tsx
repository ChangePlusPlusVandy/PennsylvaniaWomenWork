import react, { type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { LoginButton } from "./mock-login-button";
import { SignupButton } from "./mock-sign-up";
import { LogoutButton } from "./mock-logout-button";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = (): ReactElement => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  return (
    <>
      <div className="Navbar">
        <div className="Navbar-body">
          <div
            onClick={() => {
              navigate("/home");
            }}
            className="Navbar-body-logo"
          ></div>
          <div className="Flex-row Margin-left--auto">
            <div
              onClick={() => {
                navigate("/home");
              }}
              className="Navbar-body-home"
            ></div>
            <div
              className="Navbar-body-link"
              onClick={() => {
                navigate("/mentor");
              }}
            >
              Mentor
            </div>
            <div
              className="Navbar-body-link Margin-left--20"
              onClick={() => {
                navigate("/mentee")
              }}
            >
              Mentee
            </div>
            <div
              className="Navbar-body-link Margin-left--20"
              onClick={() => {
                navigate("/create-workshop")
              }}
            >
              Create Workshop
            </div>
            <div
              className="Navbar-body-link Margin-left--20"
              onClick={() => {
                navigate("/create-meeting");
              }}
            >
              Create Meeting
            </div>
          </div>
          <div className="Flex-row">
            {!isAuthenticated && (
              <>
                <LoginButton />
                <SignupButton />
              </>
            )}
            {isAuthenticated && <LogoutButton />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
