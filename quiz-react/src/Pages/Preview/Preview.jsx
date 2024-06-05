import React from "react";

const QuizPreviewPage = ({ questions, userAnswers, handleEditOption }) => {
  return (
    <div>
      <h2>Preview</h2>
      {/* Loop through questions and display each question with selected answer and edit button */}
      {questions.map((question, index) => (
        <div key={index}>
          <h3>Question {index + 1}</h3>
          <p>{question.question_text}</p>
          <p>
            Selected Answer:{" "}
            {userAnswers[index]?.answer === ""
              ? "No answer selected"
              : userAnswers[index]?.answer}
            <button onClick={() => handleEditOption(index)}>
              Edit
            </button>
          </p>
        </div>
      ))}
    </div>
  );
};

export default QuizPreviewPage;
