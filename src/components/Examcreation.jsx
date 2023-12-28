import React, { useState, useEffect } from "react";
import axios from "axios";
import "./admin.css";
import "./css/Examcreation.css";

import { Link, useParams } from "react-router-dom";

function Examcreation() {
  const [examName, setExamName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [examsWithSubjects, setExamsWithSubjects] = useState([]);
  const { subjectId } = useParams();
  const [formErrors, setFormErrors] = useState({});
  const validateForm = () => {
    const errors = {};

    if (!examName.trim()) {
      errors.examName = ' * Required';
    }

    if (!startDate) {
      errors.startDate = '* Required';
    }

    if (!endDate) {
      errors.endDate = ' * Required';
    } else if (new Date(endDate) < new Date(startDate)) {
      errors.endDate = 'End Date must be after Start Date';
    }

    if (selectedSubjects.length === 0) {
      errors.subjects = '*At least one subject must be selected';
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };
  const resetForm = () => {
    setExamName("");
    setStartDate("");
    setEndDate("");
    setSelectedSubjects([]);
  };

  //....................................FECHING SUBJECTS ...............................//
  useEffect(() => {
    // Fetch subjects from the backend when the component mounts
    axios
      .get("http://localhost:3081/subjects")
      .then((response) => {
        setSubjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  }, []);
  //....................................END...............................//

  //....................................HANDLER FOR SUBJECT CHECK BOXS...............................//
  const handleCheckboxChange = (subjectId) => {
    // Toggle the selection of subjects
    setSelectedSubjects((prevSelected) => {
      if (prevSelected.includes(subjectId)) {
        return prevSelected.filter((id) => id !== subjectId);
      } else {
        return [...prevSelected, subjectId];
      }
    });
  };
  //....................................END...............................//

  //................................... handler for submit button .............................//
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // if (!examName || !startDate || !endDate || selectedSubjects.length === 0) {
    //   alert("Please fill in all required fields.");
    //   return;
    // }
    const examData = {
      examName,
      startDate,
      endDate,
      selectedSubjects,
    };
    if (validateForm()) {
      setSubmitting(true);
    axios
      .post("http://localhost:3081/exams", examData)
      .then((response) => {
        console.log("Exam created:", response.data);
        // Reset form fields and state as needed
        setSubmitting(false);
        resetForm();
        exams_with_subject();

        // window.location.reload();
        // setShowSuccessPopup(true);
      })
      .catch((error) => {
        console.error("Error creating exam:", error);
        setSubmitting(false);
      });
      setExamName('');
      setStartDate('');
      setEndDate('');
      setSelectedSubjects([]);
      setFormErrors({});
      setFormOpen(false);
      setSubmitting(false);
    }

  };
  useEffect(() => {
    exams_with_subject();
  }, []);
  function exams_with_subject(){
    // alert("hi")
    axios
    .get("http://localhost:3081/exams-with-subjects")
    .then((response) => {
      setExamsWithSubjects(response.data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  }
  //....................................END...............................//

  //.............................Delete button handler ...................//
  const handleDelete = (examId) => {
    // Handle the "Delete" action for the given examId on the client side
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this data?"
    );
    if (confirmDelete) {
      setExamsWithSubjects((prevExams) =>
        prevExams.filter((exam) => exam.examId !== examId)
      );

      // Send a request to delete the exam from the server
      axios
        .delete(`http://localhost:3081/exams/${examId}`)
        .then((response) => {
          console.log(`Exam with ID ${examId} deleted from the database`);
        })
        .catch((error) => {
          console.error("Error deleting exam:", error);
        });
    }
  };
  //....................................END...............................//

  return (
    <div className="create_exam_container otsMainPages">
      <h3 className="Coures_-otsTitels">Exam creation page</h3>
      <div className="create_exam_content">
        <div className="create_exam_header">
       
          {formOpen ? (
            <div className="examContainer">
              {/* <h2>Create Exam</h2> */}
              <form onSubmit={handleSubmit}>
              
                <div className="examForm_Contant-container">
          
                  <div onClick={() => setFormOpen(false)}>
                    <button className="ots_btnClose">
                      Close
                      <i class="fa-regular fa-circle-xmark "></i>
                    </button>
                  </div>
                  <div className="Exams_contant examSubjects_-contant">
                    <div className="formdiv_contaniner">
                      <label>Exam Name:</label>
                     
                      <input
                        type="text"
                        value={examName}
                        onChange={(e) => setExamName(e.target.value)}
                      /> {formErrors.examName && <span className="error-message">{formErrors.examName}</span>}
                    </div>
                    <div className="formdiv_contaniner">
                      <label>Start Date:</label>
                      
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      {formErrors.startDate && <span className="error-message">{formErrors.startDate}</span>}
                    </div>

                    <div className="formdiv_contaniner">
                      <label>End Date:</label>
                      
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      {formErrors.endDate && <span className="error-message">{formErrors.endDate}</span>}
                    </div>
                  </div>

                  <div className="exam_SubjectCOnatiner examSubjects_-contant">
                    <div className="formdiv_contaniner_ch ">
                      <ul className="examSubject_conten">
                        <label>Subjects:</label>
                      
                        {subjects.map((subject) => (
                          <li key={subject.subjectId}>
                            <label> {subject.subjectName} </label>
                            <input
                              className="inputLable"
                              type="checkbox"
                              checked={selectedSubjects.includes(
                                subject.subjectId
                              )}
                              onChange={() =>
                                handleCheckboxChange(subject.subjectId)
                              }
                            />
                          </li>
                        ))}
                          {formErrors.subjects && <span className="error-message">{formErrors.subjects}</span>}
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  
                  <button
                    className="ots_-createBtn"
                    type="submit"
                    disabled={submitting}
                  >
                    Create Exam
                  </button>
                </div>
              </form>
            </div>
          ) : (
            
            // ....................................FROM END...............................
            <button className="otc_-addExam" onClick={() => setFormOpen(true)}>
              <i class="fa-solid fa-plus"></i> Add Exam
            </button>
          )}
          {/* {showSuccessPopup && <SuccessPopup onClose={closeSuccessPopup} />} */}
        </div>
        {/* ....................................FORM START............................... */}

        <div>
          {/* <h2>Exams with Subjects</h2> */}
          {/* ....................................TABLE START...............................  */}
          <div className="examCreation_-createdData">
            <h3 className="list_-otsTitels">created exams list</h3>
            <table className="otc_-table">
              <thead className="otsGEt_-contantHead otc_-table_-header">
                <tr>
                  <th>Serial no</th>
                  <th>Exam Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Subjects</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="otc_-table_-tBody">
                {examsWithSubjects.map((exam, index) => (
                  <tr
                    key={exam.examId}
                    className={exam.examId % 2 === 0 ? "color1" : "color2"}
                  >
                    <td>{index + 1}</td>
                    <td>{exam.examName}</td>

                    <td>{exam.startDate}</td>
                    <td>{exam.endDate}</td>
                    <td>{exam.subjects}</td>
                    <td>
                      <div className="EditDelete_-btns">
                        <button className="Ots_-edit ">
                          <Link to={`/update/${exam.examId}`}>
                            <i class="fa-solid fa-pencil"></i>
                          </Link>
                        </button>
                        <button
                          className="Ots_-delete"
                          onClick={() => handleDelete(exam.examId)}
                        >
                          <i class="fa-regular fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

         
          {/* ....................................TABLE END...............................  */}
        </div>
      </div>
    </div>
  );
}

export default Examcreation;
