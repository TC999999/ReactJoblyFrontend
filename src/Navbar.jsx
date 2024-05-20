import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "./UserContext";
import "./Navbar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logOut } = useContext(UserContext);

  //When the logout button is clicked, removes user from context and local storage
  //and removes token from local storage
  const logOutAndNavigate = () => {
    logOut();
    navigate("/");
  };

  //if user is not logged in, only show sign-up link in navbar
  if (!user) {
    return (
      <div className="navbar">
        <Link to="/">Home</Link>
        <Link to="/register"> Sign Up/Login</Link>
      </div>
    );
  }

  //if user is logged in, show company and job listings, a link to own profile
  //page, and a button to logout
  return (
    <div className="navbar">
      <Link to="/">Home</Link>
      <Link to="/companies">Companies</Link>
      <Link to="/jobs">Jobs</Link>
      <span>
        <Link to={`/users/${user.username}`}>{user.username}</Link>
        <button onClick={logOutAndNavigate}>Log Out</button>
      </span>
    </div>
  );
};

export default NavBar;
