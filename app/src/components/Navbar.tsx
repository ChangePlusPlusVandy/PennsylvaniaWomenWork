import react, { type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { LoginButton } from "./mock-login-button";
import { SignupButton } from "./mock-sign-up";
import { LogoutButton } from "./mock-logout-button";
import { useAuth0 } from "@auth0/auth0-react";
import Icon from '../components/Icon';
import logo from "../assets/logo.png";


const Navbar = (): ReactElement => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  return (
    <>
      <div className="Navbar">
      <div className="Navbar-block Width--100 Height--40">
        <div className="Navbar-body">
          <div className="Flex-row Margin-left--60 Margin-top--20 Margin-bottom--20" style={{ alignItems: 'center' }}>
            <div className = "Logo">
              <img className = "Image-navbar " src={logo}></img>
            </div>
            <div className = "Flex-row" style={{ marginLeft: 'auto', marginRight: '60px', alignItems: 'center'}}>
            <div
            className = "Button--borderless Text-color--gray-800"
              onClick={() => {
                navigate("/home");
              }}>
              <Icon glyph="home" size="xl" />
            </div>
            <div
              className="Navbar-body-link Margin-left--20 Text-color--gray-800"
              onClick={() => {
                navigate("/mentor");
              }}
            >
              Mentor
            </div>
            <div
              className="Navbar-body-link Margin-left--20 Text-color--gray-800"
              onClick={() => {
                navigate("/mentee");
              }}
            >
              Mentee
            </div>
            <div
              className="Navbar-body-link Margin-left--20 Text-color--gray-800"
              onClick={() => {
                navigate("/create-workshop");
              }}
            >
              Create Workshop
            </div>
            <div
              className="Navbar-body-link Margin-left--20 Text-color--gray-800"
              onClick={() => {
                navigate("/create-meeting");
              }}
            >
              Create Meeting
            </div>

            <div
              className="Navbar-body-link Margin-left--20 Text-color--gray-800"
              
            >
              <Icon glyph="grip-lines-vertical" size="xl" />
            </div>
          
          <div className="buttons Margin-left--20" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
            </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
