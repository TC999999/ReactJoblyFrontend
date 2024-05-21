import { Link } from "react-router-dom";
import JoblyApi from "./api";
import { useState, useContext } from "react";
import UserContext from "./UserContext";
import "./JobCard.css";

const JobCard = ({ job }) => {
  const { user, updateUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  //Updates user context and local storage if the user applies for a job
  const apply = async (jobId) => {
    setIsLoading(true);
    await JoblyApi.applyUserForJob(user.username, jobId);
    let applications = [...user.applications, jobId];
    updateUser({ ...user, applications });
    setIsLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 2000);
  };

  return (
    <div className="job-card">
      <h3>
        <Link to={`/jobs/${job.id}`}>{job.title}</Link>
      </h3>
      {/**if either salary or equity is empty in db, give a message to user */}
      <p>
        <b>Salary: </b>
        {!job.salary ? "no information on salary provided" : job.salary}
      </p>
      <p>
        <b>Equity: </b>
        {!job.equity ? "no information on equity provided" : job.equity}
      </p>
      {/**
       if we call on all jobs the jobs table from db, we return the company handle
       under "companyHandle"; if we call a single job, we return company handle under
       "company.handle"; this is used so we can use both api calls with a single component
       */}
      {(job.company || job.companyHandle) && (
        <p>
          <b>Company: </b>
          {job.company ? (
            <Link to={`/companies/${job.company.handle}`}>
              {job.company.name}
            </Link>
          ) : (
            <Link to={`/companies/${job.companyHandle}`}>
              {job.companyName}
            </Link>
          )}
        </p>
      )}
      {/**if job is in current user's application list, does not show
       apply button
       */}
      {!user.applications.includes(job.id) && (
        <button onClick={() => apply(job.id)}>Apply for Job</button>
      )}
      {isLoading && <p>Applying...</p>}
      {success && <p>Successfully Applied!</p>}
    </div>
  );
};

export default JobCard;
