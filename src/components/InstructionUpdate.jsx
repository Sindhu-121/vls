import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const InstructionUpdate = () => {
  const { instructionId } = useParams();
  const [instructionHeading, setInstructionHeading] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [instructionPoint, setInstructionPoint] = useState("");
  const [file, setFile] = useState(null);
  const [exams, setExams] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const validateForm = () => {
    const errors = {};
  
    if (!selectedExam) {
      errors.examId = 'required';
    }
    if (!instructionHeading) {
      errors.instructionHeading = 'required';
    }
    if (!file) {
      errors.file = 'required';
    }
  
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("http://localhost:3081/exams");
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchExams();
  }, []);
  const fetchInstructionDetails = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3081/instructionsfeach/${instructionId}`
      );
      const instruction = response.data;

      // Set the state with fetched data
      setInstructionHeading(instruction.instructionHeading);
      setSelectedExam(instruction.examId);
      setInstructionPoint(instruction.instructionPoint);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching instruction details:", error);
      setError("Failed to fetch instruction details. Please try again."); // Set the error state
    }
  }, [instructionId]);

  useEffect(() => {
    // Fetch the instruction details using instructionId
    fetchInstructionDetails();
  }, [instructionId, fetchInstructionDetails]);

  if (loading) {
    return <p>Loading...</p>; // You can replace this with a loading spinner or a more user-friendly message.
  }
  if (error) {
    return <p>{error}</p>; // Display the error message to the user
  }

  // const handleFileUpload = (files) => {
  //     const selectedFile = files[0];
  //     setFile(selectedFile);
  // };

  const handleUpdate = async () => {
  if (validateForm()) {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("examId", selectedExam);
      formData.append("instructionHeading", instructionHeading);
      formData.append("instruction", instructionPoint);
      await axios.put(
        `http://localhost:3081/instructionupload/${instructionId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Instruction updated successfully!");
    } catch (error) {
      console.error("Error updating instruction:", error.response);
      alert("Failed to update instruction. Please try again.");
    }
    // Assuming you intended to close the form after submitting
    setFormOpen(false);
    setSubmitting(false);
  }
};


  return (
    <div >
      <h2>Update Instruction</h2>
      <form>
        <label>Select Exam:</label>
        <select
          name="examId"
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
        >
          <option value="">Select Exam:</option>
          {exams.map((exam) => (
            <option key={exam.examId} value={exam.examId}>
              {exam.examName}
            </option>
          ))}
        </select> {formErrors.examId && <span className="error-message"><i class="fa-solid fa-circle"></i>{formErrors.examId}</span>}
        <label>Instructions Heading:</label>
        <input
          type="text"
          value={instructionHeading}
          onChange={(e) => setInstructionHeading(e.target.value)}
        />
 {formErrors.instructionHeading && <span className="error-message"><i class="fa-solid fa-circle"></i>{formErrors.instructionHeading}</span>}
        <div>
          <label>Instructions:</label>
          <textarea
            value={instructionPoint}
            onChange={(e) => setInstructionPoint(e.target.value)}
            rows={40}
            cols={90}
          />
        </div>
        <div>
          <label>Instructions:</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div> {formErrors.file && <span className="error-message"><i class="fa-solid fa-circle"></i>{formErrors.file}</span>}
        <button type="button" onClick={handleUpdate}>
          Update
        </button>
      </form>
    </div>
  );
};

export default InstructionUpdate;
