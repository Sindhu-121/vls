import React, { useState, useEffect } from "react";
import "../components/css/Dashboard.css";
// Custom hook for fetching data\
import TotalExam from "./Imgs/TotalExam.png";

const useFetchCount = (url) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Assuming data is an array and the count is in the first object
        const firstObject = data[0];
        const totalCount = firstObject ? firstObject.count : 0;

        console.log("Data received:", totalCount);
        setCount(totalCount);
      })
      .catch((error) =>
        console.error(`Error fetching count from ${url}:`, error.message)
      );
  }, [url]);

  return count;
};

const Dashboard = () => {
  const examCount = useFetchCount("http://localhost:3081/exam/count");
  const courseCount = useFetchCount("http://localhost:3081/courses/count");
  const testCount = useFetchCount("http://localhost:3081/test/count");
  const questionCount = useFetchCount("http://localhost:3081/question/count");

  return (
    
    <div className="Dashboard_container">
      {/* <h1>Dashboard</h1> */}
  <h1 className="textColor">Dashboard</h1>
      <div style={{display:'flex',flexDirection:'column'}}>
       
      <div style={{display:'flex',gap:'1rem'}}>
      <div className="Dashboard_contant">
        <i  className="fa-solid fa-user-pen"></i>
        {/* <img width={150} src={TotalExam} alt="" /> */}
        <h2>Total Exams </h2>
        <h2 className="examCount"> {examCount}</h2>
      </div>
      <div className="Dashboard_contant">
        <i className="fa-solid fa-pen-nib"></i>
        <h2>Total Courses</h2>
        <h2> {courseCount}</h2>
      </div>
      <div className="Dashboard_contant">
        <i className="fa-solid fa-person-chalkboard"></i>
        <h2>Total Tests</h2>
        <h2 className="examCount"> {testCount}</h2>
      </div>
      <div className="Dashboard_contant">
        <i className="fa-solid fa-file-lines"></i>
        <h2>Total Questions </h2>
        <h2 className="examCount">{questionCount}</h2>
      </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
