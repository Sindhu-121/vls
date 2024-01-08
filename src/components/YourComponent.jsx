import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const YourComponent = () => {
  const [questionData, setQuestionData] = useState({});
  const { question_id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3081/quizRAU/${question_id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setQuestionData(data);
      } catch (error) {
        console.error('Error fetching question data:', error);
      }
    };

    fetchData();
  }, [question_id]);

  return (
    <div className="otsMainPages">
      <p>Hello</p>
      {/* Display question details */}
      {questionData.question && (
        <div>
          <h3>Question {questionData.question.question_id}</h3>
          <img
            src={`http://localhost:3081/uploads/${questionData.question.documen_name}/${questionData.question.questionImgName}`}
            alt={`Question ${questionData.question.question_id}`}
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
        </div>
      )}
    </div>
  );
};

export default YourComponent;
