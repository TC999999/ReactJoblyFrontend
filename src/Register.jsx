import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import { useState } from "react";
import "./Register.css";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  //returns both signup and login forms

  return (
    <div className="register-forms">
      <Login isLoading={isLoading} setIsLoading={setIsLoading} />
      <Signup isLoading={isLoading} setIsLoading={setIsLoading} />
    </div>
  );
};

export default Register;
