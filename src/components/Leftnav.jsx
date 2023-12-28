import React, { useState } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import dashboard from "../components/Imgs/daashboard.png";
import exam from "../components/Imgs/exam.png";
import "../components/css/Leftnav.css";
import logo2 from './logo2.jpeg'
import HomeLandingPage from "../Frontend/Pages/HomeLandingPage/HomeLandingPage";

const Leftnav = () => {
  const [showMenu, setshowMenu] = useState(0);
  return (
    <>
      <></>

      <div className="left_nav_bar_container">
        <div
          className={
            showMenu
              ? "mobile_menu mobile_menu_non  "
              : "mobile_menu_non_black "
          }
          onClick={() => setshowMenu(!showMenu)}
        >
          <div className={showMenu ? "rotate_right  " : "lines Line_one"}></div>
          <div className={showMenu ? "rotate_left  " : "lines Line_two "}></div>
        </div>
        <div
          className={showMenu ? "left-nav-bar left-nav-bar_" : "left-nav-bar"}
        >
         
          <ul className="left-nav-bar-ul">
            <li> <img src={logo2} alt="Egrad logo" className='img' /></li>
            <li>
              <Link to="/" className="LeftnavLinks">
                <div className="">
                  {/* <img width={40} src={dashboard} alt="" /> */}
                  <i class="fa-solid fa-database logo_-clr"></i>
                </div>
                <p> Dashboard</p>
              </Link>
            </li>
            <li>
              <Link to="/exams" className="LeftnavLinks">
                <div className="">
                  <i class="fa-solid fa-user-pen logo_-clr"></i>
                </div>
                <p>Exam Creation</p>
              </Link>
            </li>
            <li>
              <Link to="/Coursecreation" className="LeftnavLinks">
                <div className="">
                  {/* <img width={40} src={dashboard} alt="" /> */}
                  <i class="fa-solid fa-pen-nib logo_-clr"></i>
                </div>
                <p> Course Creation</p>
              </Link>
            </li>
            <li>
              <Link to="/InstructionPage" className="LeftnavLinks">
                <div className="">
                  {/* <img width={40} src={dashboard} alt="" /> */}
                  <i class="fa-solid fa-person-chalkboard logo_-clr"></i>
                </div>
                <p> Instruction</p>
              </Link>
            </li>
            <li>
              <Link to="/Testcreation" className="LeftnavLinks">
                <div className="">
                  {/* <img width={40} src={dashboard} alt="" /> */}
                  <i class="fa-solid fa-file-lines logo_-clr"></i>
                </div>
                <p> Test Creation</p>
              </Link>
            </li>
            <li>
              <Link to="/DocumentUpload" className="LeftnavLinks">
                <div className="">
                  {/* <img width={40} src={dashboard} alt="" /> */}
                  <i class="fa-solid fa-folder-open logo_-clr"></i>
                </div>
                <p> Document Upload</p>
              </Link>
            </li>
            <li>
              <Link className="LeftnavLinks" to='/HomeLandingPage'><i class="fa-brands fa-quora"></i><p>Quiz App</p></Link>
            </li>
            <li> <Link className="LeftnavLinks" to='/ReplaceAndUpdate'><i class="fa-solid fa-reply-all"></i><p>Replace and Update</p></Link></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Leftnav;
