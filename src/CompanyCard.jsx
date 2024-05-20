import { Link } from "react-router-dom";
import "./CompanyCard.css";

const CompanyCard = ({ company }) => {
  return (
    <div className="company-card">
      <h3>
        {" "}
        <Link to={`/companies/${company.handle}`}>{company.name}</Link>
      </h3>
      <p>
        <b>Description:</b> {company.description}
      </p>
      <p>
        <b>Number of Employees:</b> {company.numEmployees}
      </p>
    </div>
  );
};

export default CompanyCard;
