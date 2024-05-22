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
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState(initialState);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentSearch, setCurrentSearch] = useState(searchParams);
  const [checked, setChecked] = useState(false);
  const { user } = useContext(UserContext);

  //on initial render, set jobs state based on current search params
  useEffect(() => {
    function getJobs() {
      setIsLoading(true);
      checkParams();
    }
    if (user) {
      getJobs();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  //changes search state based on user input (changes hasEquity
  //based on if it's checked or not)
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "hasEquity") {
      handleCheck();
    } else {
      setSearch((data) => ({ ...data, [name]: value }));
    }
  };

  //sets hasEquity value in search state to true if checkec state is true
  //and vice versa
  const handleCheck = () => {
    if (!checked) {
      setSearch((data) => ({ ...data, hasEquity: "true" }));
    } else {
      setSearch((data) => ({ ...data, hasEquity: "" }));
    }
    setChecked(!checked);
  };

  //on submitting the search form, any empty search queries
  //are filtered out and sends search parameters to api
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let params = {};
    for (let i in search) {
      if (search[i]) {
        params[i] = search[i];
      }
    }
    setSearchParams(params);
    let filteredJobs = await JoblyApi.searchJob(params);
    setJobs(filteredJobs);
    setIsLoading(false);
  };

  //this function changes the DOM to only include the jobs based on the current
  //URL search queries
  const checkParams = async () => {
    let params = {};
    setSearch(initialState);
    if (searchParams.size) {
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
    let res = await JoblyApi.searchJob(params);
    setJobs(res);
    setIsLoading(false);
  };

  //if the user clicks the back button and changes the search params in the URL,
  //Then the app automatically changes the DOM to only show the jobs
  //based on the search parameters
  if (currentSearch !== searchParams) {
    setIsLoading(true);
    checkParams();
    setCurrentSearch(searchParams);
    setIsLoading(false);
  }

  if (isLoading) {
    return <p className="loading-message">Loading...</p>;
  }

  //Can only see the page if user is logged in
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
        {/**If no jobs are in state list and the app is not loading, lets the user know */}
        {!jobs.length && !isLoading ? (
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
