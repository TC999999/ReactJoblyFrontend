import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JoblyApi from "./api";
import UserContext from "./UserContext";
import "./UserEdit.css";

const UserEdit = () => {
  const initialState = { firstName: "", lastName: "", email: "" };
  const { username } = useParams();
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [userErr, setUserErr] = useState(false);
  const [subErr, setSubErr] = useState(false);
  const [message, setMessage] = useState("");

  //on initial render, sets edit form input values based on user in
  //url params
  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoading(true);
        let res = await JoblyApi.getUser(username);
        let { firstName, lastName, email } = res;
        setFormData((f) => ({ ...f, firstName, lastName, email }));
        setIsLoading(false);
      } catch (err) {
        setUserErr(true);
        setMessage(err[0]);
        setIsLoading(false);
      }
    };
    if (user) {
      getUser();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  //changes form data state based on change in user input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  //on submit, updates user information in db as well as localstorage
  //and context and redirects back to user page
  //If there's an error, let the user know
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    const { firstName, lastName, email } = formData;
    try {
      const updatedUser = await JoblyApi.updateUser(user.username, {
        firstName,
        lastName,
        email,
      });
      updateUser({ ...user, ...updatedUser });
      setEditLoading(false);
      navigate(`/users/${user.username}`);
    } catch (err) {
      setSubErr(true);
      setMessage(err);
      setEditLoading(false);
    }
  };

  if (isLoading) {
    return <p className="loading-message">Loading...</p>;
  }

  //Can only see the page if user is logged in
  if (!user) {
    return <h1>Please Log In First!</h1>;
  }

  //if incorrect user, shows a message
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
        {/**takes away edit button when pressed */}
        {!editLoading && (
          <div className="button-div">
            <button>Edit!</button>
          </div>
        )}
      </form>
      {editLoading && <p>Editing...</p>}
      {/**if input error, let's user know */}
      {subErr && <p>{message}</p>}
    </div>
  );
};

export default UserEdit;
