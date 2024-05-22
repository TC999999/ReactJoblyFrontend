import RoutesList from "./RoutesList.jsx";
import NavBar from "./Navbar.jsx";
import { useState, useEffect } from "react";
import UserContext from "./UserContext.js";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import JoblyApi from "./api.js";

function App() {
  const [user, setUser] = useState(null);

  //sets context for user for entire app
  const currentUser = (user) => {
    setUser(user);
  };

  //On initial render, get user information from local storage and set as context
  useEffect(() => {
    async function getToken() {
      currentUser(JSON.parse(localStorage.getItem("jobly-user")));
    }
    getToken();
  }, []);

  //These functions and user state will be used in context
  //Set the token and current user in local storage, also set the user as context on login
  const logIn = async (username, token) => {
    localStorage.setItem("jobly-token", token);
    let userInfo = await JoblyApi.getUser(username);
    localStorage.setItem("jobly-user", JSON.stringify(userInfo));
    currentUser(userInfo);
  };

  //remove token and user from local storage and set user context to null on logout
  const logOut = () => {
    localStorage.removeItem("jobly-token");
    localStorage.removeItem("jobly-user");
    currentUser(null);
  };

  //update current user in local storage and context (for applications and profile edits)
  const updateUser = (user) => {
    localStorage.setItem("jobly-user", JSON.stringify(user));
  };

  const getApplications = () => {
    let user = JSON.parse(localStorage.getItem("jobly-user"));
    let apps = user.applications;
    return apps;
  };

  return (
    <div className="App">
      <BrowserRouter>
        {/**have the whole app use user context */}
        <UserContext.Provider
          value={{ user, logIn, logOut, updateUser, getApplications }}
        >
          <NavBar logOut={logOut} />
          <RoutesList />
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
