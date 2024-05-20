import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import UserContext from "./UserContext";
import JoblyApi from "./api";
import JobCard from "./JobCard.jsx";
import "./User.css";

const User = () => {
  const [userInfo, setUserInfo] = useState("");
  const { username } = useParams();
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [err, setErr] = useState(false);
  const [message, setMessage] = useState("");
  const [currPage, setCurrPage] = useState(username);

  async function getUser() {
    try {
      let user = await JoblyApi.getUser(username);
      let allJobs = await JoblyApi.getAllJobs();
      let applications = allJobs.filter((job) => {
        if (user.applications.includes(job.id)) {
          return job;
        }
      });
      setUserInfo(user);
      setApplications(applications);
    } catch (err) {
      setErr(true);
      setMessage(err[0]);
    }
  }

  useEffect(() => {
    if (user) {
      getUser();
    }
    setIsLoading(false);
  }, [user]);

  if (username !== currPage) {
    getUser();
    setCurrPage(username);
    setErr(false);
    setMessage("");
  }

  if (isLoading) {
    return <p>Loading</p>;
  }

  if (err) {
    return <h1>{message}</h1>;
  }

  if (!user) {
    return <h1>Please Log In First!</h1>;
  }

  return (
    <div className="user-page">
      <div className="user-info">
        <h1>{userInfo.username}</h1>
        <ul>
          <li>
            <b>First Name:</b> {userInfo.firstName}
          </li>
          <li>
            <b>Last Name:</b> {userInfo.lastName}
          </li>
          <li>
            <b>Email Address:</b> {userInfo.email}
          </li>
          <li>
            <b>Status:</b> {userInfo.admin ? "Admin" : "User"}
          </li>
        </ul>
        <Link to={`/users/${userInfo.username}/edit`}>Edit Your Profile</Link>
      </div>

      <h3>Applications</h3>
      <div className="user-applications">
        <ul>
          {applications.map((app) => {
            return (
              <li key={app.id}>
                <JobCard job={app} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default User;
