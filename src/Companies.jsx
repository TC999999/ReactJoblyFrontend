import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import CompanyCard from "./CompanyCard.jsx";
import JoblyApi from "./api";
import UserContext from "./UserContext.js";
import "./Companies.css";

const Companies = () => {
  const initialState = {
    name: "",
    minEmployees: "",
    maxEmployees: "",
  };
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState(initialState);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentSearch, setCurrentSearch] = useState(searchParams);
  const { user } = useContext(UserContext);
  const [err, setErr] = useState(false);
  const [message, setMessage] = useState("");

  //on initial render, set the companies based on current search parameters
  //in the URL
  useEffect(() => {
    function getCompanies() {
      try {
        checkParams();
        setErr(false);
        setMessage("");
      } catch (err) {
        setErr(true);
        setMessage(err[0]);
      }
    }

    if (user) {
      getCompanies();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  //change the search data when there's a change in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearch((data) => ({ ...data, [name]: value }));
  };

  //on submitting the search form, any empty search queries
  //are filtered out and sends search parameters to api
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      let params = {};
      for (let i in search) {
        if (search[i]) {
          params[i] = search[i];
        }
      }
      setSearchParams(params);
      let filteredCompanies = await JoblyApi.searchCompany(params);
      setErr(false);
      setMessage("");
      setCompanies(filteredCompanies);
      setIsLoading(false);
    } catch (err) {
      setErr(true);
      setMessage(err[0]);
      setIsLoading(false);
    }
  };

  //this function changes the DOM to only include the companies based on the current
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
    let res = await JoblyApi.searchCompany(params);
    setCompanies(res);
    setIsLoading(false);
  };

  //if the user clicks the back button and changes the search params in the URL,
  //Then the app automatically changes the DOM to only show the companies
  //based on the search parameters
  if (currentSearch !== searchParams) {
    checkParams();
    setCurrentSearch(searchParams);
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  //Can only see the page if user is logged in
  if (!user) {
    return <h1>Please Log In First!</h1>;
  }

  return (
    <div className="companies-list">
      <div className="company-search-form">
        <form onSubmit={handleSubmit}>
          <input
            id="name"
            type="search"
            name="name"
            placeholder="Search Company Names"
            value={search.name}
            onChange={handleChange}
          />
          <input
            id="minEmployees"
            type="number"
            name="minEmployees"
            placeholder="Minimum Employees"
            value={search.minEmployees}
            onChange={handleChange}
          />
          <input
            id="maxEmployees"
            type="number"
            name="maxEmployees"
            placeholder="Maximum Employees"
            value={search.maxEmployees}
            onChange={handleChange}
          />
          <button>Search</button>
        </form>
      </div>
      {/**error message (if minEmployees is greater than maxEmployees) */}
      {err && (
        <p>
          <i>{message}</i>
        </p>
      )}

      <h1>Companies</h1>
      <div className="filtered-companies-list">
        {/**If no companies are in state list and app is not loading, lets the user know */}
        {!companies.length && !isLoading ? (
          <p>
            <i>No companies match your search</i>
          </p>
        ) : (
          <ul>
            {companies.map((company) => {
              return (
                <li key={company.handle}>
                  <CompanyCard company={company} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Companies;
