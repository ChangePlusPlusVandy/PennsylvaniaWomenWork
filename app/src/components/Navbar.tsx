import react, { type ReactElement } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = (): ReactElement => {
  const navigate = useNavigate();
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
              className="Navbar-body-link Margin-right--20"
              onClick={() => {
                navigate("/home");
              }}
            >
              Home
            </div>
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
                navigate("/create-workshop");
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
        </div>
      </div>
    </>
  );
};

export default Navbar;
