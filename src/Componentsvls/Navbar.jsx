import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./vls.css";

const Navbar = () => {
  const [isIITJeeOpen, setIITJeeOpen] = useState(false);
  const [isNEETOpen, setNEETOpen] = useState(false);
  const [isBITSATOpen, setBITSATOpen] = useState(false);

  const toggleDropdown = (exam) => {
    switch (exam) {
      case "IIT-JEE":
        setIITJeeOpen(!isIITJeeOpen);
        setNEETOpen(false);
        setBITSATOpen(false);
        break;
      case "NEET":
        setNEETOpen(!isNEETOpen);
        setIITJeeOpen(false);
        setBITSATOpen(false);
        break;
      case "BITSAT":
        setBITSATOpen(!isBITSATOpen);
        setIITJeeOpen(false);
        setNEETOpen(false);
        break;
      default:
        setIITJeeOpen(false);
        setNEETOpen(false);
        setBITSATOpen(false);
        break;
    }
  };

  return (
    <div>
      <div className="dropdown">
        <button onClick={() => toggleDropdown("IIT-JEE")}>IIT-JEE</button>
        {isIITJeeOpen && (
          <div className="dropdown-content">
            <li>
              <Link to="/Topic">Math</Link>
            </li>
            <li>
              <Link to="/Physics">Physics</Link>
            </li>
            <li>
              <Link to="/Chemistry">Chemistry</Link>
            </li>
          </div>
        )}

        <button onClick={() => toggleDropdown("NEET")}>NEET</button>
        {isNEETOpen && (
          <div className="dropdown-content">
            <li>
              <Link to="/Topic">Biology</Link>
            </li>
            <li>
              <Link to="/Physics">Physics</Link>
            </li>
            <li>
              <Link to="/Chemistry">Chemistry</Link>
            </li>
          </div>
        )}

        <button onClick={() => toggleDropdown("BITSAT")}>BITSAT</button>
        {isBITSATOpen && (
          <div className="dropdown-content">
            <li>
              <Link to="/Math">Math</Link>
            </li>
            <li>
              <Link to="/Physics">Physics</Link>
            </li>
            <li>
              <Link to="/Chemistry">Chemistry</Link>
            </li>
            <li>
              <Link to="/English">English</Link>
            </li>
            <li>
              <Link to="/LogicalReasoning">Logical Reasoning</Link>
            </li>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
