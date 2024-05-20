import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import "./Register.css";

const Register = () => {
  //returns both signup and login forms
  return (
    <div className="register-forms">
      <Login />
      <Signup />
    </div>
  );
};

export default Register;
