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

  useEffect(() => {
    async function getToken() {
      currentUser(JSON.parse(localStorage.getItem("jobly-user")));
    }
    getToken();
  }, []);

  //These functions and user state will be used in context
  const logIn = async (username, token) => {
    localStorage.setItem("jobly-token", token);
    let userInfo = await JoblyApi.getUser(username);
    localStorage.setItem("jobly-user", JSON.stringify(userInfo));
    currentUser(userInfo);
  };

  const logOut = () => {
    localStorage.removeItem("jobly-token");
    localStorage.removeItem("jobly-user");
    currentUser(null);
  };

  const updateUser = async (user) => {
    localStorage.setItem("jobly-user", JSON.stringify(user));
    currentUser(user);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider value={{ user, logIn, logOut, updateUser }}>
          <NavBar logOut={logOut} />
          <RoutesList />
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
