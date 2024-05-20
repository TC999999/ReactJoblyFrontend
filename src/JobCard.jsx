import { Link } from "react-router-dom";
import JoblyApi from "./api";
import { useContext } from "react";
import UserContext from "./UserContext";
import "./JobCard.css";

const JobCard = ({ job }) => {
  const { user, updateUser } = useContext(UserContext);

  const apply = async (jobId) => {
    await JoblyApi.applyUserForJob(user.username, jobId);
    let applications = [...user.applications, jobId];
    updateUser({ ...user, applications });
  };

  return (
    <div className="job-card">
      <h3>
        <Link to={`/jobs/${job.id}`}>{job.title}</Link>
      </h3>
      <p>
        <b>Salary: </b>
        {!job.salary ? "no information on salary provided" : job.salary}
      </p>
      <p>
        <b>Equity: </b>
        {!job.equity ? "no information on equity provided" : job.equity}
      </p>
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
      {!user.applications.includes(job.id) && (
        <button onClick={() => apply(job.id)}>Apply for Job</button>
      )}
    </div>
  );
};

export default JobCard;
