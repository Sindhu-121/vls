import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const UpdateQuestion = () => {
  const { question_id } = useParams();
  const [questionData, setQuestionData] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    question: "",
    options: [],
    solution: "",
  });
  const [answer, setAnswer] = useState("");
  const [marks, setMarks] = useState("");
  const [qtype, setQType] = useState("");
  const [file, setFile] = useState(null);

const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleQuestionFileChange = (e) => {
    const selectedFile = e.target.files[0];
    // Handle the selected file for the question
    setFile(selectedFile);
  };

  const handleOptionFileChange = (index, e) => {
    const selectedFile = e.target.files[0];
    // Handle the selected file for the specific option at index
  };

  const handleSolutionFileChange = (e) => {
    const selectedFile = e.target.files[0];
    // Handle the selected file for the solution
    setFile(selectedFile);
  };

  const formData = new FormData();
  formData.append("images", file);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("images", file);

    try {
      const response = await axios.put(
        `http://localhost:3081/updateQuestion/${question_id}`,
        formData
      );

      console.log(response.data); // Log the server response
      // Handle success (e.g., show a success message to the user)
    } catch (error) {
      console.error("Error updating question:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };
  useEffect(() => {
    // Fetch question data based on the questionId from the URL
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3081/singleQuetionRAU/${question_id}`
        );
        const data = await response.json();
        setQuestionData(data);
     if (data) {
          setUpdatedData({
            question: data.question,
            options: data.options,
            solution: data.solution,
          }); 
          setAnswer(data.answer_text);
          setMarks(data.marks);
          setQType(data.qtype);
        }
      } catch (error) {
        console.error("Error fetching question data:", error);
      }
    };

    fetchData();
  }, [question_id]);

  const OptionLabels = ["(a)", "(b)", "(c)", "(d)"];

  return (
    <form encType="multipart/form-data" onSubmit={handleSubmit}>
      <div className="otsMainPages">
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
            {questionData &&
              questionData.questions.map((question, index) => (
                <div
                  className="outColor examSubjects_-contant"
                  style={{ background: "", padding: "2rem 2rem" }}
                  key={`question_${question.question_id}_${index}`}
                >
                  <div  key={`question_${question.question_id}_${index}`}>
                    <div className="question">
                      <h3 style={{ display: "flex", gap: "1rem" }}>
                        {" "}
                        <p>Question </p> {questionData.question_id}
                      </h3>

                      <img
                        src={`data:image/png;base64,${question.question_img}`}
                        alt="Question"
                      />
                      <input
                        type="file"
                        name="question"
                        accept="image/*"
                        value={updatedData.question}
                        onChange={(e) => handleQuestionFileChange(e)}
                      />
                    </div>

                    {questionData.options &&
                      questionData.options
                        .filter(
                          (opt) => opt.question_id === question.question_id
                        )
                        .map((option, index) => (
                          <div
                            className="option"
                            key={option.question_id}
                            style={{ display: "flex", gap: "1rem" }}
                          >
                            <span>{OptionLabels[index]}</span>
                            <img
                              src={`data:image/png;base64,${option.option_img}`}
                              alt={`Option ${OptionLabels[index]}`}
                            />
                            <input
                              type="file"
                              value={option.option}
                              onChange={(e) => handleOptionFileChange(index, e)}
                            />
                          </div>
                        ))}

                    {questionData.solutions &&
                      questionData.solutions
                        .filter(
                          (sol) => sol.question_id === question.question_id
                        )
                        .map((solution) => (
                          <div className="solution">
                            <h3>solution </h3>
                            <img
                              key={solution.question_id}
                              src={`data:image/png;base64,${solution.solution_img}`}
                              alt="Solution"
                            />
                            <input
                              type="file"
                              name="solution"
                              value={updatedData.solution}
                              onChange={(e) => handleSolutionFileChange(e)}
                            />
                          </div>
                        ))}

                    {questionData.answers &&
                      questionData.answers
                        .filter(
                          (ans) => ans.question_id === question.question_id
                        )
                        .map((answer) => (
                          <div key={answer.answer_id}>
                            <h3>Answer</h3>
                            {answer.answer_text}
                            <input
                              type="text"
                              name="answer"
                              value={answer || " "}
                                onChange={(e) => setAnswer(e.target.value)}
                            />
                          </div>
                        ))}

                    {questionData.marks &&
                      questionData.marks
                        .filter(
                          (markes) =>
                            markes.question_id === question.question_id
                        )
                        .map((markes) => (
                          <div key={markes.markesId}>
                            <h3>Marks</h3>
                            {markes.marks_text}
                            <input
                              type="text"
                              name="marks"
                              value={marks || " "}
                              onChange={(e) => setMarks(e.target.value)}
                            />
                          </div>
                        ))}

                    {questionData.qtypes &&
                      questionData.qtypes
                        .filter(
                          (qtype) => qtype.question_id === question.question_id
                        )
                        .map((qtype) => (
                          <div key={qtype.qtypeId}>
                            <h3>QType</h3>
                            {qtype.qtype_text}
                            <input
                              type="text"
                              name="qtype"
                              value={qtype || " "}
                              onChange={(e) => setQType(e.target.value)}
                            />
                          </div>
                        ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <button type="submit">Update Question</button>
    </form>
  );
};

export default UpdateQuestion;
