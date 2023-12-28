import React, { useState, useEffect } from "react";
import "./admin.css";
import { Link } from "react-router-dom";
import "./css/Coursecreation.css";

const Coursecreation = () => {
  const [typeOfTest, setTypeOfTest] = useState([]);
  const [selectedtypeOfTest, setSelectedtypeOfTest] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedexams, setSelectedexams] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [typeofQuestion, setTypeofQuestion] = useState([]);
  const [selectedtypeofQuestion, setSelectedtypeofQuestion] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subjectsData, setSubjectsData] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [courseData, setCourseData] = useState([]);
  // const [validationMessages, setValidationMessages] = useState({
  //   courseName: "",
  //   typeOfTest: "",
  //   exam: "",
  //   subjects: "",
  //   typeofQuestion: "",
  //   courseStartDate: "",
  //   courseEndDate: "",
  //   cost: "",
  // });
  const resetFormFields = () => {
    setFormData({
      courseName: "",
      courseYear:"",
      examId: "",
      typeofQuestion: "",
      courseStartDate: "",
      courseEndDate: "",
      cost: "",
      discount: "",
      discountAmount: "",
      totalPrice: "",
    });
    setSelectedSubjects([]);
    setSelectedtypeofQuestion([]);
    setSelectedtypeOfTest([]);
    setIsFormOpen(false);
  };

  const [formData, setFormData] = useState({
    courseName: "",
    courseYear:"",
    examId: "",
    typeofQuestion: "",
    courseStartDate: "",
    courseEndDate: "",
    cost: "",
    discount: "",
    discountAmount: "",
    totalPrice: "",
  });

  useEffect(() => {
    const fetchSelectedExam = async () => {
      try {
        const response = await fetch(
          `http://localhost:3081/courese-exams/${selectedexams}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Selected Exam Data:", data); // Log the fetched data

        // Update your state or perform additional actions with the fetched data
      } catch (error) {
        console.error("Error fetching selected exam:", error);
      }
    };

    fetchSelectedExam();
  }, [selectedexams]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3081/course_creation_table"
        );
        const result = await response.json();
        const coursesWithArrays = result.map((course) => ({
          ...course,
          typeOfTestName: course.type_of_test
            ? course.type_of_test.split(", ")
            : [],
          subjects: course.subjects ? course.subjects.split(", ") : [],
          typeofQuestion: course.question_types
            ? course.question_types.split(", ")
            : [],
        }));
        setCourseData(coursesWithArrays);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourseData();
  }, []);

  useEffect(() => {
    fetch("http://localhost:3081/courese-exams")
      .then((response) => response.json())
      .then((data) => {
        setExams(data);
      })
      .catch((error) => console.error("Error fetching exams:", error));
  }, []);

  const handleexams = async (event) => {
    const selectedExamId = event.target.value;
    console.log("Selected Exam ID:", selectedExamId);
    setSelectedexams(selectedExamId);
    console.log("Selected Exam ID (after setting):", selectedexams);
    try {
      const response = await fetch(
        `http://localhost:3081/courese-exam-subjects/${selectedExamId}/subjects`
      );
      const data = await response.json();
      console.log("Subjects Data:", data); // Log the fetched data
      setSubjectsData(data); // Update subjectsData state
      setSelectedSubjects([]); // Reset selected subjects
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }

    setSelectedexams(selectedExamId);
  };

  const handleSubjectChange = (event, subjectId) => {
    const { checked } = event.target;

    setSelectedSubjects((prevSelectedSubjects) => {
      if (checked) {
        // Add the subjectId to the array if it's not already present
        return [...new Set([...prevSelectedSubjects, subjectId])];
      } else {
        // Remove the subjectId from the array
        return prevSelectedSubjects.filter((id) => id !== subjectId);
      }
    });
  };

  useEffect(() => {
    const fetchTypeOfTest = async () => {
      try {
        const response = await fetch("http://localhost:3081/type_of_tests");
        const result = await response.json();
        setTypeOfTest(result);
      } catch (error) {
        console.error("Error fetching Type of questions:", error);
      }
    };

    fetchTypeOfTest();
  }, []);

  const handletypeoftest = (event, typeOfTestId) => {
    const { checked } = event.target;

    setSelectedtypeOfTest((prevSelectedTest) => {
      const updatedSelectedTest = checked
        ? [...prevSelectedTest, typeOfTestId]
        : prevSelectedTest.filter((id) => id !== typeOfTestId);

      console.log("Selected Type of Test:", updatedSelectedTest);
      return updatedSelectedTest;
    });
  };

  const handleQuestionChange = (event, questionTypeId) => {
    const { checked } = event.target;

    setSelectedtypeofQuestion((prevSelectedQuestions) => {
      const updatedSelectedQuestions = checked
        ? [...prevSelectedQuestions, questionTypeId]
        : prevSelectedQuestions.filter((id) => id !== questionTypeId);

      console.log("Selected Type of Questions:", updatedSelectedQuestions);
      return updatedSelectedQuestions;
    });
  };

  useEffect(() => {
    const fetchTypeOfQuestion = async () => {
      try {
        const response = await fetch("http://localhost:3081/type_of_questions");
        const result = await response.json();
        // console.log("Type of Questions Data:", result); // Add this line to log the data
        setTypeofQuestion(result);
      } catch (error) {
        console.error("Error fetching Type of questions:", error);
      }
    };

    fetchTypeOfQuestion();
  }, []);

  const handleStartDateChange = (e) => {
    const formattedDate = e.target.value;
    setStartDate(formattedDate);
  };

  const handleEndDateChange = (e) => {
    const formattedDate = e.target.value;
    setEndDate(formattedDate);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cost" || name === "discount") {
      const cost = name === "cost" ? parseFloat(value) : formData.cost;
      const discount =
        name === "discount" ? parseFloat(value) : formData.discount;
      const discountAmount =
        !isNaN(cost) && !isNaN(discount) ? (cost * discount) / 100 : "";
      const totalPrice =
        !isNaN(cost) && !isNaN(discountAmount) ? cost - discountAmount : "";
      setFormData({
        ...formData,
        // courseYear:courseYear,
        typeOfTest: selectedtypeOfTest,
        examId: selectedexams,
        subjects: selectedSubjects,
        typeofQuestion: selectedtypeofQuestion,
        courseStartDate: startDate,
        courseEndDate: endDate,
        cost: cost,
        discount: discount,
        discountAmount: discountAmount,
        totalPrice: totalPrice,
      });
    } else if (name === "courseStartDate" || name === "courseEndDate") {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    // const newValidationMessages = {
    //   courseName: "",
    //   typeOfTest: "",
    //   exam: "",
    //   subjects: "",
    //   courseStartDate:" ",
    // courseEndDate:"",
    // cost:"",
    // };

    // if (!formData.courseName) {
    //   newValidationMessages.courseName = "* Required";
    // }
    // if (!formData.startDate) {
    //   newValidationMessages.startDate = "* Required";
    // }
    // if (!formData.endDate) {
    //   newValidationMessages.endDate = "* Required";
    // }
    // if (!formData.cost) {
    //   newValidationMessages.cost = "* Required";
    // }
    // if (selectedtypeofQuestion.length === 0) {
    //   newValidationMessages.typeofQuestion = "Please select at least one type of  Question.";
    // }
    // if (selectedtypeOfTest.length === 0) {
    //   newValidationMessages.typeOfTest = "Please select at least one type of test.";
    // }

    // if (!selectedexams) {
    //   newValidationMessages.exam = "* Required";
    // }

    // if (selectedSubjects.length === 0) {
    //   newValidationMessages.subjects = "Please select at least one Subject.";
    // }

    // // Add more specific validation checks if needed

    // setValidationMessages(newValidationMessages);

    // // If there are validation errors, stop form submission
    // if (Object.values(newValidationMessages).some(message => message !== "")) {
    //   return;
    // }

    // const requiredFields = [
    //   "courseName",
    //   "examId",
    //   "courseStartDate",
    //   "courseEndDate",
    //   "cost",
    //   "discount",
    //   "totalPrice",
    // ];

    // const isEmptyField = requiredFields.some((field) => !formData[field]);

    // if (isEmptyField) {
    //   alert("Please fill in all required fields.");
    //   return;
    // }
    // window.location.reload();
    resetFormFields();
    // setValidationMessages({
    //   courseName: "",
    //   typeOfTest: "",
    //   exam: "",
    //   subjects: "",
    //   typeofQuestion:"",
    // });
    const data = {
      ...formData,
      typeOfTest: selectedtypeOfTest,
      examId: selectedexams,
      subjects: selectedSubjects,
      typeofQuestion: selectedtypeofQuestion,
    };

    try {
      const response = await fetch("http://localhost:3081/course-creation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result && result.courseCreationId) {
        const courseCreationId = result.courseCreationId;
        const subjectsResponse = await fetch(
          "http://localhost:3081/course_type_of_question",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              courseCreationId,
              subjectIds: selectedSubjects,
              typeofQuestion: selectedtypeofQuestion,
              typeOfTestIds: selectedtypeOfTest,
            }),
          }
        );

        const subjectsResult = await subjectsResponse.json();
        console.log("Subjects Result:", subjectsResult);
        console.log(result);
        if (result.success) {
          console.log("Course created successfully");
        } else {
          console.log("Failed to create course:", result.error);
        }
      } else {
        console.log("Failed to create course. Unexpected response:", result);
      }
    } catch (error) {
      console.error("Error submitting course data:", error);
      // Handle error or show an error message to the user
    }
  };

  const handleDelete = async (courseCreationId) => {
    // Display a confirmation dialog before deleting
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:3081/course_creation_table_Delete/${courseCreationId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result.message);
        const updatedCourseData = courseData.filter(
          (course) => course.courseCreationId !== courseCreationId
        );
        console.log("Before:", courseData);
        console.log("After:", updatedCourseData);
        setCourseData(updatedCourseData);
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    } else {
      // The user canceled the deletion
      console.log("Deletion canceled.");
    }
  };

  const openForm = () => {
    setIsFormOpen(true);
    if (isFormOpen) {
      resetFormFields();
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    if (isFormOpen) {
      resetFormFields();
    }
  };
  function generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const startYear = 2000;
    const endYear = 2035;
  
    const yearOptions = [];
    for (let year = endYear; year >= startYear; year--) {
      yearOptions.push(
        <option key={year} value={year}>
          {year}
        </option>
      );
    }
  
    return yearOptions;
  }
  
  
  
  return (
    <div className="otsMainPages">
      <div className="">
        <h3 className="Coures_-otsTitels">Courses page</h3>

        {isFormOpen ? (
          <>
            <form onSubmit={handleSubmit}>
              <div
                className="create_exam_header"
                style={{ display: "flex", gap: "1rem" }}
              >
                <button className="ots_btnClose " type="button" onClick={closeForm}>
                  Close
                 
                </button>
              </div>

              <div className="coures_-container">
                <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                  <div className="testCreation_-list">
                    <label htmlFor="courseName">Course Name:</label>
                    <input
                      type="text"
                      id="courseName"
                      name="courseName"
                      value={formData.courseName}
                      onChange={handleChange}
                    />
                     {/* <div className="error-message">
                      {validationMessages.courseName}
                    </div> */}
                  </div>
                  <div className="testCreation_-list">
  <label htmlFor="year">Select Year:</label>
  <select
    id="year"
    name="courseYear"
    value={formData.courseYear}
    onChange={handleChange}
  >
    <option value="">Select Year</option>
    {generateYearOptions()}
  </select>
</div>

                  <div className="testCreation_-list">
                    <label>type of test:</label>
                    <div className="coures_-typeOfTest">
                      {typeOfTest.map((typeofTest) => (
                        <div
                          className="course_checkbox_continer course_frominput_container_media"
                          key={typeofTest.typeOfTestId}
                        >
                          <label
                            htmlFor={`question-${typeofTest.typeOfTestId}`}
                          >
                            {typeofTest.typeOfTestName}
                          </label>
                          <input
                            className="inputLable"
                            type="checkbox"
                            id={`typeofTest-${typeofTest.typeOfTestId}`}
                            name={`typeofTest-${typeofTest.typeOfTestId}`}
                            value={typeofTest.typeOfTestId}
                            checked={selectedtypeOfTest.includes(
                              typeofTest.typeOfTestId
                            )}
                            onChange={(e) =>
                              handletypeoftest(e, typeofTest.typeOfTestId)
                            }
                          />
                        </div>
                      ))}
                    </div>
                    {/* <div className="error-message">
                      {validationMessages.typeOfTest}
                    </div> */}
                  </div>
                </div>

                <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                  <div className="testCreation_-list">
                    <label htmlFor="exams">Select Exam:</label>
                    <select
                      id="exams"
                      value={selectedexams}
                      onChange={handleexams}
                    >
                      <option value="">Select exams</option>
                      {exams.map((exams) => (
                        <option key={exams.examId} value={exams.examId}>
                          {exams.examName}
                        </option>
                      ))}
                    </select>
                    {/* <div className="error-message">
                      {validationMessages.exam}
                    </div> */}
                  </div>

                  <div className="testCreation_-list">
                    <label>Select Subjects:</label>
                    <div className="coures_-Subjects">
                      {subjectsData.map((subject) => (
                        <div
                          className="course_frominput_container "
                          id="course_frominput_container_media"
                          key={subject.subjectId}
                        >
                          <label htmlFor={`subject-${subject.subjectId}`}>
                            {subject.subjectName}
                          </label>
                          <input
                            className="inputLable"
                            type="checkbox"
                            id={`subject-${subject.subjectId}`}
                            name={`subject-${subject.subjectId}`}
                            value={subject.subjectId}
                            checked={selectedSubjects.includes(
                              subject.subjectId
                            )}
                            onChange={(e) =>
                              handleSubjectChange(e, subject.subjectId)
                            }
                          />
                        </div>
                      ))}
                    </div>
                    {/* <div className="error-message">
                      {validationMessages.subjects}
                    </div> */}
                  </div>
                </div>

                <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                  <div className="testCreation_-list">
                    <label>type of Questions:</label>
                    <div className="course_checkbox_continer_content">
                      {typeofQuestion.map((type) => (
                        <div
                          className="course_checkbox_continer course_frominput_container_media"
                          key={type.quesionTypeId}
                        >
                          <label htmlFor={`question-${type.quesionTypeId}`}>
                            {type.typeofQuestion}
                          </label>
                          <input
                            className="inputLable"
                            type="checkbox"
                            id={`question-${type.quesionTypeId}`}
                            name={`question-${type.quesionTypeId}`}
                            value={type.quesionTypeId}
                            checked={selectedtypeofQuestion.includes(
                              type.quesionTypeId
                            )}
                            onChange={(e) =>
                              handleQuestionChange(e, type.quesionTypeId)
                            }
                          />
                        </div>
                      ))}
                    </div>
                    {/* <div className="error-message">
                      {validationMessages.typeofQuestion}
                    </div> */}
                  </div>
                </div>

                <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                  <div className="testCreation_-list">
                    <label htmlFor="courseStartDate">Course Start Date:</label>
                    <input
                      type="date"
                      id="courseStartDate"
                      name="courseStartDate"
                      value={startDate}
                      onChange={handleStartDateChange}
                      min={new Date().toISOString().split("T")[0]}
                    /> 
                     {/* <div className="error-message">
                    {validationMessages.startDate}
                  </div> */}
                  </div>

                  <div className="testCreation_-list">
                    <label htmlFor="courseEndDate">Course End Date:</label>
                    <input
                      type="date"
                      id="courseEndDate"
                      name="courseEndDate"
                      value={endDate}
                      onChange={handleEndDateChange}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  {/* <div className="error-message">
                    {validationMessages.endDate}
                  </div> */}
                </div>

                <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                  <div className="testCreation_-list">
                    <label htmlFor="cost">Cost:</label>
                    <input
                      type="number"
                      id="cost"
                      name="cost"
                      value={formData.cost}
                      onChange={handleChange}
                    />
                    {/* <div className="error-message">
                    {validationMessages.cost}
                  </div> */}
                  </div>
                  <div className="testCreation_-list">
                    <label htmlFor="discount">Discount (%):</label>
                    <input
                      type="number"
                      id="discount"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="coures-contant_-flexCOntantc examSubjects_-contant">
                  <div className="testCreation_-list">
                    <label htmlFor="discountAmount">Discount Amount:</label>
                    <input
                      type="number"
                      id="discountAmount"
                      name="discountAmount"
                      value={formData.discountAmount}
                      readOnly
                    />
                  </div>
                  <div className="testCreation_-list">
                    <label htmlFor="totalPrice">Total Price:</label>
                    <input
                      type="number"
                      id="totalPrice"
                      name="totalPrice"
                      value={formData.totalPrice}
                      readOnly
                    />
                  </div>
                </div>
                <div className="create_exam_header">
                  <button className="ots_-createBtn" type="submit">Create Course</button>
                </div>
              </div>
            </form>
          </>
        ) : (
          <div className="create_exam_header">
           
            <button className="otc_-addExam" type="button" onClick={openForm}>
            <i class="fa-solid fa-plus"></i> 
               Add course
            </button>
          </div>
        )}
      </div>
      <div className=""  style={{marginTop:'4rem'}}>
      <h3 className="list_-otsTitels">created COURSES list</h3>
        <table className="couresCreation_-table">
          <thead className="otsGEt_-contantHead couresotc_-table">
            <tr>
              <th>no</th>
              <th>Course</th>
              <th>Type of Test</th>
              <th> Exam</th>
              <th>Subjects</th>
              <th>Type of Questions</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Cost</th>
              <th>Discount</th>
              <th>Total Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="couresotc_-table_-tBody">
            {courseData.map((course, index) => (
              <tr
                key={course.courseCreationId}
                className={
                  course.courseCreationId % 2 === 0 ? "color1" : "color2"
                }
              >
                <td>{index + 1}</td>
                <td>{course.courseName}</td>
                <td>
                  {Array.isArray(course.typeOfTestName) &&
                  course.typeOfTestName.length > 0
                    ? course.typeOfTestName.join(", ")
                    : "N/A"}
                </td>
                <td>{course.examName}</td>
                <td>
                  {Array.isArray(course.subjects) && course.subjects.length > 0
                    ? course.subjects.join(", ")
                    : "N/A"}
                </td>
                <td>
                  {Array.isArray(course.typeofQuestion) &&
                  course.typeofQuestion.length > 0
                    ? course.typeofQuestion.join(", ")
                    : "N/A"}
                </td>
                <td>{course.courseStartDate}</td>
                <td>{course.courseEndDate}</td>
                <td>{course.cost}</td>
                <td>{course.Discount}</td>
                <td>{course.totalPrice}</td>
                <td>
                  <div className="EditDelete_-btns">
                    <Link className="Ots_-edit" to={`/courseupdate/${course.courseCreationId}`}>
                     
                        <i className="fa-solid fa-pencil"></i>
                    
                    </Link>
                    <button
                 className="Ots_-delete"
                      onClick={() => handleDelete(course.courseCreationId)}
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

export default Coursecreation;
