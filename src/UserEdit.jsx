import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JoblyApi from "./api";
import UserContext from "./UserContext";
import "./UserEdit.css";

const UserEdit = () => {
  const initialState = { firstName: "", lastName: "", email: "" };
  const { username } = useParams();
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [userErr, setUserErr] = useState(false);
  const [subErr, setSubErr] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        let user = await JoblyApi.getUser(username);
        let { firstName, lastName, email } = user;
        setFormData((f) => ({ ...f, firstName, lastName, email }));
      } catch (err) {
        setUserErr(true);
        setMessage(err[0]);
      }
    };
    if (user) {
      getUser();
    }
    setIsLoading(false);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email } = formData;
    try {
      const updatedUser = await JoblyApi.updateUser(user.username, {
        firstName,
        lastName,
        email,
      });
      updateUser({ ...user, ...updatedUser });
      navigate(`/users/${user.username}`);
    } catch (err) {
      setSubErr(true);
      setMessage(err);
    }
  };

  if (isLoading) {
    return <p>Loading</p>;
  }

  if (!user) {
    return <h1>Please Log In First!</h1>;
  }

  if (userErr) {
    return <h1>{message}</h1>;
  }

  return (
    <div className="edit-user-form">
      <h1>Edit {username}'s profile</h1>
      <form onSubmit={handleSubmit}>
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
        <div className="button-div">
          <button>Edit!</button>
        </div>
      </form>
      {subErr && <p>{message}</p>}
    </div>
  );
};

export default UserEdit;
