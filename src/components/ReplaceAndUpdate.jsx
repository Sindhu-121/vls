import React, { useState, useEffect , useRef } from 'react';
import { Link } from 'react-router-dom';

const ReplaceAndUpdate = () => {
  const isMounted = useRef(true);
  const [exams, setExams] = useState([]);
  const [course,setCourse] = useState([]);
  const [test,setTest] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [sortid,setSortid] = useState([]);

  // const [data, setData] = useState([]);

  const [selectedExam, setSelectedExam] = useState("");
const [selectedCourse,setSelectedCourse] = useState(" ");
const [selectedTest,setSelectedTest] = useState(" ");
const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [selectedSortid, setSelectedSortid] = useState("");


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
    try{
      const response = await fetch(`http://localhost:3081/singleQuetionRAU/${selectedSortid}`);
    const data = await response.json();

    if (isMounted.current) {
      setData(data.questions); 
    }
    setData(data);

    }catch (error) {
          console.error('Error fetching sections data:', error);
        }

  };
 
  

  const [data, setData] = useState({ });
  

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
                <option key={sortid.sort_id} value={sortid.question_id}>
                  {sortid.sortid_text}
                </option>
              ))}
            </select>
          </div></div>
<div>


<div className="Document_-images_-container otsMainPages">
    
<div
        className="q1s"
        style={{
          display: "flex",
          gap: "4rem",
          flexDirection: "column",
          width: "81vw",
          margin: "2rem",
        }}
      >
       {data.questions &&
  data.questions.map((question) => (
    <div
      className="outColor examSubjects_-contant"
      style={{ background: "", padding: "2rem 2rem" }}
      key={`question_${question.question_id}`}
    >
      <div key={`question_inner_${question.question_id}`}>
        <div className="question" key={`question_inner_inner_${question.question_id}`}>
          <h3 style={{ display: "flex", gap: "1rem" }}>
            <p>Question </p> {question.question_id}
          </h3>

          <img
            src={`data:image/png;base64,${question.question_img}`}
            alt="Question"
          />
        </div>

        {/* {data.options &&
          data.options
            .filter((opt) => opt.question_id === question.question_id)
            .map((option) => (
              <div
                className="option"
                key={`option_${option.option_id}`}
                style={{ display: "flex", gap: "1rem" }}
              >
                <span>{OptionLabels[option.option_index]}</span>
                <img
                  src={`data:image/png;base64,${option.option_img}`}
                  alt={`Option ${OptionLabels[option.option_index]}`}
                />
              </div>
            ))} */}

        {data.solutions &&
          data.solutions
            .filter((sol) => sol.question_id === question.question_id)
            .map((solution) => (
              <div className="solution" key={`solution_${solution.solution_id}`}>
                <h3>solution </h3>
                <img
                  src={`data:image/png;base64,${solution.solution_img}`}
                  alt="Solution"
                />
              </div>
            ))}

        {data.answers &&
          data.answers
            .filter((ans) => ans.question_id === question.question_id)
            .map((answer) => (
              <div key={`answer_${answer.answer_id}`}>
                <h3>Answer</h3>
                {answer.answer_text}
              </div>
            ))}

        {data.marks &&
          data.marks
            .filter((markes) => markes.question_id === question.question_id)
            .map((markes) => (
              <div key={`marks_${markes.markes_id}`}>
                <h3>Marks</h3>
                {markes.marks_text}
              </div>
            ))}

        {data.qtypes &&
          data.qtypes
            .filter((qtype) => qtype.question_id === question.question_id)
            .map((qtype) => (
              <div key={`qtype_${qtype.qtype_id}`}>
                <h3>QType</h3>
                {qtype.qtype_text}
              </div>
            ))}
      </div>
      <button>
        <Link to={`/singleQuetionRAU/${question.question_id}`}>update</Link>
      </button>
    </div>
  ))}


      
      </div>
 
    </div>
   
    </div>
 
</div>
    </div>
  );
};

export default ReplaceAndUpdate;
