import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
const NewExamUpdataion = () => {
  const { examId } = useParams();
  const [examName, setExamName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [initialExamDetails, setInitialExamDetails] = useState({});

  useEffect(() => {
    // Fetch subjects from the API
    fetch("http://localhost:3081/subjects")
      .then((response) => response.json())
      .then((data) => setSubjects(data))
      .catch((error) => console.error("Error fetching subjects:", error));
  }, []);

  const fetchSelectedSubjects = async () => {
    try {
      // Fetch selected subjects for the specific exam
      const response = await axios.get(
        `http://localhost:3081/exams/${examId}/subjects`
      );
      const selectedSubjectsData = response.data;

      // Set the selected subjects in the state
      setSelectedSubjects(selectedSubjectsData);
    } catch (error) {
      console.error("Error fetching selected subjects:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const examResponse = await axios.get(
          `http://localhost:3081/feachingexams/${examId}`
        );
        const selectedSubjectsResponse = await axios.get(
          `http://localhost:3081/exams/${examId}/subjects`
        );

        const examData = examResponse.data[0];
        const selectedSubjectsData = selectedSubjectsResponse.data;

        setExamName(examData.examName);
        setStartDate(examData.startDate);
        setEndDate(examData.endDate);
        setSelectedSubjects(selectedSubjectsData);
        setInitialExamDetails({
          examName: examData.examName,
          startDate: examData.startDate,
          endDate: examData.endDate,
          subjects: selectedSubjectsData,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [examId]);

  const handleSubjectChange = (subjectId) => {
    setSelectedSubjects((prevSelectedSubjects) => {
      const newSelectedSubjects = new Set(prevSelectedSubjects);

      if (newSelectedSubjects.has(subjectId)) {
        // Subject is already selected, so remove it
        newSelectedSubjects.delete(subjectId);
      } else {
        // Subject is not selected, so add it
        newSelectedSubjects.add(subjectId);
      }
      return Array.from(newSelectedSubjects);
    });
  };

  //   const formatDate = (dateString) => {
  //     if (!dateString) {
  //       return '';
  //     }
  //     const date = new Date(dateString);
  //     const year = date.getFullYear();
  //     const month = String(date.getMonth() + 1).padStart(2, '0');
  //     const day = String(date.getDate()).padStart(2, '0');

  //     return `${year}-${month}-${day}`;
  //   };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedExamData = {
      examName,
      startDate,
      endDate,
      subjects: selectedSubjects,
    };

    if (
      examName === initialExamDetails.examName &&
      startDate === initialExamDetails.startDate &&
      endDate === initialExamDetails.endDate &&
      subjects.length === initialExamDetails.subjects.length &&
      subjects.every((subject) => initialExamDetails.subjects.includes(subject))
    ) {
      console.log("No changes made");
      return;
    }

    // Send PUT request to update exam data
    axios
      .put(`http://localhost:3081/update/${examId}`, updatedExamData)
      .then((response) => {
        console.log(response.data);
        // Handle success, e.g., show a success message to the user
      })
      .catch((error) => console.error("Error updating exam data:", error));
    console.log("Exam Id:", examId);
    console.log("Exam Name:", examName);
    console.log("Start Date:", new Date(startDate).toLocaleDateString());
    console.log("End Date:", new Date(endDate).toLocaleDateString());
    console.log("Selected Subjects:", selectedSubjects);
  };

  return (
    <div className="examUpdate_-container">
      <form onSubmit={handleSubmit}>
        <h2 className="textColor">update exam</h2>
        <div className="examUpdate_-contant">
          <label htmlFor="examName">Exam Name:</label>
          <input
            type="text"
            id="examName"
            value={examName || ""}
            onChange={(e) => setExamName(e.target.value)}
            required
          />
        </div>
        <div className="examUpdate_-contant">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            //   value={formatDate(startDate)}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="examUpdate_-contant">
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            //   value={formatDate(endDate)}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div >
          <label style={{paddingBottom:'10px',display:'block',textTransform:'uppercase'}}>Subjects:</label>
          
          {subjects.map((subject) => (
            <div key={subject.subjectId} className="examUpdate_-contant examSubjects_-contant">
              <label htmlFor={subject.subjectId}>{subject.subjectName}</label>

              <input
                className="inputLable  "
                type="checkbox"
                id={subject.subjectId}
                value={subject.subjectId}
                checked={selectedSubjects.includes(subject.subjectId)}
                onChange={() => handleSubjectChange(subject.subjectId)}
              />
            </div>
          ))}
        </div>

      <div className="create_exam_header">
      <button className="ots_-createBtn" type="submit"  style={{float:'right',textTransform:'uppercase'}}>Submit</button>
      </div>
      </form>
    </div>
  );
};

export default NewExamUpdataion;
