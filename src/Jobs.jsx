import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import JobCard from "./JobCard.jsx";
import JoblyApi from "./api";
import UserContext from "./UserContext.js";
import "./Jobs.css";

const Jobs = () => {
  const initialState = {
    title: "",
    minSalary: "",
    hasEquity: "",
  };
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState(initialState);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentSearch, setCurrentSearch] = useState(searchParams);
  const [checked, setChecked] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    async function getJobs() {
      let params = {};
      setSearch(initialState);
      if (searchParams) {
        for (let i of searchParams) {
          params[i[0]] = i[1];
          setSearch((search) => ({ ...search, [i[0]]: i[1] }));
        }
      }
      if (params.hasEquity) {
        setChecked(true);
      } else {
        setChecked(false);
      }

      let jobs = await JoblyApi.searchJob(params);
      setJobs(jobs);
    }
    if (user) {
      getJobs();
    }

    setIsLoading(false);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "hasEquity") {
      handleCheck();
    } else {
      setSearch((data) => ({ ...data, [name]: value }));
    }
  };

  const handleCheck = () => {
    if (!checked) {
      setSearch((data) => ({ ...data, hasEquity: "true" }));
    } else {
      setSearch((data) => ({ ...data, hasEquity: "" }));
    }
    setChecked(!checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let params = {};
    for (let i in search) {
      if (search[i]) {
        params[i] = search[i];
      }
    }
    setSearchParams(params);
    let filteredJobs = await JoblyApi.searchJob(params);
    setJobs(filteredJobs);
  };

  const checkParams = async () => {
    let params = {};
    setSearch(initialState);
    if (searchParams) {
      for (let i of searchParams) {
        params[i[0]] = i[1];
        setSearch((search) => ({ ...search, [i[0]]: i[1] }));
      }
    }
    if (params.hasEquity) {
      setChecked(true);
    } else {
      setChecked(false);
    }
    let jobs = await JoblyApi.searchJob(params);
    setJobs(jobs);
  };

  if (currentSearch !== searchParams) {
    checkParams();
    setCurrentSearch(searchParams);
  }

  if (isLoading) {
    return <p>Loading</p>;
  }

  if (!user) {
    return <h1>Please Log In First!</h1>;
  }

  return (
    <div className="jobs-list">
      <div className="job-search-form">
        <form onSubmit={handleSubmit}>
          <input
            id="title"
            type="search"
            name="title"
            placeholder="Search Job Titles"
            value={search.title}
            onChange={handleChange}
          />
          <input
            id="minSalary"
            type="number"
            name="minSalary"
            placeholder="Minimum Salary ($)"
            value={search.minSalary}
            onChange={handleChange}
          />
          <label htmlFor="hasEquity">Has Equity</label>
          <input
            id="hasEquity"
            type="checkbox"
            name="hasEquity"
            checked={checked}
            onChange={handleChange}
          />
          <button>Search</button>
        </form>
      </div>
      <h1>Jobs</h1>
      <div className="filtered-jobs-list">
        {!jobs.length ? (
          <p>
            <i>No jobs match your search</i>
          </p>
        ) : (
          <ul>
            {jobs.map((job) => {
              return (
                <li key={job.id}>
                  <JobCard job={job} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Jobs;
