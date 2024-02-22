function Options({ question, answerIndex, dispatch }) {
  const isAnswered = answerIndex !== null;

  return (
    <div className="options">
      {question.options.map((option, i) => (
        <button
          key={option}
          className={`btn btn-option ${
            isAnswered
              ? question.correctOption === i
                ? "correct"
                : "wrong"
              : ""
          } ${answerIndex === i ? "answer" : ""}`}
          onClick={() =>
            dispatch({
              type: "answered",
              answerIndex: i,
            })
          }
          disabled={isAnswered}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
