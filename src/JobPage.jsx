import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import JobCard from "./JobCard.jsx";
import JoblyApi from "./api";
import UserContext from "./UserContext.js";

const JobPage = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [job, setJob] = useState([]);
  const [err, setErr] = useState(false);
  const [message, setMessage] = useState("");

  //Upon initial render, set job state by job id in url params
  useEffect(() => {
    async function getJob() {
      try {
        setIsLoading(true);
        let job = await JoblyApi.getJobById(id);
        setJob(job);
        setIsLoading(false);
      } catch (err) {
        setErr(true);
        setMessage(err[0]);
        setIsLoading(false);
      }
    }
    if (user) {
      getJob();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return <p className="loading-message">Loading...</p>;
  }

  //error message (if job with id in params does not exist)
  if (err) {
    return <h1>{message}</h1>;
  }

  //can only see page if user is logged in
  if (!user) {
    return <h1>Please Log In First!</h1>;
  }

  return (
    <div className="job">
      <JobCard job={job} />
    </div>
  );
};

export default JobPage;
