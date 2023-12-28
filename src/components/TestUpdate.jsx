import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";

const TestUpdate = () => {
  const { testCreationTableId } = useParams();
  const [courses, setCourses] = useState([]);
  const [typeOfTests, setTypeOfTests] = useState([]);
  const [instructionsData, setInstructionsData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  // const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [testData, setTestData] = useState({
    TestName: "",
    selectedCourse: "",
    selectedTypeOfTest: "",
    testStartDate: "",
    testEndDate: "",
    testStartTime: "",
    testEndTime: "",
    Duration: "",
    TotalQuestions: "",
    totalMarks: "",
    calculator: "No",
    status: "Inactive",
    sectionName: "",
    noOfQuestions: "",
    QuestionLimit: "",
    selectedInstruction: "",
    selectedSubjects: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const updatedValue = type === "number" ? parseFloat(value) : value;

    setTestData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
  };
  function formatTime(dateTimeString) {
    if (dateTimeString === "Invalid Time") {
      return "00:00"; // or any other default time you prefer
    }

    const formattedTime = moment(dateTimeString, "HH:mm:ss.SSSSSS").format(
      "HH:mm:ss"
    );
    return formattedTime !== "Invalid date" ? formattedTime : "Invalid Time";
  }

  // const formatDate = (dateString) => {
  //   if (!dateString) {
  //     return '';
  //   }
  //   const date = new Date(dateString);
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');

  //   return `${year}-${month}-${day}`;
  // };

  useEffect(() => {
    fetch("http://localhost:3081/instructions")
      .then((response) => response.json())
      .then((data) => setInstructionsData(data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  useEffect(() => {
    // Fetch courses from the API
    fetch("http://localhost:3081/testcourses")
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  useEffect(() => {
    // Fetch type of tests from the API based on the selected course
    if (testData.selectedCourse) {
      fetch(
        `http://localhost:3081/course-typeoftests/${testData.selectedCourse}`
      )
        .then((response) => response.json())
        .then((data) => setTypeOfTests(data))
        .catch((error) =>
          console.error("Error fetching type of tests:", error)
        );
    }
  }, [testData.selectedCourse]);

  useEffect(() => {
    // Fetch subjects based on the selected course
    if (testData.selectedCourse) {
      console.log("Fetching subjects...");
      fetch(`http://localhost:3081/course-subjects/${testData.selectedCourse}`)
        .then((response) => response.json())
        .then((data) => setSubjects(data))
        .catch((error) => console.error("Error fetching subjects:", error));
    }
  }, [testData.selectedCourse]);

  useEffect(() => {
    fetch(`http://localhost:3081/testupdate/${testCreationTableId}`)
      .then((response) => {
        console.log("Response Status:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Fetched Data:", data);
        setTestData({
          ...data,
          selectedCourse: data.courseCreationId,
          selectedTypeOfTest: data.courseTypeOfTestId,
          setSubjects: data.courseSubjectsId,
          sectionName: data.sectionName,
          noOfQuestions: data.noOfQuestions,
          QuestionLimit: data.QuestionLimit,
          selectedInstruction: data.instructionId,
        });
      })
      .catch((error) => console.error("Error fetching test data:", error));
  }, [testCreationTableId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3081/test-update/${testCreationTableId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            TestName: testData.TestName,
            selectedCourse: testData.selectedCourse,
            selectedTypeOfTest: testData.selectedTypeOfTest,
            testStartDate: testData.testStartDate,
            testEndDate: testData.testEndDate,
            testStartTime: testData.testStartTime,
            testEndTime: testData.testEndTime,
            Duration: testData.Duration,
            TotalQuestions: testData.TotalQuestions,
            totalMarks: testData.totalMarks,
            calculator: testData.calculator,
            status: testData.status,
            sectionName: testData.sectionName,
            noOfQuestions: testData.noOfQuestions,
            QuestionLimit: testData.QuestionLimit,
            selectedInstruction: testData.selectedInstruction,
            selectedSubjects: testData.selectedSubjects,
          }),
        }
      );

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };
  const handleSectionChange = (e, index) => {
    const { name, value, type } = e.target;
    const updatedValue = type === "number" ? parseFloat(value) : value;

    setTestData((prevData) => {
      const updatedSections = [...prevData.selectedsections];
      updatedSections[index] = {
        ...updatedSections[index],
        [name]: updatedValue,
      };
      return {
        ...prevData,
        selectedsections: updatedSections,
      };
    });
  };
  return (
    <div className="examUpdate_-container">
      <form onSubmit={handleSubmit}>
        <div className="testCreation_-contant">
          <h2 className="otsTitels">Test Update Form</h2>

          <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
            <div className="testCreation_-list">
              <label>Test Name:</label>
              <input
                type="text"
                name="TestName"
                value={testData.TestName}
                onChange={handleChange}
              />
            </div>
            <div className="testCreation_-list">
              <label>Select Course:</label>
              <select
                name="selectedCourse"
                value={testData.selectedCourse}
                onChange={handleChange}
              >
                <option value="">Select a Course</option>
                {courses.map((course) => (
                  <option
                    key={course.courseCreationId}
                    value={course.courseCreationId}
                  >
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
            <div className="testCreation_-list">
              <label>Type of Tests:</label>
              <select
                name="selectedTypeOfTest"
                value={testData.selectedTypeOfTest}
                onChange={handleChange}
              >
                <option value="">Select a Type of Test</option>
                {typeOfTests.map((typeOfTest) => (
                  <option
                    key={typeOfTest.TypeOfTestId}
                    value={typeOfTest.TypeOfTestId}
                  >
                    {typeOfTest.TypeOfTestName}
                  </option>
                ))}
              </select>
            </div>

            <div className="testCreation_-list">
              <label>Test Start Date:</label>
              <input
                type="date"
                name="testStartDate"
                value={testData.testStartDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
            <div className="testCreation_-list">
              <label>Test End Date:</label>
              <input
                type="date"
                name="testEndDate"
                value={testData.testEndDate}
                onChange={handleChange}
              />
            </div>
            <div className="testCreation_-list">
              <label>Start Time:</label>
              <input
                type="time"
                name="testStartTime"
                value={formatTime(testData.testStartTime)}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
            <div className="testCreation_-list">
              <label>End Time:</label>
              <input
                type="time"
                name="testEndTime"
                value={formatTime(testData.testEndTime)}
                onChange={handleChange}
              />
            </div>

            <div className="testCreation_-list">
              <label>Duration (in minutes):</label>
              <input
                type="number"
                name="Duration"
                value={testData.Duration}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
            <div className="testCreation_-list">
              <label>Total Questions:</label>
              <input
                type="number"
                name="TotalQuestions"
                value={testData.TotalQuestions}
                onChange={handleChange}
              />
            </div>
            <div className="testCreation_-list">
              <label>Total Marks:</label>
              <input
                type="number"
                name="totalMarks"
                value={testData.totalMarks}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
            <div className="testCreation_-list">
              <label>Select Subjects:</label>
              <select
                name="selectedSubjects"
                value={testData.selectedSubjects}
                onChange={handleChange}
              >
                <option value="">Select a Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.subjectId} value={subject.subjectId}>
                    {subject.subjectName}
                  </option>
                ))}
              </select>
            </div>
            <div className="testCreation_-list">
              <label>Section Name:</label>
              <input
                type="text"
                name="sectionName"
                value={testData.sectionName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
            <div className="testCreation_-list">
              <label>Number of Questions:</label>
              <input
                type="number"
                name="noOfQuestions"
                value={testData.noOfQuestions}
                onChange={handleChange}
              />
            </div>
            <div className="testCreation_-list">
              <label>Question Limit:</label>
              <input
                type="number"
                name="QuestionLimit"
                value={testData.QuestionLimit}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
            <div className="testCreation_-list">
              <label>Instructions:</label>
              <select
                value={testData.selectedInstruction}
                name="selectedInstruction"
                onChange={handleChange}
              >
                <option value="">Select an instruction</option>
                {instructionsData.map((instruction) => (
                  <option
                    key={instruction.instructionId}
                    value={instruction.instructionId}
                  >
                    {instruction.instructionHeading}
                  </option>
                ))}
              </select>
            </div>
            <div className="testCreation_-list">
              <label>Calculator:</label>
              <select
                name="calculator"
                value={testData.calculator}
                onChange={handleChange}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
          <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
            <div className="testCreation_-list">
              <label>Status:</label>
              <select
                name="status"
                value={testData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="testCreation_-list">
              <div></div>
             <div className="create_exam_header"> <button type="submit">Submit</button></div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TestUpdate;
