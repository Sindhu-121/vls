// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// function Document_ImageInfo() {
//   const [data, setData] = useState(null);
//   const { subjectId, testCreationTableId,sectionId } = useParams();
//   useEffect(() => {
//     fetchData();
//   }, []);
//   const handlechange=async(type,main_key,file)=>{
//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const response = await axios.post(
//        ` http://localhost:3081/uploadFile/${type}/${main_key}`,
//         formData,
//         {
//           headers: {
//             "enctype": "multipart/form-data",
//           },
//         }
//       );

//       if (response.status === 200) {
//         // File uploaded successfully, you can update the state or take any other actions
//         console.log("File uploaded successfully");
//       } else {
//         console.error("Error uploading file");
//       }
//     } catch (error) {
//       console.error("Error uploading file:", error.message);
//     }

//   }
//   const fetchData = async () => {
//     try {
//       const response = await fetch(
//         `http://localhost:3081/getSubjectData/${subjectId}/${testCreationTableId}/${sectionId}`
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const result = await response.json();
//       setData(result);
//     } catch (error) {
//       console.error("Error fetching data:", error.message);
//       // Handle the error, e.g., show an error message to the user
//     }
//   };

//   if (!data) {
//     return <div>Loading...</div>;
//   }
//   const OptionLabels = ["(a)", "(b)", "(c)", "(d)"];
//   // Render your component using the fetched data
//   return (
//     <div className="Document_-images_-container otsMainPages">
//       {/* Access data as needed, for example: */}
//       <h1>
//         {data.document.documen_name} {data.document.subjectId}
//         {data.document.testCreationTableId}
//       </h1>
//       {/* Map over questions and render them */}
//       <div
//         className="q1s"
//         style={{
//           display: "flex",
//           gap: "4rem",
//           flexDirection: "column",
//           width: "81vw",
//           margin: "2rem",
//         }}
//       >
//         {data.questions.map((question, index) => (
//           <div
//             className="outColor examSubjects_-contant"
//             style={{ background: "", padding: "2rem 2rem" }}
//           >
//             <div key={question.question_id}>
//               <div className="question" key={index}>
//                 <h3 style={{ display: "flex", gap: "1rem" }}>
//                   {" "}
//                   <p>Question </p> {index + 1}
//                 </h3>

//                 <img
//                   src={`data:image/png;base64,${question.question_img}`}
//                   alt="Question"
//                 />
//               </div>
//               <br></br>
//               <input type="file" id={`question${question.question_id}`} />
//               <input
//                 type="button"
//                 value="Change"
//                 onClick={() =>
//                   handlechange(
//                     "question",
//                     question.question_id,
//                     document.getElementById(`question${question.question_id}`).files[0]
//                   )
//                 }
//               />              {data.options
//                 .filter((opt) => opt.question_id === question.question_id)
//                 .map((option, index) => (
//                   <div
//                     className="option"
//                     key={option.question_id}
//                     style={{ display: "flex", gap: "1rem" }}
//                   >
//                     <span>{OptionLabels[index]}</span>
//                     <img
//                       src={`data:image/png;base64,${option.option_img}`}
//                       alt={`Option ${OptionLabels[index]}`}
//                     />
//                   </div>
//                 ))}

//               {data.solutions
//                 .filter((sol) => sol.question_id === question.question_id)
//                 .map((solution) => (
//                   <div className="solution">
//                     <h3>solution </h3>
//                     <img
//                       key={solution.question_id}
//                       src={`data:image/png;base64,${solution.solution_img}`}
//                       alt="Solution"
//                     />
//                   </div>
//                 ))}

//               {data.answers
//                 .filter((ans) => ans.question_id === question.question_id)
//                 .map((answer) => (
//                   <div key={answer.answer_id}>
//                     <h3>Answer</h3>
//                     {answer.answer_text}
//                   </div>
//                 ))}

//               {data.marks
//                 .filter((markes) => markes.question_id === question.question_id)
//                 .map((markes) => (
//                   <div key={markes.markesId}>
//                     <h3>Marks</h3>
//                     {markes.marks_text}
//                   </div>
//                 ))}

//               {data.qtypes
//                 .filter((qtype) => qtype.question_id === question.question_id)
//                 .map((qtype) => (
//                   <div key={qtype.qtypeId}>
//                     <h3>QType</h3>
//                     {qtype.qtype_text}
//                   </div>
//                 ))}

// {data.sortid
//                 .filter((sortid) => sortid.question_id === question.question_id)
//                 .map((sortid) => (
//                   <div key={sortid.sort_id}>
//                     <h3>sortid</h3>
//                     {sortid.sortid_text}
//                   </div>
//                 ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Document_ImageInfo;


import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
 
 
function Document_ImageInfo() {
  const [data, setData] = useState(null);
  const { subjectId, testCreationTableId, sectionId } = useParams();
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3081/getSubjectData/${testCreationTableId}/${subjectId}/${sectionId}`
      );
 
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
 
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      // Handle the error, e.g., show an error message to the user
    }
  };
 
  if (!data) {
    return <div>Loading...</div>;
  }
  const OptionLabels = ["(a)", "(b)", "(c)", "(d)"];
  // Render your component using the fetched data
  return (
    <div className="Document_-images_-container otsMainPages">
      {/* Access data as needed, for example: */}
      <h1>
        {data.document.documen_name} {data.document.subjectId}
        {data.document.testCreationTableId}
      </h1>
      {/* Map over questions and render them */}
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
        {data.questions.map((question, index) => (
          <div
            className="outColor examSubjects_-contant"
            style={{ background: "", padding: "2rem 2rem" }}
          >
            <div key={question.question_id}>
              <div className="question" key={index}>
                <h3 style={{ display: "flex", gap: "1rem" }}>
                  {" "}
                  <p>Question </p> {index + 1}
                </h3>
 
                <img
                  src={`http://localhost:3081/uploads/${data.document.documen_name}/${question.questionImgName}`}
                  alt="sdfs"
                />
              </div>
              {data.options
                .filter((opt) => opt.question_id === question.question_id)
                .map((option, index) => (
                  <div
                    className="option"
                    key={option.question_id}
                    style={{ display: "flex", gap: "1rem" }}
                  >
                    <span>{OptionLabels[index]}</span>
                    <img
                      src={`http://localhost:3081/uploads/${data.document.documen_name}/${option.optionImgName}`}
                      alt={`Option ${OptionLabels[index]}`}/>
                  </div>
                ))}
 
              {data.solutions
                .filter((sol) => sol.question_id === question.question_id)
                .map((solution) => (
                  <div className="solution">
                    <h3>solution </h3>
                    <img
                      key={solution.question_id}
                      src={`http://localhost:3081/uploads/${data.document.documen_name}/${solution.solutionImgName}`}
                      alt="Solution"
                    />
                  </div>
                ))}
 
              {data.answers
                .filter((ans) => ans.question_id === question.question_id)
                .map((answer) => (
                  <div key={answer.answer_id}>
                    <h3>Answer</h3>
                    {answer.answer_text}
                  </div>
                ))}
 
              {data.marks
                .filter((markes) => markes.question_id === question.question_id)
                .map((markes) => (
                  <div key={markes.markesId}>
                    <h3>Marks</h3>
                    {markes.marks_text}
                  </div>
                ))}
 
              {data.qtypes
                .filter((qtype) => qtype.question_id === question.question_id)
                .map((qtype) => (
                  <div key={qtype.qtypeId}>
                    <h3>QType</h3>
                    {qtype.qtype_text}
                  </div>
                ))}
            </div>
            <Link>delete</Link>
            <Link>Update</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
 
export default Document_ImageInfo;

