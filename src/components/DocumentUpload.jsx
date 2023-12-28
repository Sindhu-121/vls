import React, { useState, useEffect } from "react";

import { UploadedDoc } from "./UploadedDoc";
import "../components/css/DocumentUpload.css";
import { useParams } from "react-router-dom";

const DocumentUpload = () => {
  const [tests, setTests] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [file, setFile] = useState(null);
const {testCreationTableId}= useParams()

// const [formErrors, setFormErrors] = useState({});
// const [submitting, setSubmitting] = useState(false);
// const validateForm = () => {
//   const errors = {};
//   setFormErrors(errors);
//   if (!selectedTest) {
//     errors.selectedTest = 'required';
//   }
//   if (!selectedSubject) {
//     errors.selectedSubject = 'required';
//   }
//   // if (!selectedSection) {
//   //   errors.selectedSection = 'required';
//   // }
//   if (!file) {
//     errors.file = 'required';
//   }
//     return Object.keys(errors).length === 0;
//   };
  useEffect(() => {
    // Fetch tests data
    fetch("http://localhost:3081/tests")
      .then((response) => response.json())
      .then((data) => setTests(data))
      .catch((error) => console.error("Error fetching tests data:", error));
  }, []);

  const handleTestChange = async (event) => {
    const testCreationTableId = event.target.value;
    setSelectedTest(testCreationTableId);

    // Fetch subjects data based on the selected test
    try {
      const response = await fetch(
        `http://localhost:3081/subjects/${testCreationTableId}`
      );

      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects data:", error);
    }
  };

  const handleSubjectChange = async (event) => {
    const selectedSubject = event.target.value;
    setSelectedSubject(selectedSubject);
 
    // Fetch sections data based on the selected subject
    try {
      const response = await fetch(`http://localhost:3081/sections/${selectedSubject}/${selectedTest}`);
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections data:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
  };

  const handleUpload = (e) => { 
    e.preventDefault()
    // if (validateForm()) {
    //   setSubmitting(true);
    const formData = new FormData();
    formData.append("document", file);
    formData.append("subjectId", selectedSubject);
    formData.append("sectionId", selectedSection);
    formData.append("testCreationTableId", selectedTest);

    fetch("http://localhost:3081/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        alert("Successfully uploaded Document");
        // window.location.reload();

      })
      .catch((error) => {
        console.error(error);
      });
  
// setSubmitting(false);
//   }
  };

  return (
    <div className="DocumentImage_Uploader">
      <div className="otsTitels"><h2 >Document Upload Form </h2></div>
      <form>
        <div className="uploadedDocument_container examSubjects_-contant">
          <div className="uploadedDocumentFilds">
            <label htmlFor="testSelect">Select Test:</label>
            <select
              id="testSelect"
              onChange={handleTestChange}
              value={selectedTest}
            >
              <option value="">Select a Test</option>
              {tests.map((test) => (
                <option
                  key={test.testCreationTableId}
                  value={test.testCreationTableId}
                >
                  {test.TestName}
                </option>
              ))}
            </select>
            {/* {formErrors.selectedTest && <span className="error-message"><i class="fa-solid fa-circle"></i>{formErrors.selectedTest}</span>} */}
          </div>

          <div className="uploadedDocumentFilds">
            <label htmlFor="subjectSelect">Select Subject:</label>
            <select
              id="subjectSelect"
              onChange={handleSubjectChange}
              value={selectedSubject}
            >
              <option value="">Select a Subject</option>
              {subjects.map((subject) => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
            {/* {formErrors.selectedSubject && <span className="error-message"><i class="fa-solid fa-circle"></i>{formErrors.selectedSubject}</span>} */}
          </div>

          <div className="uploadedDocumentFilds">
            <label htmlFor="sectionsSelect">Select Sections:</label>
            <select
              id="sectionsSelect"
              onChange={handleSectionChange}
              value={selectedSection}
            >
              <option value="">Select a Section</option>
              {sections.map((section) => (
                <option key={section.sectionId} value={section.sectionId}>
                  {section.sectionName}
                </option>
              ))}
            </select>
            {/* {formErrors.selectedSection && <span className="error-message"><i class="fa-solid fa-circle"></i>{formErrors.selectedSection}</span>} */}
          </div>

          <div className="uploadedDocumentFilds">
            <label htmlFor="">Upload file</label>
            <input type="file" accept=".docx" onChange={handleFileChange} />
            {/* {formErrors.file && <span className="error-message"><i class="fa-solid fa-circle"></i>{formErrors.file}</span>} */}
          </div>
        </div>

        <div className="uploadedDocumentFilds" style={{float:'right'}}>
           
        <button className="ots_-createBtn" onClick={(e) => handleUpload(e)}>Upload</button>
          </div>
        <div>

        </div>
      </form>

      {/* document info section */}
      <UploadedDoc />
    </div>
  );
};

export default DocumentUpload;
