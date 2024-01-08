import React, { useState, useEffect , useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
const ReplaceAndUpdate = () => {
  const isMounted = useRef(true);
  const [exams, setExams] = useState([]);
  const [course,setCourse] = useState([]);
  const [test,setTest] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [sortid,setSortid] = useState([]);
  const {question_id}=useParams
  // const [data, setData] = useState([]);

  const [selectedExam, setSelectedExam] = useState("");
const [selectedCourse,setSelectedCourse] = useState(" ");
const [selectedTest,setSelectedTest] = useState(" ");
const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [selectedSortid, setSelectedSortid] = useState("");
  const [questionData, setQuestionData] = useState({});
 
  useEffect(() => {
    return () => {
      // Component unmounted, set isMounted to false
      isMounted.current = false;
    };
  }, []);
  
  useEffect(() => {
    fetchExams();
  }, []); 

  const fetchExams = async () => {
    try {
      const response = await fetch('http://localhost:3081/examRAU');
      const data = await response.json();
      setExams(data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const handleExamChange =async (event) => {
    const examId = event.target.value;
    setSelectedExam(examId);
    try{
      const response =await fetch(
        `http://localhost:3081/CourseRAU/${examId}`
      );
      const data = await response.json();
      setCourse(data);
    }
    catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  const handleCourseChange = async(event) => {
    const selectedCourse =event.target.value;
    setSelectedCourse(selectedCourse);
    try{
      const response =await fetch(
        `http://localhost:3081/TestRAU/${selectedCourse}`
      );
      const data = await response.json();
      setTest(data);
    }
    catch (error) {
      console.error("Error fetching Test data:", error);
    }
  }

  const handleTestChange= async(event) => {
    const selectedTest=event.target.value;
    setSelectedTest(selectedTest);
    try {
      const response = await fetch(
        `http://localhost:3081/subjectRAU/${selectedTest}`
      );

      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects data:", error);
    }
  }
  const handleSubjectChange = async (event) => {
    const selectedSubject = event.target.value;
    setSelectedSubject(selectedSubject);
 
    // Fetch sections data based on the selected subject
    try {
      const response = await fetch(`http://localhost:3081/sectionRAU/${selectedSubject}/${selectedTest}`);
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections data:', error);
    }
  };
  const handleSectionChange = async (event) => {
    const  selectedSection = event.target.value;
    setSelectedSection(selectedSection);
try{
  const response = await fetch(`http://localhost:3081/sortidRAU/${selectedTest}/${selectedSubject}/${selectedSection}`);
const data = await response.json();
setSortid(data);
}catch (error) {
      console.error('Error fetching sections data:', error);
    }
  };
  const handleSortidChange = async (event) => {
    const selectedSortid = event.target.value;
    setSelectedSortid(selectedSortid);
  
    try {
      const response = await fetch(`http://localhost:3081/quizRAU/${selectedSortid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setQuestionData(data);
    } catch (error) {
      console.error('Error fetching question data:', error);
    }
  };
  const handlechange=async(type,main_key,file)=>{
        try {
          const formData = new FormData();
          formData.append("file", file);
    
          const response = await axios.post(
           ` http://localhost:3081/uploadFile/${type}/${main_key}`,
            formData,
            {
              headers: {
                "enctype": "multipart/form-data",
              },
            }
          );
    
          if (response.status === 200) {
            // File uploaded successfully, you can update the state or take any other actions
            console.log("File uploaded successfully");
          } else {
            console.error("Error uploading file");
          }
        } catch (error) {
          console.error("Error uploading file:", error.message);
        }
    
      }
  return (
    <div className="otsMainPages">
      <h2>Replace and Update</h2>

      <div className='coures_-container'>
      <div className='coures-contant_-flexCOntantc examSubjects_-contant '>
      <div className="uploadedDocumentFilds">
      
      <label htmlFor="examSelect">Select an Exam:</label>
      <select id="examSelect" onChange={handleExamChange} value={selectedExam}>
        <option value="" disabled>Select an exam</option>
        {exams.map((exam) => (
          <option key={exam.examId} value={exam.examId}>{exam.examName}</option>
        ))}
      </select>
      </div>
      <br/>
      <div className="uploadedDocumentFilds">
        <label html="courseSelect">Select Course</label>
        <select id="courseSelect" onChange={handleCourseChange} value={selectedCourse}>
        <option value="">Select a Course</option>
        {course.map((course)=>(
          <option key={course.courseCreationId } value={course.	courseCreationId }>{course.courseName}</option>
          ))}
        </select>
      </div>
      </div>
    
      <div className='coures-contant_-flexCOntantc examSubjects_-contant '>
      <div className="uploadedDocumentFilds">
        <label html="testSelect">Select test</label>
        <select id="testSelect" onChange={handleTestChange} value={selectedTest}>
        <option value="">Select a Test</option>
        {test.map((test)=>(
          <option key={test.testCreationTableId  } value={test.	testCreationTableId  }>{test.TestName}</option>
          ))}
        </select>
      </div>
      <br/>
   
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
          </div></div>
      
          <div className='coures-contant_-flexCOntantc examSubjects_-contant '>
          <div className="uploadedDocumentFilds">
            <label htmlFor="sectionsSelect">Select Sections:</label>
            <select
              id="sectionsSelect"
              onChange={handleSectionChange}
              value={selectedSection}
            >
              <option value="">Select a Section</option>
              {sections.map((section) => (
                <option key={section.sectionId} value={section.sectionId }>
                  {section.sectionName}
                </option>
              ))}
            </select>
          </div>
          <br/>
          <div className="uploadedDocumentFilds">
            <label htmlFor="sortidSelect">Select Question Number:</label>
            <select
              id="sortidSelect"
              onChange={handleSortidChange}
              value={selectedSortid}
            >
              <option value="">Select a Question Number</option>
              {sortid.map((sortid) => (
                <option key={sortid.question_id} value={sortid.question_id}>
                  {sortid.sortid_text}
                </option>
              ))}
            </select>
          </div></div>
<div>
<div className="Document_-images_-container otsMainPages">
 <div className="q1s" style={{ display: "flex", gap: "4rem", flexDirection: "column", width: "81vw", margin: "2rem" }}>

   {questionData.question && (
        <div>
          <h3>Question {questionData.question.question_id}</h3>
          <img
            src={`http://localhost:3081/uploads/${questionData.question.documen_name}/${questionData.question.questionImgName}`}
            alt={`Question ${questionData.question.question_id}`}
          />
            {/* <input type="file" accept="image/*" onChange={handleQuestionImageChange} /> */}
            <input type="file" id={`question${questionData.question_id}`} />
            <input
                type="button"
                value="Change"
                onClick={() =>
                  handlechange(
                    "question",
                    questionData.question_id,
                    document.getElementById(`question${questionData.question_id}`).files[0]
                  )
                }
              />  
        </div>
      )}

      {/* Display options */}
      {questionData.options && (
        <div>
          {questionData.options.map((option, index) => (
            <div key={index}>
              <img
                src={`http://localhost:3081/uploads/${questionData.question.documen_name}/${option.optionImgName}`}
                alt={`Option ${option.option_id}`}
              /> 
               {/* <input type="file" accept="image/*" onChange={handleOptionImageChange} /> */}
            </div>
          ))}
        </div>
      )}

      {/* Display solution */}
      {questionData.solution && (
        <div>
          <img
            src={`http://localhost:3081/uploads/${questionData.question.documen_name}/${questionData.solution.solutionImgName}`}
            alt={`Solution ${questionData.solution.solution_id}`}
          />
            {/* <input type="file" accept="image/*" onChange={handleSolutionImageChange} /> */}
        </div>
      )}
          {/* <button onClick={handleImageUpload}>Upload Images</button> */}
     
      </div>
      
    </div>
    </div>
</div>
    </div>
  );
};

export default ReplaceAndUpdate;
