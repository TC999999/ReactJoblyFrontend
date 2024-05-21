import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import JoblyApi from "./api";
import UserContext from "./UserContext";
import "./Signup.css";

const Signup = ({ isLoading, setIsLoading }) => {
  const initialState = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  };
  const { logIn } = useContext(UserContext);
  const navigate = useNavigate();
  const [err, setErr] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(initialState);

  //changes form data state based on change in user input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  //on submit, returns user token and sets that and user information
  //into localstorage and context
  //If there's an error, let the user know
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { username, password, firstName, lastName, email } = formData;
    try {
      const token = await JoblyApi.signUp({
        username,
        password,
        firstName,
        lastName,
        email,
      });

      logIn(username, token);
      setFormData(initialState);
      navigate("/");
    } catch (err) {
      setErr(true);
      setMessage(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-form">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="username-div">
          <label htmlFor="username">Username: </label>
          <input
            id="signup-username"
            type="text"
            name="username"
            placeholder="type your username here"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="password-div">
          <label htmlFor="password">Password: </label>
          <input
            id="signup-password"
            type="password"
            name="password"
            placeholder="type your password here"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="firstName-div">
          <label htmlFor="firstName">First Name: </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            placeholder="type your first name here"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="lastName-div">
          <label htmlFor="lastName">Last Name: </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            placeholder="type your last name here"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="email-div">
          <label htmlFor="email">Email: </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="type your email here"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {!isLoading ? (
          <div className="button-div">
            <button>Sign Up!</button>
          </div>
        ) : (
          <div>
            <p>Loading...</p>
          </div>
        )}
      </form>
      {err && <p>{message}</p>}
    </div>
  );
};

export default Signup;
