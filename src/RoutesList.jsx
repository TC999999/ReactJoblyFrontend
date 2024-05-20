import { Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Companies from "./Companies.jsx";
import CompanyPage from "./CompanyPage.jsx";
import Jobs from "./Jobs.jsx";
import JobPage from "./JobPage.jsx";
import Register from "./Register.jsx";
import User from "./User.jsx";
import UserEdit from "./UserEdit.jsx";

const RoutesList = () => {
  return (
    <Routes>
      <Route path="/" exact element={<Home />} />
      <Route path="/companies" exact element={<Companies />} />
      <Route path="/companies/:handle" exact element={<CompanyPage />} />
      <Route path="/jobs" exact element={<Jobs />} />
      <Route path="/jobs/:id" exact element={<JobPage />} />
      <Route path="/register" exact element={<Register />} />
      <Route path="/users/:username" exact element={<User />} />
      <Route path="/users/:username/edit" exact element={<UserEdit />} />
    </Routes>
  );
};

export default RoutesList;
