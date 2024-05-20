import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import CompanyCard from "./CompanyCard.jsx";
import JoblyApi from "./api.js";
import UserContext from "./UserContext.js";
import JobCard from "./JobCard.jsx";
import "./CompanyPage.css";

const CompanyPage = () => {
  const { handle } = useParams();
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [company, setCompany] = useState({});
  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getCompany() {
      try {
        let company = await JoblyApi.getCompanyByHandle(handle);
        setCompany(company);
        setJobs(company.jobs);
      } catch (err) {
        setErr(true);
        setMessage(err[0]);
      }
    }
    if (user) {
      getCompany();
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
    <div className="company">
      <CompanyCard company={company} />
      <ul className="company-jobs">
        <h3> Available Jobs</h3>
        <div className="available-jobs">
          {jobs.map((job) => {
            return (
              <li key={job.id}>
                <JobCard job={job} />
              </li>
            );
          })}
        </div>
      </ul>
    </div>
  );
};

export default CompanyPage;