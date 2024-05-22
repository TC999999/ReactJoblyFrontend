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
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState({});
  const [jobs, setJobs] = useState([]);
  const [err, setErr] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getCompany() {
      try {
        setIsLoading(true);
        let company = await JoblyApi.getCompanyByHandle(handle);
        setCompany(company);
        setJobs(company.jobs);
        setIsLoading(false);
      } catch (err) {
        setErr(true);
        setMessage(err[0]);
        setIsLoading(false);
      }
    }
    if (user) {
      getCompany();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return <p className="loading-message">Loading...</p>;
  }

  //error message (if company handle in URL does not exist)
  if (err) {
    return <h1>{message}</h1>;
  }

  //can only see page if user is logged in
  if (!user) {
    return <h1>Please Log In First!</h1>;
  }

  return (
    <div className="company">
      <CompanyCard company={company} />
      <ul className="company-jobs">
        <h3> Available Jobs</h3>
        {/** We also see the list of all available jobs a company has */}
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
