// import React from 'react'
// import {BrowserRouter as Router ,Routes,Route} from "react-router-dom"
// import './App.css';

// import Navbar from './Components/Navbar';
// import Topic from './Components/Topic';
// const App = () => {
//   return (
//     // <div>App</div>


//     <>
//     <Router>
//     <Routes>
//       <Route path='/' element={<Navbar/>}/>
//       <Route path='/Topic' element={<Topic/>}/>
//     </Routes>
    
//     </Router>
    
//     </>
//   )
// }

// export default App



import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Leftnav from "./components/Leftnav.jsx";
import Dashbaord from "./components/Dashboard.jsx";
import ExamCreation from "./components/Examcreation.jsx";
import Coursecreation from "./components/Coursecreation.jsx";
import NewExamUpdataion from "./components/NewExamUpdataion.jsx";
import Coureseupdate from "./components/Coureseupdate.jsx";
import InstructionPage from "./components/InstructionPage.jsx";
import { UpdateInstruction } from "./components/UpdateInstruction.jsx";
import Testcreation from "./components/Testcreation.jsx";
import TestUpdate from "./components/TestUpdate.jsx";
import DocumentUpload from "./components/DocumentUpload.jsx";
import GettinggInstructions from "./components/GettinggInstructions .jsx";
import './components/css/otcCss.css';
 import UpdateQuestion from './components/UpdateQuestion.jsx';
import Document_ImageInfo from "./components/Document_ImageInfo.jsx";
// import HomeLandingPage from './Pages/HomeLandingPage/HomeLandingPage'
// import HomeLandingPage from './Frontend/Pages/HomeLandingPage/HomeLandingPage.jsx'
// import QuizHome from '../Pages/QuizHome/QuizHome'
// import QuizHome from './Frontend/Pages/QuizHome/QuizHome.jsx'
// import Paper1 from '../Pages/Paper/Paper1'
// import Paper1 from './Frontend/Pages/Paper/Paper1.jsx'
// import Paper1 from './Pages/Paper/Paper1'
// import SubjectTest from '../Pages/SubjectTest/SubjectTest'
// import SubjectTest from './Frontend/Pages/SubjectTest/SubjectTest.jsx'
// import FullTest from '../Pages/FullTest/FullTest'
// import FullTest from './Frontend/Pages/FullTest/FullTest.jsx'
// import ChapterTest from './Pages/ChapterTest/ChapterTest'
// import PreviousTest from './Pages/PreviousTest/PreviousTest'
// import Instructions from './Pages/Instructions/Instructions';
// import Instructions from './Frontend/Pages/Instructions/Instructions';
// import General_intructions_page from './Pages/General_intructions_page/General_intructions_page'
// import General_intructions_page from './Frontend/Pages/General_intructions_page/General_intructions_page.jsx'
// import Payment from './Pages/Payment/Payment'
// import Payment from './Frontend/Pages/Payment/Payment.jsx'
// import DownloadQuizPage from './Pages/DownloadQuizPage/DownloadQuizPage'
// import DownloadQuizPage from './Frontend/Pages/DownloadQuizPage/DownloadQuizPage.jsx'
// import CoursePage from './Pages/HomeLandingPage/CoursePage'
// import CoursePage from './Frontend/Pages/HomeLandingPage/CoursePage.jsx'
// import Document_ImageInfo from './Pages/Paper/Document_ImageInfo';
// import Document_ImageInfo from './Frontend/Pages/Paper/Document_ImageInfo.jsx';
// import QuestionsFunctionality from './Pages/MainQuizFunctionality/QuestionsFunctionality';
// import QuestionsFunctionality from './Frontend/Pages/MainQuizFunctionality/QuestionsFunctionality.jsx';
// import TestResultsPage from './Pages/MainQuizFunctionality/TestResultsPage';
// import TestResultsPage from './Frontend/Pages/MainQuizFunctionality/TestResultsPage.jsx';
import ReplaceAndUpdate from "./components/ReplaceAndUpdate.jsx";
import UploadFile from './components/UploadFile.jsx';
import Quiz from './components/Quiz.jsx'

import Navbar from './Componentsvls/Navbar.jsx';
import Topic from './Componentsvls/Topic.jsx';
function App() {
  return (
    <Router>
      <Header />
     <div className="appp">
     <div className="common_grid_app">
        <Leftnav />
        <Routes>
          <Route path="/" element={<Dashbaord />} />
          <Route path="/exams" element={<ExamCreation />} />
          <Route path="/update/:examId" element={<NewExamUpdataion />} />
          <Route path="Coursecreation" element={<Coursecreation />} />
          <Route
            path="/courseupdate/:courseCreationId"
            element={<Coureseupdate />}
          />
          <Route path="/InstructionPage" element={<InstructionPage />} />
          <Route path="/Testcreation" element={<Testcreation />} />
          <Route
            path="/testUpdate/:testCreationTableId"
            element={<TestUpdate />}
          />
          <Route path="/DocumentUpload" element={<DocumentUpload />} />
          {/* <Route path="/Testcreation" element={<EditInstructions />} /> */}
          <Route
            path="/InstructionPage/editIns/:instructionId/:id"
            element={<UpdateInstruction />}
          />
           <Route
            path="/Instruction/editIns/:instructionId/"
            element={<GettinggInstructions />}
          />
 
          {/* document list */}
          <Route
              path="/getSubjectData/:subjectId/:testCreationTableId/:sectionId"
              element={<Document_ImageInfo />}
            />
            <Route path='/ReplaceAndUpdate' element={<ReplaceAndUpdate />}/>

<Route path='/singleQuetionRAU/:question_id' element={<UpdateQuestion />}/>

 
          {/* Frontend */}
          {/* <Route path='/HomeLandingPage' element={<HomeLandingPage/>}/>
        {/* <Route path='/CoursePage/:examId' element={<CoursePage/>} /> */}
        {/* <Route path='/feachingcourse/:examId' element={<CoursePage/>} />
          <Route path='/QuizHome' element={<QuizHome/>}/> */}
        {/* <Route path='/Paper' element={<Paper />} /> */}
        {/* <Route path='/getPaperData/:testCreationTableId'  element={<QuestionsFunctionality />} />
        <Route path='/result'  element={<TestResultsPage />} /> */}
        {/* <Route path='/quiz_all/:testCreationTableId'  element={<Paper1 />} /> */}
        {/* <Route path='/Payment'  element={<Payment />} />
        <Route path={'#'} element={<SubjectTest/>} /> */}
        {/* <Route path='/FullTest/:courseCreationId' element={<FullTest />} /> */}
        {/* <Route path='/Test_List/:courseCreationId' element={<FullTest />} />
        <Route path='/Instructions/:testCreationTableId' element={<Instructions />} />
        <Route path='/General_intructions_page/:testCreationTableId' element={<General_intructions_page/>}/>  */}


        <Route path='/UploadFile' element={<UploadFile/>}/>

        <Route path='/Quiz' element={<Quiz/>}/>

        <Route path='/' element={<Navbar/>}/>
              <Route path='/Topic' element={<Topic/>}/>
        </Routes>

        
    
      </div>
     </div>
 
 
    </Router>
  );
}
 
export default App;