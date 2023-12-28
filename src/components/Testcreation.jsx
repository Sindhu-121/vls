import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import "./css/Testcreation.css";

const Testcreation = () => {
  const [testName, setTestName] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [calculator, setCalculator] = useState("no");
  const [status, setStatus] = useState("inactive");
  const [typeOfTests, setTypeOfTests] = useState([]);
  const [selectedtypeOfTest, setSelectedtypeOfTest] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState("");
  const [numberOfSections, setNumberOfSections] = useState(1);
  const [QuestionLimitChecked, setQuestionLimitChecked] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const validateForm = (
    testName,
    selectedCourse,
    selectedtypeOfTest,
    startDate,
    startTime,
    endDate,
    endTime,
    duration,
    totalQuestions,
    totalMarks,
    selectedInstruction
  ) => {
    const errors = {};
  
    if (!testName) {
      errors.testName = 'Test name is required';
    }
  
    if (!selectedCourse) {
      errors.selectedCourse = 'Please select a course';
    }
  
    if (!selectedtypeOfTest) {
      errors.selectedtypeOfTest = 'Please select a type of test';
    }
  
    if (!startDate) {
      errors.startDate = 'Start date is required';
    }
  
    if (!startTime) {
      errors.startTime = 'Start time is required';
    }
  
    if (!endDate) {
      errors.endDate = 'End date is required';
    }
  
    if (!endTime) {
      errors.endTime = 'End time is required';
    }
  
    if (!duration || isNaN(duration) || duration <= 0) {
      errors.duration = 'Please enter a valid duration (in minutes)';
    }
  
    if (!totalQuestions || isNaN(totalQuestions) || totalQuestions <= 0) {
      errors.totalQuestions = 'Please enter a valid total number of questions';
    }
  
    if (!totalMarks || isNaN(totalMarks) || totalMarks <= 0) {
      errors.totalMarks = 'Please enter a valid total marks';
    }
  
    if (!selectedInstruction) {
      errors.selectedInstruction = 'Please select an instruction';
    }
    
  if (!selectedCourse) {
    errors.selectedCourse = 'Please select a course.';
  }

  if (!selectedtypeOfTest) {
    errors.selectedtypeOfTest = 'Please select a type of test.';
  }
  
    setFormErrors(errors);
  
    return Object.keys(errors).length === 0;
  };
  
  const [sectionsData, setSectionsData] = useState([
    {
      selectedSubjects: "",
      sectionName: "",
      noOfQuestions: "",
      QuestionLimit: "",
    },
  ]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [testData, setTestData] = useState([]);
  const [selectedInstruction, setSelectedInstruction] = useState("");
  const [instructionsData, setInstructionsData] = useState([]);

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const response = await fetch("http://localhost:3081/instructions");
        const data = await response.json();
        setInstructionsData(data);
      } catch (error) {
        console.error("Error fetching instructions:", error);
      }
    };

    fetchInstructions();
  }, []);

  useEffect(() => {
    fetch("http://localhost:3081/testcourses")
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetch(`http://localhost:3081/course-typeoftests/${selectedCourse}`)
        .then((response) => response.json())
        .then((data) => setTypeOfTests(data))
        .catch((error) =>
          console.error("Error fetching course_typeoftests:", error)
        );
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedCourse) {
      fetch(`http://localhost:3081/course-subjects/${selectedCourse}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched subjects:", data);
          setSubjects(data);
        })
        .catch((error) =>
          console.error("Error fetching course-subjects:", error)
        );
    }
  }, [selectedCourse]);

  const handleOpenForm = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  const handleSelectChange = (e) => {
    setSelectedCourse(e.target.value);
  };
  const handleSelectTypeOfTest = (e) => {
    setSelectedtypeOfTest(e.target.value);
  };

  const handleSelectSubjects = (e) => {
    setSelectedSubjects(e.target.value);
  };
  const handleInputChange = (e) => {
    setTestName(e.target.value);
  };
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handleTotalQuestionsChange = (e) => {
    setTotalQuestions(e.target.value);
  };

  const handleTotalMarksChange = (e) => {
    setTotalMarks(e.target.value);
  };
  const handleInstructionChange = (e) => {
    setSelectedInstruction(e.target.value);
  };
  const handleCalculatorChange = (e) => {
    setCalculator(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleQuestionLimitChange = (e) => {
    setQuestionLimitChecked(e.target.checked);
  };

  const handleSectionChange = (e, index, field) => {
    // Create a copy of the sectionsData array
    const updatedSectionsData = [...sectionsData];

    // Ensure that the array at the given index is initialized
    if (!updatedSectionsData[index]) {
      updatedSectionsData[index] = {};
    }

    // Update the specified field in the copied array
    updatedSectionsData[index][field] = e.target.value;

    // Set the updated array to the state
    setSectionsData(updatedSectionsData);
  };

  const addSection = () => {
    setNumberOfSections((prevSections) => prevSections + 1);
  };

  const removeSection = () => {
    setNumberOfSections((prevSections) => prevSections - 1);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (validateForm()) {
      let isValid = true; 
      
      setSubmitting(true);
    try {
      // Log the sectionsData before making the request
      console.log("Sections Data Before Request:", sectionsData);

      // Assuming you have the testCreationTableId from the test creation
      // const testCreationTableId = getTestCreationTableId();

      // Make a request to create test and sections
      const response = await fetch("http://localhost:3081/create-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testName,
          selectedCourse,
          selectedtypeOfTest,
          startDate,
          startTime,
          endDate,
          endTime,
          duration,
          totalQuestions,
          totalMarks,
          calculator,
          status,
          sectionsData,
          selectedInstruction,
        }),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error submitting form:", error);
      isValid = false;
    }
    console.log("Validation Result:", isValid);

    return isValid;
    setIsFormVisible(false);
setSubmitting(false);
//   }
  };

  useEffect(() => {
    const feachTestData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3081/test_creation_table"
        );
        const data = await response.json(); // Convert the response to JSON
        setTestData(data);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
    feachTestData();
  }, []);

  function formatTime(dateTimeString) {
    const formattedTime = moment(dateTimeString, "HH:mm:ss.SSSSSS").format(
      "HH:mm"
    );
    return formattedTime !== "Invalid date" ? formattedTime : "Invalid Time";
  }

  // function formatDate(dateString) {
  //   const date = new Date(dateString);
  //   const day = date.getDate().toString().padStart(2, "0");
  //   const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-based
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  // }
  const handleDelete = async (testCreationTableId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:3081/test_table_data_delete/${testCreationTableId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result.message);
        const updatedtestData = testData.filter(
          (test) => test.testCreationTableId !== testCreationTableId
        );
        console.log("Before:", testData);
        console.log("After:", updatedtestData);
        setTestData(updatedtestData);
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    } else {
      // The user canceled the deletion
      console.log("Deletion canceled.");
    }
  };

  const handleShowTotalSectionsChange = () => {
    setShowTotalSections(!showTotalSections);
  };
  const [showTotalSections, setShowTotalSections] = useState(false);
  // const removeSection = () => {
  //   setSectionsData((prevSectionsData) => {
  //     const updatedSectionsData = [...prevSectionsData];
  //     updatedSectionsData.pop(); // Remove the last added section
  //     return updatedSectionsData;
  //   });
  // };
  return (
    <div className="otsMainPages testCreation_-container">
      <div className="TestCreation_-container">
        <div style={{ background: "#1a374d", color: "#fff", padding: "10px" }}>
          <h2>Test Creation</h2>
        </div>
        <br />
        {!isFormVisible && (
          <div className="">
            <button
              className="instructionBTN"
              type="button"
              onClick={handleOpenForm}
            >
              <i class="fa-solid fa-plus"></i>
              Add Test
            </button>
          </div>
        )}
        {isFormVisible && (
          <form onSubmit={handleSubmit}>
            <div className="testCreation_-contant ">
              <div>
                <button
                  className="ots_btnClose"
                  type="button"
                  onClick={handleCloseForm}
                >
                  Close Form
                </button>
              </div>

              <div className="testCreation_-contant_-flexCOntant examSubjects_-contant">
                <div className="testCreation_-list">
                  <label>Test Name:</label>
                  <input
                    type="text"
                    value={testName}
                    onChange={handleInputChange}
                  />
                  {formErrors.testName && (
                    <span className="error-message">
                      <i className="fa-solid fa-circle"></i>
                      {formErrors.testName}
                    </span>
                  )}
                </div>
                <div className="testCreation_-list">
                  <label>Status:</label>
                  <select value={status} onChange={handleStatusChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="testCreation_-contant_-flexCOntant  examSubjects_-contant">
                <div className="testCreation_-list">
                  <label>Select Course:</label>
                  <select value={selectedCourse} onChange={handleSelectChange}>
                    <option value="" disabled>
                      Select a course
                    </option>
                    {courses.map((course) => (
                      <option
                        key={course.courseCreationId}
                        value={course.courseCreationId}
                      >
                        {course.courseName}
                      </option>
                    ))}
                  </select>
                  {formErrors.selectedCourse && (
    <span className="error-message">{formErrors.selectedCourse}</span>
  )}
                </div>
                <div className="testCreation_-list">
                  <label>Type of Tests:</label>
                  <select
                    value={selectedtypeOfTest}
                    onChange={handleSelectTypeOfTest}
                  >
                    <option value="" disabled>
                      Select a type of test
                    </option>
                    {typeOfTests.map((typeOfTest) => (
                      <option
                        key={typeOfTest.TypeOfTestId}
                        value={typeOfTest.TypeOfTestId}
                      >
                        {typeOfTest.TypeOfTestName}
                      </option>
                    ))}
                  </select>
                  {formErrors.selectedtypeOfTest && (
    <span className="error-message">{formErrors.selectedtypeOfTest}</span>
  )}
                </div>
              </div>

              <div className="testCreation_-contant_-flexCOntant  examSubjects_-contant ">
                <div className="testCreation_-list">
                  <label>Test Start Date:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                  />
                  {formErrors.startDate && (
                    <span className="error-message">
                      <i className="fa-solid fa-circle"></i>
                      {formErrors.startDate}
                    </span>
                  )}
                </div>
                <div className="testCreation_-list">
                  <label>Start Time:</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={handleStartTimeChange}
                  />
                  {formErrors.startTime && (
                    <span className="error-message">
                      <i className="fa-solid fa-circle"></i>
                      {formErrors.startTime}
                    </span>
                  )}
                </div>
              </div>

              <div className="testCreation_-contant_-flexCOntant  examSubjects_-contant">
                <div className="testCreation_-list">
                  <label>Test End Date:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                  />
                  {formErrors.endDate && (
                    <span className="error-message">
                      <i className="fa-solid fa-circle"></i>
                      {formErrors.endDate}
                    </span>
                  )}
                </div>
                <div className="testCreation_-list">
                  <label>End Time:</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={handleEndTimeChange}
                  />
                  {formErrors.endTime && (
                    <span className="error-message">
                      <i className="fa-solid fa-circle"></i>
                      {formErrors.endTime}
                    </span>
                  )}
                </div>
              </div>

              <div className="testCreation_-contant_-flexCOntant  examSubjects_-contant">
                <div className="testCreation_-list">
                  <label>Instructions:</label>
                  <select
                    value={selectedInstruction}
                    onChange={handleInstructionChange}
                  >
                    <option value="" disabled>
                      Select an instruction
                    </option>
                    {instructionsData.map((instruction) => (
                      <option
                        key={instruction.instructionId}
                        value={instruction.instructionId}
                      >
                        {instruction.instructionHeading}
                      </option>
                    ))}
                  </select>
                  {formErrors.selectedInstruction && (
                    <span className="error-message">
                      <i className="fa-solid fa-circle"></i>
                      {formErrors.selectedInstruction}
                    </span>
                  )}
                </div>
                <div className="testCreation_-list">
                  <label>Calculator:</label>
                  <select value={calculator} onChange={handleCalculatorChange}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
              <div className="testCreation_-contant_-flexCOntant  examSubjects_-contant">
                <div className="testCreation_-list">
                  <label>Duration (in minutes):</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={handleDurationChange}
                    min="1"
                  />
                   {formErrors.duration && (
                    <span className="error-message">
                      <i className="fa-solid fa-circle"></i>
                      {formErrors.duration}
                    </span>
                  )}
                </div>
                <div className="testCreation_-list">
                  <label>Total Questions:</label>
                  <input
                    type="number"
                    value={totalQuestions}
                    onChange={handleTotalQuestionsChange}
                    min="1"
                  />
                   {formErrors.totalQuestions && (
                    <span className="error-message">
                      <i className="fa-solid fa-circle"></i>
                      {formErrors.totalQuestions}
                    </span>
                  )}
                </div>
              </div>

              <div className="testCreation_-contant_-flexCOntant  examSubjects_-contant">
                <div className="testCreation_-list">
                  <label>Total Marks:</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={handleTotalMarksChange}
                    min="1"
                  />
                    {formErrors.totalMarks && (
                    <span className="error-message">
                      <i className="fa-solid fa-circle"></i>
                      {formErrors.totalMarks}
                    </span>
                  )}
                </div>
                {/* <div className="testCreation_-list">
                  <label>SECTION</label>
                  <label>Question Limit:</label>
                  <input
                    className="inputLable"
                    type="checkbox"
                    checked={QuestionLimitChecked}
                    onChange={handleQuestionLimitChange}
                  />
                </div> */}

                <div className="testCreation_-list">
                  <label>SECTION</label>
                  <label>Any sections in the test click here</label>
                  <input
                    className="inputLable"
                    type="checkbox"
                    checked={showTotalSections}
                    onChange={handleShowTotalSectionsChange}
                  />
                </div>
              </div>
              <div>
                {showTotalSections && (
                  <div>
                    <label>
                      <input
                        className="inputLable"
                        type="checkbox"
                        checked={QuestionLimitChecked}
                        onChange={handleQuestionLimitChange}
                      />
                      Question Limit:
                    </label>

                    <div className="testCreation_-contant_-flexCOntant  examSubjects_-contant">
                      <table style={{ textAlign: "justify" }}>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Subjects:</th>
                            <th>Section</th>
                            <th>No of Question</th>
                            {QuestionLimitChecked && <th>Question Limit</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from(
                            { length: numberOfSections },
                            (_, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <div>
                                    <select
                                      value={
                                        sectionsData[index]?.selectedSubjects ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        handleSectionChange(
                                          e,
                                          index,
                                          "selectedSubjects"
                                        )
                                      }
                                    >
                                      <option value="" disabled>
                                        Select a Subject
                                      </option>
                                      {subjects.map((Subject) => (
                                        <option
                                          key={Subject.subjectId}
                                          value={Subject.subjectId}
                                        >
                                          {Subject.subjectName}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={
                                      sectionsData[index]?.sectionName || ""
                                    }
                                    onChange={(e) =>
                                      handleSectionChange(
                                        e,
                                        index,
                                        "sectionName"
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    value={
                                      sectionsData[index]?.noOfQuestions || ""
                                    }
                                    onChange={(e) =>
                                      handleSectionChange(
                                        e,
                                        index,
                                        "noOfQuestions"
                                      )
                                    }
                                  />
                                </td>
                                {QuestionLimitChecked && (
                                  <td>
                                    <input
                                      type="number"
                                      value={
                                        sectionsData[index]?.QuestionLimit || ""
                                      }
                                      onChange={(e) =>
                                        handleSectionChange(
                                          e,
                                          index,
                                          "QuestionLimit"
                                        )
                                      }
                                    />
                                  </td>
                                )}
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                    <button
                      className="instructionBTN"
                      type="button"
                      onClick={addSection}
                    >
                      +
                    </button>
                    <button
  className="instructionBTN"
  type="button"
  onClick={removeSection}
>
  -
</button>
                  </div>
                )}
              </div>
              {/* <div>
                <button
                  className="instructionBTN"
                  type="button"
                  onClick={addSection}
                >
                  +
                </button>
              </div> */}

              <div>
                <button className="instructionBTN" type="submit">
                  Submit
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      <h3 className="list_-otsTitels">Created test Details</h3>
      <div className="testCreation_-GettingDAta_-container">
        <table className="otc_-table" style={{ textAlign: "center" }}>
          <thead className="otsGEt_-contantHead otc_-table_-header">
            <tr>
              <th>Serial no</th>
              <th>Test Name</th>
              <th>Selected Course</th>
              <th>Test Start Date</th>
              <th>Test End Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="otc_-table_-tBody">
            {testData.map((test, index) => (
              <tr
                key={test.testCreationTableId}
                className={
                  test.testCreationTableId % 2 === 0 ? "color1" : "color2"
                }
              >
                <td>{index + 1}</td>
                <td>{test.TestName}</td>
                <td>{test.courseName}</td>
                <td>{test.testStartDate}</td>
                <td>{test.testEndDate}</td>
                <td>{formatTime(test.testStartTime)}</td>
                <td>{formatTime(test.testEndTime)}</td>
                <td>{test.status}</td>
                <td>
                  <div className="EditDelete_-btns">
                    <Link
                      className="Ots_-edit "
                      to={`/testupdate/${test.testCreationTableId}`}
                    >
                      {" "}
                      <i className="fa-solid fa-pencil"></i>
                    </Link>
                    <button
                      className="Ots_-delete"
                      onClick={() => handleDelete(test.testCreationTableId)}
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Testcreation;
