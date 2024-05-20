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

  useEffect(() => {
    async function getCompanies() {
      try {
        let params = {};
        setSearch(initialState);
        if (searchParams) {
          for (let i of searchParams) {
            params[i[0]] = i[1];
            setSearch((search) => ({ ...search, [i[0]]: i[1] }));
          }
        }

        let companies = await JoblyApi.searchCompany(params);
        setErr(false);
        setMessage("");
        setCompanies(companies);
      } catch (err) {
        setErr(true);
        setMessage(err[0]);
      }
    }
    if (user) {
      getCompanies();
    }
    setIsLoading(false);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearch((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
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
    } catch (err) {
      setErr(true);
      setMessage(err[0]);
    }
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
    let companies = await JoblyApi.searchCompany(params);
    setCompanies(companies);
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
      {err && (
        <p>
          <i>{message}</i>
        </p>
      )}

      <h1>Companies</h1>
      <div className="filtered-companies-list">
        {!companies.length ? (
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
