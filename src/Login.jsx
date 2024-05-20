import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import JoblyApi from "./api";
import UserContext from "./UserContext";
import "./Login.css";

const Login = () => {
  const initialState = {
    username: "",
    password: "",
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
    const { username, password } = formData;
    try {
      const token = await JoblyApi.logIn({
        username,
        password,
      });
      logIn(username, token);
      setFormData(initialState);
      navigate("/");
    } catch (err) {
      setErr(true);
      setMessage(err);
    }
  };

  return (
    <div className="login-form">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className="username-div">
          <label htmlFor="username">Username: </label>
          <input
            id="login-username"
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
            id="login-password"
            type="password"
            name="password"
            placeholder="type your password here"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="button-div">
          <button>Log In!</button>
        </div>
      </form>
      {/**error message (if invalid username/password) */}
      {err && <p>{message}</p>}
    </div>
  );
};

export default Login;
