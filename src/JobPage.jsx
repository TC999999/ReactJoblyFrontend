import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import JobCard from "./JobCard.jsx";
import JoblyApi from "./api";
import UserContext from "./UserContext.js";

const JobPage = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState([]);
  const [err, setErr] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getJob() {
      try {
        let job = await JoblyApi.getJobById(id);
        setJob(job);
      } catch (err) {
        setErr(true);
        setMessage(err[0]);
      }
    }
    if (user) {
      getJob();
    }

    setIsLoading(false);
  }, [user]);

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
    <div className="job">
      <JobCard job={job} />
    </div>
  );
};

export default JobPage;
