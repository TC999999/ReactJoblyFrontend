import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "./UserContext";
import "./Navbar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logOut } = useContext(UserContext);
  const logOutAndNavigate = () => {
    logOut();
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/">Home</Link>
      <Link to="/companies">Companies</Link>
      <Link to="/jobs">Jobs</Link>
      {!user ? (
        <Link to="/register"> Sign Up/Login</Link>
      ) : (
        <span>
          <Link to={`/users/${user.username}`}>{user.username}</Link>
          <button onClick={logOutAndNavigate}>Log Out</button>
        </span>
      )}
    </div>
  );
};

export default NavBar;
