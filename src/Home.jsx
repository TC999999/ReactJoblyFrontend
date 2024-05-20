import { useContext } from "react";
import UserContext from "./UserContext";
import "./Home.css";

const Home = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="home-div">
      <h1>Welcome to Jobly!</h1>
      {!user && <h2>Please log in for full experience!</h2>}
      {user && (
        <div>
          <h2>Welcome {user.username}!</h2>
          <h3>Search for Companies You're Interested In!</h3>
          <h3>Search and Apply for Jobs You're Interested In!</h3>
        </div>
      )}
    </div>
  );
};
export default Home;
