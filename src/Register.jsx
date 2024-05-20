import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import "./Register.css";

const Register = () => {
  return (
    <div className="register-forms">
      <Login />
      <Signup />
    </div>
  );
};

export default Register;
